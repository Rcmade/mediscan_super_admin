"use client";
import useWebName from "@/hooks/useWebName";
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
  const { webName } = useWebName();
  return (
    <Link
      {...rest}
      href={webName ? `/o/${webName}/enroll` : "/"}
      className={cn(
        "inline-block bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-4xl font-black capitalize text-transparent dark:to-purple-700",
        className,
      )}
    >
      {webName
        ? `Shivaay ${decodeURIComponent(webName)}`
        : `Shivaay ${process.env.NEXT_PUBLIC_WEB_NAME}` || "Shivaay MediScan"}
    </Link>
  );
};

export default LogoButton;
