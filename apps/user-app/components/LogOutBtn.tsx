"use client";

import { signOut } from "next-auth/react";
import { Btn3 } from "./Btn3";

export default function LogOutBtn() {
  return (
    <Btn3
      label="Log Out"
      onClick={async () => await signOut({ callbackUrl: "/signin" })}
      focus="focus:ring-purple-300"
      bg="bg-purple-500"
      text="text-white"
      hoverBg="bg-purple-700"
    ></Btn3>
  );
}
