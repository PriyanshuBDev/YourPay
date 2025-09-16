"use client";

import { useRouter } from "next/navigation";

interface Props {
  label: string;
  direct: string;
}

export default function Btn2({ label, direct }: Props) {
  const router = useRouter();
  return (
    <button
      className="border-gray-300 border-3 hover:bg-gray-300 rounded-lg px-3 py-1 cursor-pointer bg-white"
      onClick={() => router.push(direct)}
    >
      {label}
    </button>
  );
}
