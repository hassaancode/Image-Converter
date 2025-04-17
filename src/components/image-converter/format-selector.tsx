"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export type ImageFormat = "jpg" | "png" | "webp" | "gif";

interface FormatSelectorProps {
  selectedFormat: ImageFormat;
  onFormatChange: (format: ImageFormat) => void;
  disabled?: boolean;
}

export function FormatSelector({
  selectedFormat,
  onFormatChange,
  disabled = false,
}: FormatSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedFormat.toUpperCase()}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full" align="center">
        <DropdownMenuRadioGroup
          value={selectedFormat}
          onValueChange={(value) => onFormatChange(value as ImageFormat)}
        >
          <DropdownMenuRadioItem value="jpg">JPG</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="png">PNG</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="webp">WebP</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="gif">GIF</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
