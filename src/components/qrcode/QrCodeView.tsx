"use client";
import { QRCodeCanvas } from "qrcode.react";
import React from "react";

interface QrCodeViewProps
  extends React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  value: string;
  size?: number; // Add size for pixel density
}

const QrCodeView = ({ value, size = 1024, ...rest }: QrCodeViewProps) => {
  return (
    <QRCodeCanvas
      value={value}
      size={size} // High pixel density
      {...rest}
    />
  );
};

export default QrCodeView;
