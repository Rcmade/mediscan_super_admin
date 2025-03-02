"use client";
// import { signIn } from "next-auth/react";
// import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface LoginButtonProps {
  className?: string;
}
const LoginButton = ({}: LoginButtonProps) => {
  // const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      // disabled={isLoading}
      // onClick={async () => {
      //   setIsLoading(true);
      //   await signIn("rauth");
      //   setTimeout(() => {
      //     setIsLoading(false);
      //   }, 0);
      // }}
      size="sm"
      asChild
    >
      <Link href="/auth/login">Sign in</Link>
    </Button>
  );
};

export default LoginButton;
