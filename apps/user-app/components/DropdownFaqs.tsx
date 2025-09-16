"use client";

import { ReactNode, useState } from "react";

interface props {
  label: string;
  children: ReactNode;
}

export default function DropdownFaqs({ label, children }: props) {
  const [showFaqs, setShowFaqs] = useState(false);
  return (
    <div>
      <div
        className="flex mb-1 relative justify-between w-full cursor-pointer"
        onClick={() => setShowFaqs((prev) => !prev)}
      >
        <div className="w-full px-5 py-2 text-lg rounded-md font-semibold">
          {label}
        </div>
        <div
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          className=" cursor-pointer text-purple-500  rounded-r-lg px-3.5 py-2.5  flex justfiy-center items-center"
        >
          {showFaqs ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          )}
        </div>
      </div>
      <div
        id="dropdown"
        className={`px-5 z-10 transition-all duration-300 ease-in-out transform origin-top bg-white rounded-lg  w-full  text-sm ${showFaqs ? "opacity-100 max-h-96 scale-y-100" : "opacity-0 max-h-0  scale-y-0"}`}
      >
        {children}
      </div>
    </div>
  );
}
