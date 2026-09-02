import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { buttonClasses, type ButtonVariant } from "@/components/ui/button";

interface LinkButtonProps extends LinkProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
}

/**
 * A Next.js <Link> styled to look exactly like <Button>, for navigation
 * (not form submission / onClick actions). Use this instead of wrapping
 * <Button> inside <Link> — nesting a real <button> inside an <a> is
 * invalid HTML and can silently fail to navigate on click in some browsers.
 */
export function LinkButton({ variant = "primary", className, children, ...props }: LinkButtonProps) {
  return (
    <Link className={buttonClasses(variant, className)} {...props}>
      {children}
    </Link>
  );
}
