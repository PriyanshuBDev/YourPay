"use client";

import { useRouter } from "next/navigation";

export default function RedirectString({
  label,
  to,
}: {
  label: string;
  to: string;
}) {
  const router = useRouter();
  return (
    <div
      className={`cursor-pointer text-purple-500 hover:underline focus:outline-none  font-semibold  text-2xl `}
      onClick={() => {
        router.push(to);
      }}
    >
      {label}
    </div>
  );
}
