"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { getUserDetails } from "../lib/actions/userDetails";
import Image from "next/image";
import SearchUserBar from "./SearchUserBar";
import { getNotifications } from "../lib/actions/notifcations";
import { useRouter } from "next/navigation";
import YourPayIcon from "./Icon";

export default function Appbar() {
  const { data: session } = useSession();
  const [img, setImg] = useState("");
  const [notifcationsCount, setNotificationsCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleFetchingImg = async () => {
      const { img } = await getUserDetails();
      setImg(img || "");
    };
    handleFetchingImg();
    const handleFetchingNotifications = async () => {
      const res = await getNotifications();
      if (res.status != 200) {
        alert(res.msg);
        return;
      }
      setNotificationsCount(res.notifications.length);
    };
    handleFetchingNotifications();
    const interval = setInterval(async () => {
      handleFetchingNotifications();
    }, 1000 * 60);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="flex h-20  items-center pr-10 justify-between">
      <div
        className="text-4xl text-purple-500 font-semibold cursor-pointer flex pl-5"
        onClick={() => router.push("/home")}
      >
        <div>
          <YourPayIcon size={45}></YourPayIcon>
        </div>
        YourPay
      </div>
      <SearchUserBar />
      <div className=" flex gap-8 px-5">
        <div className="flex gap-5">
          <div>
            <div className="text-lg flex flex-nowrap">
              <div className="text-purple-600">Hi</div>, {session?.user.name}
            </div>
            <div className="text-xs">{session?.user.email}</div>
          </div>
          {img ? (
            <div
              className="relative w-12 h-12 rounded-full overflow-hidden cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              <Image
                src={img}
                alt="Profile Pic"
                className="object-center object-cover"
                fill
              />
            </div>
          ) : (
            <div className="border-gray-200 bg-white border-4 rounded-full w-12 h-12 items-center justify-center flex text-3xl text-purple-500 font-semibold">
              {session?.user.name ? session.user.name[0] : "A"}
            </div>
          )}
        </div>
        <div
          className="relative"
          onClick={() => router.push("/home/notifications")}
        >
          <div className=" bg-purple-500 text-white rounded-full px-2.5 py-2.5 flex items-center hover:bg-purple-600 cursor-pointer">
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
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
          </div>
          {notifcationsCount > 1 && (
            <div className="absolute -top-1 -right-1.5 w-6 h-6 text-sm text-white bg-red-500 rounded-full flex justify-center items-center">
              {notifcationsCount > 99 ? "99" : notifcationsCount}
            </div>
          )}
        </div>
        <div
          className="bg-purple-600 text-white rounded-full px-2.5 py-2.5 flex items-center hover:bg-purple-700 cursor-pointer"
          onClick={() => router.push("/settings")}
        >
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
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
        <div
          className="px-2.5 py-2.5 text-white rounded-full flex justify-center items-center cursor-pointer bg-purple-700 shadow-md hover:bg-purple-800"
          onClick={async () => await signOut({ callbackUrl: "/signin" })}
        >
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
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
