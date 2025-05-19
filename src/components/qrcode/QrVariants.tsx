import React from "react";
import QrCodeView from "./QrCodeView";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { useGetOrgDetailsByWebName } from "@/feature/organization/hooks/useGetOrgByWebName";

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
  const { data: orgDetails } = useGetOrgDetailsByWebName();
  const webNameLength = orgDetails?.doctorWebName?.length || 24;

  const fontSize =
    webNameLength < 25
      ? "2xl"
      : webNameLength <= 30
        ? "xl"
        : webNameLength <= 35
          ? "lg"
          : webNameLength <= 40
            ? "base"
            : "xs";

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
        <div
          className={`qr-card relative flex aspect-square w-[40rem] max-w-full flex-col items-center overflow-hidden rounded-xl bg-contain bg-no-repeat px-0 pt-16 shadow-lg ${orgDetails?.orgType === "HOSPITAL" ? "bg-[url(/qr-bg.png)]" : "bg-[url(/other-qr-bg.jpg)]"} `}
        >
          <div
            ref={qrRef}
            className="mb-5 w-full max-w-md text-start text-xl font-semibold text-blue-900"
          >
            <p>Book Your appointment </p>
            <p>
              with
              <span className={`mx-1 font-bold uppercase ${fontSize}`}>
                {decodeURIComponent(webName)}
              </span>
            </p>
          </div>
          <p className="text-lg text-primary">
            No waiting no stress just scan and relax.
          </p>
          <div className="my-4 mr-4 max-w-full">
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
          <p className="bottom-28 max-w-64 text-center text-xl font-bold text-primary">
            Save your energy for healing,not standing.
          </p>
        </div>
      );
    default:
      return null;  
  }
};

export default QrVariants;
