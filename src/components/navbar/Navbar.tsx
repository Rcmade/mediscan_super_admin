"use client";
import React, { Suspense } from "react";
import LogoButton from "../buttons/LogoButton";
import { UserButton } from "../buttons/UserButton";
import { useSidebar } from "../ui/sidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { toggleSidebar } = useSidebar();
  const user = useCurrentUser();

  return (
    <nav className="flex items-center justify-between border-b px-2 py-4 md:px-4 lg:px-6">
      <Suspense>
        <LogoButton />
      </Suspense>
      <div className="flex items-center gap-2">
        {user?.role !== "USER" && (
          <Button onClick={toggleSidebar} size="sm" variant={"ghost"}>
            <Menu />
          </Button>
        )}
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
