"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Coins, Layout, LogOut, Tv, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
// import LoginButton from "@/components/buttons/LoginButton";
import Link from "next/link";
import LoginButton from "./LoginButton";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import useGetUserOrg from "@/feature/organization/hooks/useGetUserOrg";
import { getOrgPath } from "@/lib/utils/stringUtils";
// import { useRouter } from "next/navigation";
// import { signOut } from "next-auth/react";

export const UserButton = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const { data } = useGetUserOrg();

  const onClick = async () => {
    await signOut({ callbackUrl: "/" });
    router.refresh();
  };

  const orgPath = getOrgPath(data?.organizations?.webName);

  return (
    <React.Fragment key={`user-${user?.id}`}>
      {user?.id ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar key={user?.image}>
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-primary">
                <User className="text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 space-y-2" align="end">
            <DropdownMenuItem className="flex cursor-pointer gap-4" asChild>
              <Link href={`/token/t/${user?.phone}`}>
                <Coins className="mr-2 h-4 w-4" />
                <span>Recent Token</span>
              </Link>
            </DropdownMenuItem>
            {(user.role === "RECEPTIONIST" ||
              user.role === "ADMIN" ||
              user.role === "SUPER_ADMIN") &&
              data?.organizations?.webName && (
                <>
                  <DropdownMenuItem
                    className="flex cursor-pointer gap-4"
                    asChild
                  >
                    <Link href={`${orgPath}/token/search`}>
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Appointments</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex cursor-pointer gap-4"
                    asChild
                  >
                    <Link href={`${orgPath}/token/display`}>
                      <Tv className="mr-2 h-4 w-4" />
                      <span>Display</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

            {(user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
              <DropdownMenuItem className="flex cursor-pointer gap-4" asChild>
                <Link
                  href={
                    user.role === "SUPER_ADMIN"
                      ? `/admin/dashboard`
                      : `${orgPath}`
                  }
                >
                  <Layout className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={onClick}
              className="flex cursor-pointer gap-4"
              asChild
            >
              <Button
                type="button"
                className="flex w-full justify-start hover:border-destructive"
                variant="ghost"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <LoginButton />
      )}
    </React.Fragment>
  );
};
