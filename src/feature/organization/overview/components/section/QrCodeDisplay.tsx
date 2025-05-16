"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, ExternalLink } from "lucide-react";
import html2canvas from "html2canvas";
import QrCodeView from "@/components/qrcode/QrCodeView";
import Link from "next/link";

interface QrCodeViewProps
  extends React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  value: string;
  webName: string;
  size?: number;
  title?: string;
  logoUrl?: string;
}

const QrCodeDisplay = ({
  value,
  webName,
  //   size = 256,
  title = "Scan QR Code",
  //   logoUrl,
}: QrCodeViewProps) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!qrRef.current) return;

    try {
      // Show loading state
      setIsDownloading(true);

      // Use html2canvas to capture the entire card
      const cardElement = qrRef.current.closest(".qr-card");
      if (!cardElement) return;

      const canvas = await html2canvas(cardElement as HTMLElement, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
      });

      // Create a temporary link element
      const link = document.createElement("a");
      link.download = `${webName}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating QR code image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="qr-card max-w-md overflow-hidden shadow-lg">
      <div className="qr-card bg-white rounded-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-center text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div ref={qrRef} className="rounded-lg p-4 shadow-inner">
            {/* <QRCodeCanvas
            value={value}
            size={size}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            imageSettings={
              logoUrl
                ? {
                    src: logoUrl,
                    x: undefined,
                    y: undefined,
                    height: size * 0.2,
                    width: size * 0.2,
                    excavate: true,
                  }
                : undefined
            }
            {...rest}
          /> */}
            <QrCodeView
              value={value}
              size={1024}
              className="object-contain"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex flex-col justify-center gap-4 pb-6">
        <Link
          href={value}
          target="_blank"
          className="flex space-x-2 text-blue-500"
        >
          <ExternalLink /> View Link
        </Link>
        <Button
          onClick={handleDownload}
          className="gap-2"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <span className="mr-2 animate-spin">⏳</span>
              Generating...
            </>
          ) : (
            <>
              <Download size={18} />
              Download QR Code
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QrCodeDisplay;
