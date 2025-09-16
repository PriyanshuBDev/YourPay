"use client";

import { useState } from "react";
import ChangePassword from "./ChangePassword";

export default function PasswordDropdown() {
  const [show, setShow] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  return (
    <div>
      <div
        className="flex mb-1 relative justify-between w-full border-b border-gray-300 cursor-pointer"
        onClick={() => setShow((prev) => !prev)}
      >
        <div className="w-full px-5 py-2 text-xl rounded-md font-semibold">
          Security
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
        className={`px-10  z-10 transition-all duration-300 ease-in-out transform origin-top bg-white divide-y divide-gray-100 rounded-lg  w-full  text-sm ${show ? "opacity-100 max-h-96 scale-y-100" : "opacity-0 max-h-0  scale-y-0"}`}
      >
        <div
          className="flex gap-3 text-lg items-center cursor-pointer py-4"
          onClick={() => setShowWarning(true)}
        >
          Change Password (signIn/Up){" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </div>
      </div>
      {showWarning && (
        <ChangePassword onClick={() => setShowWarning((prev) => !prev)} />
      )}
    </div>
  );
}
