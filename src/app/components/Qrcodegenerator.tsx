"use client";
// url ="upi://pay?pa=8795157597@axl&pn=Aishwary%20%20Gupta&am=1.00&cu=INR&tn=PAYMENT_NOTE", 
// logoUrl = "/Mindsettler_logoHeart.png", // Put your logo in the public folder

import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import Image from "next/image";

// A 1x1 transparent pixel to trick the library into clearing the center
const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const ManualCenterQRCode = ({ 
  url = "upi://pay?pa=8795157597@axl&pn=Aishwary%20%20Gupta&am=1.00&cu=INR&tn=PAYMENT_NOTE", 
  logoUrl ="/Mindsettler_logoHeart.png", // Ensure this path is correct
  size = 150,
}) => {
  const qrRef = useRef(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: url,
      image: TRANSPARENT_PIXEL, // Use transparent image to create the "hole"
      
      dotsOptions: {
        color: "#4267b2",
        type: "rounded",
        gradient: {
          type: "linear",
          rotation: 45,
          colorStops: [
            { offset: 0, color: "#8b5cf6" }, // Purple
            { offset: 1, color: "#ec4899" }, // Pink
          ],
        },
      },
      imageOptions: {
        hideBackgroundDots: true, // CRITICAL: Erases dots behind our transparent image
        imageSize: 0.40,           // Size of the empty zone (0.4 = 40% of QR)
        margin: 5,
        crossOrigin: "anonymous",
      },
      backgroundOptions: { color: "transparent" },
      cornersSquareOptions: { type: "extra-rounded", color: "#8b5cf6" },
      cornersDotOptions: { type: "dot", color: "#ec4899" },
    });

    if (qrRef.current) {
    //   qrRef.current.inn     erHTML = "";
      qrCode.current?.append(qrRef.current);
    }
  }, [url, size]);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({ data: url });
    }
  }, [url]);

  // Calculate logo size based on the "imageSize" we set above (0.4)
  // 350px * 0.4 = 140px. We use slightly less to fit comfortably.
  const overlaySize = size * 0.30; 

  return (
    <div className="relative flex justify-center items-center">
      
      {/* 1. The QR Code Canvas */}
      <div 
        ref={qrRef} 
        className="bg-purple2 p-2 relative rounded-3xl shadow-2xl"
      />

      {/* 2. Your Manual Custom Logo Container */}
      <div 
        className="absolute top-1/2 left-1/2 p-1 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur- bg-purple2 border-xs rounded-xl shadow-lg flex items-center justify-center z-10"
        style={{ width: overlaySize, height: overlaySize }}
      >
        <Image
            src={logoUrl}
            alt="Logo"
            width={Math.round(overlaySize * 2)}
            height={Math.round(overlaySize * 0.1)}
            className="object-contain"
          />
      </div>

    </div>
  );
};

export default ManualCenterQRCode;