import clsx from "clsx";
import type { ReactNode } from "react";

interface BlurFadeProps {
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

export const BlurFade = ({ loading, children, className }: BlurFadeProps) => (
  <div className={clsx("transition-all duration-500", loading ? "blur-[3px] opacity-60" : "blur-0 opacity-100", className)}>
    {children}
  </div>
);
