import { type JSX } from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border p-6 rounded-xl bg-[#ededed] ">
      <h1>{title}</h1>
      <div>{children}</div>
    </div>
  );
}
