"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function RedirectButton({
  children,
  to,
}: {
  children: ReactNode;
  to: string;
}) {
  const router = useRouter();
  return (
    <div
      className={`cursor-pointer text-white bg-purple-500 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-lg px-3 py-2 me-2 mb-2 `}
      onClick={() => {
        router.push(to);
      }}
    >
      {children}
    </div>
  );
}
