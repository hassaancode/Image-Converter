"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: number;
  total: number;
  current: number;
}

export function ProgressIndicator({
  progress,
  total,
  current,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Converting {current} of {total}
        </p>
        <p className="text-sm font-medium">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
