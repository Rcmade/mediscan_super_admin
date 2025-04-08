import { cn } from "@/lib/utils";
import React from "react";

interface ResponsiveTableWrapperProps {
  className?: string;
  children: React.ReactNode;
}
const ResponsiveTableWrapper = ({
  className,
  children,
}: ResponsiveTableWrapperProps) => {
  return (
    <div
      className={cn(
        "scrollbar grid w-full grid-cols-1 overflow-x-auto rounded-md border",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ResponsiveTableWrapper;
