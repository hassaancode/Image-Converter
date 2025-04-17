"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dropzone } from "@/components/ui/dropzone";
import { Download, FileText, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { ConversionOptions } from "./conversion-options";
import { ImageFormat } from "./format-selector";
import { ImageGrid } from "./image-grid";
import { ProgressIndicator } from "./progress-indicator";
import {
  ConvertedImage,
  convertImage,
  createPdfFromImages,
  createZipFile,
  downloadFile,
} from "@/lib/image-converter";

export function ImageConverter() {
  // State for uploaded files
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  // State for conversion options
  const [format, setFormat] = useState<ImageFormat>("jpg");
  const [quality, setQuality] = useState(80);

  // State for conversion process
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);

  // State for converted files
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);

  // Handle file drop
  const handleFilesDrop = useCallback(
    (newFiles: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      // Auto-select new files
      const newSelectedFiles = new Set(selectedFiles);
      newFiles.forEach((file) => {
        const fileId = `${file.name}-${file.size}-${file.lastModified}`;
        newSelectedFiles.add(fileId);
      });
      setSelectedFiles(newSelectedFiles);
    },
    [selectedFiles],
  );

  // Handle file selection
  const handleSelectFile = useCallback((fileId: string) => {
    setSelectedFiles((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(fileId)) {
        newSelected.delete(fileId);
      } else {
        newSelected.add(fileId);
      }
      return newSelected;
    });
  }, []);

  // Handle file removal
  const handleRemoveFile = useCallback((fileId: string) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((file) => {
        const currentFileId = `${file.name}-${file.size}-${file.lastModified}`;
        return currentFileId !== fileId;
      });
    });

    setSelectedFiles((prev) => {
      const newSelected = new Set(prev);
      newSelected.delete(fileId);
      return newSelected;
    });
  }, []);

  // Handle clear all files
  const handleClearFiles = useCallback(() => {
    setFiles([]);
    setSelectedFiles(new Set());
    setConvertedImages([]);
  }, []);

  // Handle conversion
  const handleConvert = useCallback(async () => {
    if (files.length === 0 || selectedFiles.size === 0) return;

    setIsConverting(true);
    setProgress(0);
    setCurrentFile(0);
    setConvertedImages([]);

    const filesToConvert = files.filter((file) => {
      const fileId = `${file.name}-${file.size}-${file.lastModified}`;
      return selectedFiles.has(fileId);
    });

    const converted: ConvertedImage[] = [];

    for (let i = 0; i < filesToConvert.length; i++) {
      setCurrentFile(i + 1);
      setProgress(((i + 1) / filesToConvert.length) * 100);

      try {
        const result = await convertImage(filesToConvert[i], format, quality);
        converted.push(result);
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }

    setConvertedImages(converted);
    setIsConverting(false);
  }, [files, selectedFiles, format, quality]);

  // Handle download single file
  const handleDownloadFile = useCallback((image: ConvertedImage) => {
    downloadFile(image.blob, image.filename);
  }, []);

  // Handle download all files as zip
  const handleDownloadZip = useCallback(async () => {
    if (convertedImages.length === 0) return;

    try {
      const zipBlob = await createZipFile(convertedImages);
      downloadFile(zipBlob, "converted-images.zip");
    } catch (error) {
      console.error("Error creating zip file:", error);
    }
  }, [convertedImages]);

  // Handle convert to PDF
  const handleConvertToPdf = useCallback(async () => {
    if (files.length === 0 || selectedFiles.size === 0) return;

    setIsConverting(true);
    setProgress(0);
    setCurrentFile(0);

    try {
      // Get selected files
      const filesToConvert = files.filter((file) => {
        const fileId = `${file.name}-${file.size}-${file.lastModified}`;
        return selectedFiles.has(fileId);
      });

      // Update progress as we process
      for (let i = 0; i < filesToConvert.length; i++) {
        setCurrentFile(i + 1);
        setProgress(((i + 1) / filesToConvert.length) * 100);
        // Small delay to show progress
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Create PDF from selected images
      const pdfBlob = await createPdfFromImages(filesToConvert);

      // Download the PDF
      downloadFile(pdfBlob, "converted-images.pdf");
    } catch (error) {
      console.error("Error creating PDF:", error);
    } finally {
      setIsConverting(false);
    }
  }, [files, selectedFiles]);

  return (
    <div className="space-y-6">
      {/* Upload section */}
      <Card className="overflow-hidden">
        <Dropzone onFilesDrop={handleFilesDrop} />
      </Card>

      {/* Image grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {files.length} {files.length === 1 ? "Image" : "Images"} (
              {selectedFiles.size} selected)
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFiles}
              disabled={isConverting}
            >
              <Trash className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>

          <ImageGrid
            files={files}
            selectedFiles={selectedFiles}
            onSelectFile={handleSelectFile}
            onRemoveFile={handleRemoveFile}
          />
        </div>
      )}

      {/* Conversion options */}
      {files.length > 0 && (
        <ConversionOptions
          selectedFormat={format}
          onFormatChange={setFormat}
          quality={quality}
          onQualityChange={setQuality}
          onConvert={handleConvert}
          isConverting={isConverting}
          disabled={selectedFiles.size === 0}
        />
      )}

      {/* Progress indicator */}
      {isConverting && (
        <div className="mt-4">
          <ProgressIndicator
            progress={progress}
            total={selectedFiles.size}
            current={currentFile}
          />
        </div>
      )}

      {/* Converted files */}
      {convertedImages.length > 0 && !isConverting && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Converted Images</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConvertToPdf}
                disabled={isConverting}
              >
                <FileText className="mr-2 h-4 w-4" />
                Convert to PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadZip}>
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {convertedImages.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-md border bg-background"
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img
                    src={URL.createObjectURL(image.blob)}
                    alt={image.filename}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="truncate text-xs">{image.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {(image.blob.size / 1024).toFixed(1)} KB
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 w-full"
                    onClick={() => handleDownloadFile(image)}
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
