"use client";

import { useEffect } from "react";

interface CustomAlertBinds {
  msg: string;
  type?: "success" | "error" | "info" | "warning";
  onClose?: () => void;
}

export function CustomAlert({ msg, type = "info", onClose }: CustomAlertBinds) {
  useEffect(() => {
    const timeOut = setTimeout(() => {
      onClose?.();
    }, 3000);
    return () => clearInterval(timeOut);
  }, [onClose]);

  const colorMap = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 border px-4 py-3 rounded-md shadow-lg z-100 transition-all duration-300 ${colorMap[type]}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm">{msg}</span>
        <button onClick={onClose} className="cursor-pointer">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
