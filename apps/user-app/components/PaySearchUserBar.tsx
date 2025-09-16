"use client";

import { useEffect, useMemo, useState } from "react";
import type { UserProps } from "./PaymentPage";
import { getPaySearchUsers } from "../lib/actions/paySearchUsers";
import Image from "next/image";

interface Props {
  setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
}

export default function PaySearchUserBar({ setUser }: Props) {
  const [searchedUsers, setSearchedUsers] = useState<UserProps[]>([]);
  const [input, setInput] = useState("");
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const placeholders = useMemo(
    () => ["by username…", "by number…", "by ID…"],
    []
  );

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
    setText(`Search users ${placeholders[index]?.substring(0, subIndex)}`);
  }, [subIndex, index, placeholders]);

  useEffect(() => {
    const handleFetchingSearchedUser = async () => {
      const res = await getPaySearchUsers(input, 5);
      setSearchedUsers(res.users);
    };

    const timeOut = setTimeout(() => {
      handleFetchingSearchedUser();
    }, 1000);
    return () => {
      clearTimeout(timeOut);
    };
  }, [input]);

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
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            setSearchedUsers([]);
            setInput(e.target.value);
          }}
        />
        {input && input.length > 1 && (
          <div
            id="dropdown"
            className="absolute top-12.5 left-0 z-10 bg-white divide-y divide-gray-100 rounded-xl shadow-sm w-full"
            style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
          >
            {searchedUsers && searchedUsers.length > 0 ? (
              <ul
                className="py-2 text-sm text-gray-700 w-full"
                aria-labelledby="dropdownDefaultButton"
              >
                {searchedUsers.map((s: UserProps) => (
                  <li key={s.id}>
                    <button
                      onClick={() => {
                        setUser(s);
                        setSearchedUsers([]);
                        setInput("");
                      }}
                      className="block px-4 py-1 hover:bg-gray-100 w-full"
                    >
                      <div className="flex gap-5">
                        <div>
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={s.profileImg}
                              alt="Profile Pic"
                              className="object-center object-cover"
                              fill
                            />
                          </div>
                        </div>
                        <div className="w-full flex justify-between items-center text-xs gap-1">
                          <div className="font-semibold text-lg">
                            {s.username}
                          </div>
                          <div>{s.publicId}</div>
                          <div>{s.email}</div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex text-lg text-gray-600 justify-center w-full py-5">
                {" "}
                No Users Found
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
