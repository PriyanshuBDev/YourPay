"use client";

import { useState } from "react";
import { toggleQUser } from "../lib/actions/toggleQUser";

export default function QuickUserBtn({
  id,
  isDisable,
}: {
  id: string;
  isDisable: boolean;
}) {
  const [enable, setEnable] = useState(isDisable);

  return (
    <button
      className={`cursor-pointer font-medium h-fit rounded-full text-lg px-3 py-2 me-2 mb-2 ${enable ? "text-gray-500 bg-gray-200 hover:bg-gray-300 " : "text-white bg-purple-500 hover:bg-purple-700 "}`}
      onClick={async () => {
        await toggleQUser(id);
        setEnable((prev) => !prev);
      }}
    >
      {enable ? "Quick User" : "Add"}
    </button>
  );
}
