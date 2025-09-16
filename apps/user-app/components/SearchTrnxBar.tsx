"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function SearchTrnxBar() {
  const placeholders = useMemo(
    () => [
      "by username…",
      "by email…",
      "by ID…",
      "by user's public ID…",
      "by bank…",
    ],
    []
  );

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [input, setInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (index === placeholders.length) return;
    const speed = deleting ? 50 : 100;

    const timeout = setTimeout(() => {
      setSubIndex((prev) => (deleting ? prev - 1 : prev + 1));

      if (!deleting && subIndex === placeholders[index]?.length) {
        setTimeout(() => setDeleting(true), 1200);
      } else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((prev) => (prev + 1) % placeholders.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, placeholders]);

  useEffect(() => {
    setText(
      `Search transactions ${placeholders[index]?.substring(0, subIndex)}`
    );
  }, [subIndex, index, placeholders]);

  return (
    <form className=" mx-auto w-full">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only "
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 "
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full px-4 py-3 ps-10 text-gray-900  rounded-full bg-gray-200  focus:ring-purple-500 focus:border-purple-500 transition-all outline-none"
          placeholder={text}
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={() => {
            setInput("");
            router.push(`/transactions/history/search?input=${input}`);
          }}
          type="submit"
          className="text-white absolute top-0 bottom-0 right-0 rounded-full bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium px-6 py-1.5 cursor-pointer"
          disabled={!input || input.trim().length === 0}
        >
          Search
        </button>
      </div>
    </form>
  );
}
