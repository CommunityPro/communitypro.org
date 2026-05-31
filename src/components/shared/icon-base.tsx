import React from "react";

import { cn } from "@/lib";

interface Props extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
  className?: string;
  viewBox?: string;
}

export const IconBase = ({ children, className, viewBox = "0 0 24 24", ...props }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} className={cn("", className)} {...props}>
      {children}
    </svg>
  );
};
