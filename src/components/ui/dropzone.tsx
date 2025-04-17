"use client";

import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import React, { useCallback, useState } from "react";

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
  className?: string;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  disabled?: boolean;
}

export function Dropzone({
  onFilesDrop,
  className,
  maxFiles = 10,
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  disabled = false,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);

      // Filter files by accepted types
      const validFiles = files.filter((file) =>
        acceptedFileTypes.includes(file.type),
      );

      // Limit number of files
      const limitedFiles = validFiles.slice(0, maxFiles);

      if (limitedFiles.length > 0) {
        onFilesDrop(limitedFiles);
      }
    },
    [onFilesDrop, acceptedFileTypes, maxFiles, disabled],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || !e.target.files?.length) return;

      const files = Array.from(e.target.files);

      // Filter files by accepted types
      const validFiles = files.filter((file) =>
        acceptedFileTypes.includes(file.type),
      );

      // Limit number of files
      const limitedFiles = validFiles.slice(0, maxFiles);

      if (limitedFiles.length > 0) {
        onFilesDrop(limitedFiles);
      }
    },
    [onFilesDrop, acceptedFileTypes, maxFiles, disabled],
  );

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-64 p-6 border-2 border-dashed rounded-lg transition-colors",
        isDragging
          ? "border-primary bg-secondary/50"
          : "border-border bg-background",
        disabled && "opacity-60 cursor-not-allowed",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept={acceptedFileTypes.join(",")}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleFileInputChange}
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center text-center">
        <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">Drag & drop images here</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          or click to browse your files
        </p>
        <p className="text-xs text-muted-foreground">
          Supported formats: JPG, PNG, WebP, GIF
        </p>
        <p className="text-xs text-muted-foreground">
          Max {maxFiles} files at once
        </p>
      </div>
    </div>
  );
}
