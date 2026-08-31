import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm",
        "placeholder:text-black/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold",
        "dark:border-white/10 dark:bg-bg-dark dark:text-white",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
