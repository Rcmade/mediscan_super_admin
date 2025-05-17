"use client";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
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

const QrCodeQueueView = ({
  value,
  webName,
  //   size = 256,
  // title = "Scan QR Code",
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
    <div>
      <div className="qr-card relative flex aspect-square w-[40rem] items-center justify-center overflow-hidden rounded-xl bg-[url(/qr-bg.png)] bg-contain bg-center bg-no-repeat px-0 shadow-lg">
        <div
          ref={qrRef}
          className="absolute left-24 top-[4.2rem] text-xl font-semibold text-blue-900"
        >
          <p>Book Your appointment </p>
          <p>
            with
            <span className="mx-1 text-2xl font-bold uppercase">
              {decodeURIComponent(webName)}
            </span>
          </p>
        </div>
        <div className="">
          <QrCodeView
            value={value}
            size={225}
            className="object-contain"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
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
    </div>
  );
};

export default QrCodeQueueView;
