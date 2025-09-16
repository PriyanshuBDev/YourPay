"use client";

import { useEffect, useState } from "react";
import { getNotifications } from "../lib/actions/notifcations";
import { markNotificationRead } from "../lib/actions/markNotifyRead";
import { DateFormatter } from "../lib/functions/DateFormatter";
import { Btn3 } from "./Btn3";
import { markAllNotificationsRead } from "../lib/actions/markAllNotifyRead";
import { useRouter } from "next/navigation";

interface notifcationBinds {
  message: string;
  p2pTransactionId: string | null;
  onRampTransactionId: string | null;
  createdAt: Date;
  type: string;
  status: string | null;
  id: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<notifcationBinds[]>([]);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const handleFetchingNotifications = async () => {
      const res = await getNotifications();
      if (res.status != 200) {
        alert(res.msg);
        return;
      }
      setNotifications(res.notifications);
    };
    handleFetchingNotifications();
    const interval = setInterval(async () => {
      handleFetchingNotifications();
    }, 1000 * 60);
    return () => {
      clearInterval(interval);
    };
  }, [reload]);
  return (
    <div className="w-full">
      {notifications.length === 0 ? (
        <div className="flex justify-center items-center md:text-4xl sm:text-2xl text-xl text-gray-600 h-[calc(100vh-15rem)] w-full">
          No Notifications Found
        </div>
      ) : (
        <div className="w-full">
          <div className="w-full flex justify-end">
            <Btn3
              text="text-white"
              bg="bg-purple-500"
              hoverBg="hover:bg-purple-600"
              focus="focus:ring-purple-200"
              onClick={async () => {
                if (notifications.length > 0) {
                  const res = await markAllNotificationsRead();
                  if (res.status != 200) {
                    alert(res.msg);
                  }
                }
                setReload((prev) => prev + 1);
              }}
              label="Clear All"
            ></Btn3>
          </div>
          <div className="flex flex-col lg:gap-5 md:gap-3 gap-1 w-full justify-center items-center">
            {notifications.map((n: notifcationBinds, i: number) => (
              <NotificationCard
                key={i}
                createdAt={n.createdAt}
                msg={n.message}
                trnxId={n.p2pTransactionId || n.onRampTransactionId || null}
                id={n.id}
                status={n.status}
                type={n.type}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface notificationCardBinds {
  createdAt: Date;
  msg: string;
  type: string;
  status: string | null;
  trnxId: string | null;
  id: string;
}

export function NotificationCard({
  createdAt,
  msg,
  type,
  status,
  trnxId,
  id,
}: notificationCardBinds) {
  const [removed, setRemoved] = useState(false);
  const [hide, setHide] = useState(false);
  const date = DateFormatter(createdAt);
  const router = useRouter();
  if (removed) return null;
  return (
    <div
      className={`flex rounded-lg  md:px-5 sm:px-3 px-2 md:py-3 sm:py-2 p-1 mt-5 gap-8 items-center bg-white sm:w-lg md:w-xl lg:w-2xl xl:w-3xl 2xl:w-4xl transition-all duration-300
        ${hide ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
      style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
      onTransitionEnd={() => hide && setRemoved(true)}
    >
      <div>
        {type === "Transaction" ? (
          status && status === "Processing" ? (
            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-gray-500 bg-gray-100 rounded-lg ">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
              </svg>
              <span className="sr-only">Warning icon</span>
            </div>
          ) : status === "Success" ? (
            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg ">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span className="sr-only">Check icon</span>
            </div>
          ) : (
            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg ">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
              </svg>
              <span className="sr-only">Error icon</span>
            </div>
          )
        ) : (
          <></>
        )}
        {type === "Reminder" && (
          <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg ">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5"
              />
            </svg>

            <span className="sr-only">Reminder icon</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center w-full">
        <div>
          <div className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg text-gray-500">
            {date}
          </div>
          <div
            className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold hover:underline cursor-pointer"
            onClick={() => {
              if (trnxId) {
                router.push(`/transactions/byId?id=${trnxId}`);
              }
            }}
          >
            {msg}
          </div>
        </div>
        <div
          className="text-gray-600 hover:text-gray-800 cursor-pointer"
          onClick={async () => {
            const res = await markNotificationRead(id);
            if (res.status != 200) {
              return alert(res.msg);
            }
            setHide(true);
          }}
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
