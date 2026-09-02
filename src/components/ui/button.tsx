import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-navy text-white hover:bg-navy/90 focus-visible:ring-gold",
  secondary: "bg-gold text-navy hover:bg-gold/90 focus-visible:ring-navy",
  ghost: "bg-transparent text-navy hover:bg-navy/5 dark:text-white dark:hover:bg-white/10",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400"
};

/**
 * Shared class string for anything that should LOOK like a button but
 * ISN'T a real <button> — e.g. a Next.js <Link>. Never nest an actual
 * <button> inside an <a> (invalid HTML, unreliable clicks in some
 * browsers); use this on the <Link> itself instead. See LinkButton below.
 */
export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl2 px-5 py-2.5 text-sm font-medium",
    "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2",
    variantClasses[variant],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        buttonClasses(variant),
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
