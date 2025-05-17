import React from "react";
import QrCodeView from "./QrCodeView";
import { CardContent, CardHeader, CardTitle } from "../ui/card";

interface QrVariantsProps {
  qrRef: React.RefObject<HTMLDivElement | null>;
  webName: string;
  value: string;
  variant: "queue" | "scannable";
  title?: string;
}
const QrVariants = ({
  qrRef,
  value,
  webName,
  variant,
  title,
}: QrVariantsProps) => {
  switch (variant) {
    case "scannable":
      return (
        <div className="qr-card max-w-lg rounded-lg bg-white">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-center text-primary">{title}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <div ref={qrRef} className="rounded-lg p-4 shadow-inner">
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
      );
    case "queue":
      return (
        <div className="qr-card relative flex aspect-square w-[40rem] max-w-full items-center justify-center overflow-hidden rounded-xl bg-[url(/qr-bg.png)] bg-contain bg-no-repeat px-0 shadow-lg">
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
          <div className="max-w-full">
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
      );
    default:
      return null;
  }
};

export default QrVariants;
