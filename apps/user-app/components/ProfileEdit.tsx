"use client";

import { useEffect, useState } from "react";
import { handleUserNameEdit } from "../lib/actions/userNameEdit";
import ProfileUpload from "./ProfileUpload";
import { useSession } from "next-auth/react";
import { getUserDetails } from "../lib/actions/userDetails";
import CopyButton from "./CopyButton";

export default function ProfileEdit() {
  const [userName, setUserName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [publicId, setPublicId] = useState("");
  const session = useSession();

  useEffect(() => {
    const handleFetchingPublicId = async () => {
      const { publicId } = await getUserDetails();
      setPublicId(publicId || "");
    };
    handleFetchingPublicId();
  }, []);

  return (
    <div className="relative flex items-center gap-10">
      <div className="">
        <ProfileUpload />
      </div>

      <div className="w-full flex flex-col gap-4 text-gray-700 text-lg sm:text-xl lg:text-2xl">
        <div className=" w-full flex justify-between items-center border-b-2 border-gray-300 gap-5">
          <div className="text-nowrap">
            Public ID{" "}
            <div className="text-gray-500 mt-1 text-sm">
              Use this ID when you need to share with 3rd parties so your
              account is always secure.
            </div>
          </div>
          <div className="flex gap-3">
            {publicId} <CopyButton value={publicId}></CopyButton>
          </div>
        </div>
        <div className=" w-full flex justify-between border-b-2 border-gray-300">
          <div>UserName</div>
          <div className="flex gap-3">
            {session.data?.user.name}
            <button
              type="button"
              onClick={() => setShowInput(true)}
              className="cursor-pointer text-white bg-purple-500 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-lg px-1.5 py-1 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className=" w-full flex justify-between border-b-2 border-gray-300 gap-5">
          <div className="text-nowrap">Email</div>
          <div className="flex gap-3">{session.data?.user.email}</div>
        </div>
      </div>

      {showInput && (
        <div
          className=" fixed inset-0 bg-black/20 flex items-center justify-center z-40"
          onClick={() => setShowInput(false)}
        >
          <div
            className=" bg-white shadow-md rounded-lg z-50 "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end w-full px-3 pt-3">
              <button
                onClick={() => {
                  setShowInput(false);
                  setUserName("");
                }}
                className="text-gray-500 hover:underline cursor-pointer"
              >
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-8 pb-5">
              <div className="text-purple-500 text-2xl font-semibold w-full flex justify-center mb-8">
                Edit Your Username
              </div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Type Your New Username"
                className=" px-3 py-2 rounded w-70 bg-gray-100 mb-5 text-lg"
              />
              <div className="flex justify-center w-full">
                <button
                  onClick={async () => {
                    await handleUserNameEdit(userName);
                    setShowInput(false);
                    setUserName("");
                  }}
                  className="bg-purple-500 text-white px-4 py-1 mt-2 rounded cursor-pointer text-lg"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
