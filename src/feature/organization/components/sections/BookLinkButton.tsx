"use client";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useGetOrgDetailsByWebName } from "../../hooks/useGetOrgByWebName";

const BookLinkButton = () => {
  const { data } = useGetOrgDetailsByWebName();
  return (
    <Button size="lg" className="gap-1" asChild>
      <Link href={`/o/${data?.doctorWebName}/enroll`}>
        <Smartphone className="h-5 w-5" />
        Book Your Appointment Now
      </Link>
    </Button>
  );
};

export default BookLinkButton;
