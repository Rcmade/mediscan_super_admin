"use client";
import Description from "@/feature/organization/components/sections/Description";
import { useGetOrgDetailsByWebName } from "@/feature/organization/hooks/useGetOrgByWebName";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Skeleton } from "../ui/skeleton";

const LogoButton = ({
  className,
  ...rest
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) => {
  // const { webName } = useWebName();
  const { data, isLoading } = useGetOrgDetailsByWebName();
  const webName = data?.doctorWebName;

  if (isLoading) return <Skeleton className="h-8 w-24 max-w-full p-2" />;

  return (
    <Link
      {...rest}
      href={webName ? `/o/${webName}/enroll` : "/"}
      className={cn(
        "flex  md:items-end md:flex-row flex-col bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-4xl font-black capitalize text-transparent dark:to-purple-700",
        className,
      )}
    >
      {webName
        ? `${decodeURIComponent(webName)}`
        : `${process.env.NEXT_PUBLIC_WEB_NAME}` || "MediScan"}
      <Description />
    </Link>
  );
};

export default LogoButton;
