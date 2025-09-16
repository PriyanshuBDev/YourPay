"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function PasswordInput({
  placeholder,
  onChange,
  label,
}: {
  placeholder: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="pt-2">
      <label className="block mb-2 text-md font-medium text-white">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
          placeholder={placeholder}
        />
        <span
          className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </span>
      </div>
    </div>
  );
}
