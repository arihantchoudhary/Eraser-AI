"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className={cn(
            "peer h-4 w-4 appearance-none rounded border border-gray-300 bg-white",
            "checked:bg-blue-600 checked:border-blue-600",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <svg
          className="absolute left-0 top-0 h-4 w-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
