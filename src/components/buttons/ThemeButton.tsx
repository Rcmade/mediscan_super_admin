"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
export function ThemeButton() {
  const { setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {};
  }, []);

  if (!isMounted) return null;

  return (
    <Button
      onClick={() => setTheme(() => (theme === "dark" ? "light" : "dark"))}
      variant="ghost"
      className={"text-primary"}
      size="icon"
    >
      {theme === "dark" ? <Moon className="" /> : <Sun className="" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>

    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    //     <DropdownMenuItem onClick={() => setTheme("light")}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("dark")}>
    //       Dark
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("system")}>
    //       System
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}
