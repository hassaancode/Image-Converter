"use client";

import { cn } from "@/lib/utils";
import { Check, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImagePreviewProps {
  file: File;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  className?: string;
}

export function ImagePreview({
  file,
  selected,
  onSelect,
  onRemove,
  className,
}: ImagePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string>(() =>
    URL.createObjectURL(file),
  );

  // Clean up object URL on unmount
  useState(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  });

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-md border bg-background",
        selected ? "ring-2 ring-primary" : "ring-0",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={imageUrl}
          alt={file.name}
          fill
          className="object-cover transition-all"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onSelect}
          className={cn(
            "mr-2 rounded-full p-1.5",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground",
          )}
          aria-label={selected ? "Deselect image" : "Select image"}
        >
          {selected ? (
            <Check className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={onRemove}
          className="rounded-full bg-destructive p-1.5 text-destructive-foreground"
          aria-label="Remove image"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="p-2">
        <p className="truncate text-xs">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
    </div>
  );
}
