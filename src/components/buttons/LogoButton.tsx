"use client";
import Description from "@/feature/organization/components/sections/Description";
import { useGetOrgDetailsByWebName } from "@/feature/organization/hooks/useGetOrgByWebName";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePathname } from "next/navigation";

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
  const user = useCurrentUser();
  const pathName = usePathname();

  if (isLoading) return <Skeleton className="h-8 w-24 max-w-full p-2" />;

  return (
    <Link
      {...rest}
      href={webName ? `/o/${webName}/enroll` : "/"}
      className={cn(
        "flex flex-col bg-gradient-to-r from-red-600 to-purple-900 bg-clip-text text-4xl font-black capitalize text-transparent dark:to-purple-700 md:flex-row md:items-end",
        className,
      )}
    >
      {webName
        ? `${decodeURIComponent(webName)}`
        : `${process.env.NEXT_PUBLIC_WEB_NAME}` || "MediScan"}
      <Description />
      {pathName?.includes("admin") &&
        (user?.role === "ADMIN" ||
          user?.role === "RECEPTIONIST" ||
          user?.role === "SUPER_ADMIN") && (
          <span className="text-sm text-primary">({user?.role})</span>
        )}
    </Link>
  );
};

export default LogoButton;
