import React from "react";
import { cn } from "@/utils/cn";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export const Spotlight = ({ className, fill = "white" }: SpotlightProps) => {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none opacity-30",
        className
      )}
    >
      <div
        className="absolute -inset-10 opacity-20"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), ${
            fill === "white" ? "rgba(255, 255, 255, 0.1)" : fill
          }, transparent 40%)`,
        }}
      />
    </div>
  );
};

export default Spotlight;
