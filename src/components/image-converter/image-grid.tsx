"use client";

import { cn } from "@/lib/utils";
import { ImagePreview } from "./image-preview";

interface ImageGridProps {
  files: File[];
  selectedFiles: Set<string>;
  onSelectFile: (fileId: string) => void;
  onRemoveFile: (fileId: string) => void;
  className?: string;
}

export function ImageGrid({
  files,
  selectedFiles,
  onSelectFile,
  onRemoveFile,
  className,
}: ImageGridProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        className,
      )}
    >
      {files.map((file) => {
        const fileId = `${file.name}-${file.size}-${file.lastModified}`;
        return (
          <ImagePreview
            key={fileId}
            file={file}
            selected={selectedFiles.has(fileId)}
            onSelect={() => onSelectFile(fileId)}
            onRemove={() => onRemoveFile(fileId)}
          />
        );
      })}
    </div>
  );
}
