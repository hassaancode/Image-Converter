import { ImageFormat } from "@/components/image-converter/format-selector";

export interface ConvertedImage {
  blob: Blob;
  filename: string;
  originalFile: File;
}

export async function convertImage(
  file: File,
  format: ImageFormat,
  quality: number,
): Promise<ConvertedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0);

      // Convert to desired format
      const mimeType = getMimeType(format);
      const qualityValue = quality / 100; // Convert percentage to 0-1 range

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to convert image"));
            return;
          }

          // Generate new filename
          const originalName = file.name.substring(
            0,
            file.name.lastIndexOf("."),
          );
          const newFilename = `${originalName}.${format}`;

          resolve({
            blob,
            filename: newFilename,
            originalFile: file,
          });
        },
        mimeType,
        qualityValue,
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Load image from file
    img.src = URL.createObjectURL(file);
  });
}

function getMimeType(format: ImageFormat): string {
  switch (format) {
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}

export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function createZipFile(files: ConvertedImage[]): Promise<Blob> {
  // Import JSZip dynamically to avoid issues with SSR
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  // Add each file to the zip
  for (const file of files) {
    zip.file(file.filename, file.blob);
  }

  // Generate the zip file as a blob
  return await zip.generateAsync({ type: "blob" });
}

export async function createPdfFromImages(files: File[]): Promise<Blob> {
  // Import jsPDF dynamically to avoid issues with SSR
  const jsPDF = (await import("jspdf")).default;

  // Create a new PDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
  });

  // Process each image
  for (let i = 0; i < files.length; i++) {
    // Add a new page for each image after the first one
    if (i > 0) {
      pdf.addPage();
    }

    // Create an image element to get dimensions
    const img = await loadImage(files[i]);

    // Get image dimensions
    const imgWidth = img.width;
    const imgHeight = img.height;

    // Calculate the dimensions to fit the page
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate scaling to fit the page while maintaining aspect ratio
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const width = imgWidth * ratio;
    const height = imgHeight * ratio;

    // Calculate position to center the image
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;

    // Convert image to data URL
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    canvas.width = imgWidth;
    canvas.height = imgHeight;
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

    // Add image to PDF
    pdf.addImage(dataUrl, "JPEG", x, y, width, height);
  }

  // Generate PDF as blob
  const pdfBlob = pdf.output("blob");
  return pdfBlob;
}

// Helper function to load an image and get its dimensions
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
