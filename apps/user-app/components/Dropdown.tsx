"use client";

import { ReactNode, useState } from "react";

interface props {
  label: string;
  children: ReactNode;
}

export default function Dropdown({ label, children }: props) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div
        className="flex mb-1 relative justify-between w-full border-b border-gray-300 cursor-pointer"
        onClick={() => setShow((prev) => !prev)}
      >
        <div className="w-full px-5 py-2 text-xl rounded-md font-semibold">
          {label}
        </div>
        <div
          id="dropdownDefaultButton"
          data-dropdown-toggle="dropdown"
          className=" cursor-pointer text-purple-500  rounded-r-lg px-3.5 py-2.5  flex justfiy-center items-center"
        >
          <svg
            className={`w-5 h-5 transition-all duration-300 ${show ? "rotate-180" : ""}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </div>
      </div>
      <div
        id="dropdown"
        className={`px-10 z-10 transition-all duration-300 ease-in-out transform origin-top bg-white divide-y divide-gray-100 rounded-lg  w-full  text-sm ${show ? "opacity-100 max-h-96 scale-y-100" : "opacity-0 max-h-0  scale-y-0"}`}
      >
        {children}
      </div>
    </div>
  );
}
