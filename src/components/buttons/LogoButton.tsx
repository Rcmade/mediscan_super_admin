import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const LogoButton = ({
  className,
  ...rest
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) => {
  return (
    <Link
      {...rest}
      href="/"
      className={cn(
        "inline-block bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-4xl font-black text-transparent dark:to-purple-700",
        className,
      )}
    >
      {process.env.NEXT_PUBLIC_WEB_NAME || "MediScan"}
    </Link>
  );
};

export default LogoButton;
