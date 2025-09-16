"use client";

import { useState } from "react";

export default function EnableDisableBtn({
  onClick,
  DLabel,
  ELabel,
  isDisable,
}: {
  onClick: () => void;
  DLabel: string;
  ELabel: string;
  isDisable: boolean;
}) {
  const [enable, setEnable] = useState(isDisable);

  return (
    <button
      className={`cursor-pointer  font-medium rounded-full text-lg px-3 py-2 me-2 mb-2 ${enable ? "text-gray-500 bg-gray-200 hover:bg-gray-300 " : "text-white bg-purple-500 hover:bg-purple-700 "}`}
      onClick={() => {
        onClick();
        setEnable((prev) => !prev);
      }}
    >
      {enable ? ELabel : DLabel}
    </button>
  );
}
