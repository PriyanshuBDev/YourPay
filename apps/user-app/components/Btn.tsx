"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  active: boolean;
}

export const Btn = ({ children, onClick, active }: ButtonProps) => {
  return (
    <div
      className={`cursor-pointer  hover:bg-purple-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-lg px-3 py-2 me-2 mb-2 ${active ? "bg-purple-500 text-white" : "text-gray-800"}`}
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </div>
  );
};
