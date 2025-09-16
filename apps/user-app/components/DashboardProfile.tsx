"use client";
import { signOut, useSession } from "next-auth/react";

export default function DashboardProfile() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="py-4 border-t-2 border-gray-100 flex gap-3 px-5">
      <div className="border-gray-200 border-4 rounded-full w-12 h-12 items-center justify-center flex text-3xl text-purple-500 font-semibold">
        {session?.user.name ? session.user.name[0] : "A"}
      </div>
      <div>
        <div className="text-lg">{session?.user.name}</div>
        <div className="text-xs">{session?.user.email}</div>
      </div>
      <div
        className="w-10 h-10 text-gray-600 rounded-full flex justify-center items-center mt-1 ml-2 cursor-pointer"
        onClick={async () => await signOut({ callbackUrl: "/signin" })}
      >
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
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
          />
        </svg>
      </div>
    </div>
  );
}
