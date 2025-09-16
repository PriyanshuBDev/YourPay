"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SignInUpImage({ src }: { src: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(false);
    const timeout = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timeout);
  }, [src]);
  return (
    <div className={`h-screen flex justify-end items-center`}>
      <div
        className={`w-full h-[70vh] relative overflow-hidden  rounded-3xl transform transition-all duration-500 ease-out ${show ? "translate-x-0 opacity-100" : "translate-x-[100vw] opacity-0"}`}
      >
        <Image
          src={src}
          alt="homeImage"
          fill
          className="object-cover object-left"
        ></Image>
      </div>
    </div>
  );
}
