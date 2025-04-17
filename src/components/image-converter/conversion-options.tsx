"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FormatSelector, ImageFormat } from "./format-selector";

interface ConversionOptionsProps {
  selectedFormat: ImageFormat;
  onFormatChange: (format: ImageFormat) => void;
  quality: number;
  onQualityChange: (quality: number) => void;
  onConvert: () => void;
  isConverting: boolean;
  disabled?: boolean;
}

export function ConversionOptions({
  selectedFormat,
  onFormatChange,
  quality,
  onQualityChange,
  onConvert,
  isConverting,
  disabled = false,
}: ConversionOptionsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="format">Output Format</Label>
            <FormatSelector
              selectedFormat={selectedFormat}
              onFormatChange={onFormatChange}
              disabled={disabled || isConverting}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="quality">Quality</Label>
              <span className="text-sm text-muted-foreground">{quality}%</span>
            </div>
            <Slider
              id="quality"
              min={10}
              max={100}
              step={5}
              value={[quality]}
              onValueChange={(values) => onQualityChange(values[0])}
              disabled={disabled || isConverting}
            />
          </div>

          <Button
            className="w-full"
            onClick={onConvert}
            disabled={disabled || isConverting}
          >
            {isConverting ? "Converting..." : "Convert Images"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
