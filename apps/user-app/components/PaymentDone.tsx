"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import Image from "next/image";

export interface TransactionDetailsProps {
  id: string;
  status: string;
  amount: number;
  createdAt: Date;
  category: {
    name: string;
  } | null;
  receiver: {
    email: string;
    publicId: string;
    username: string;
    profileImg: string;
  };
}
interface paymentDoneProps {
  onClick: () => void;
  transaction: TransactionDetailsProps;
}

export default function PaymentDone({
  onClick,
  transaction,
}: paymentDoneProps) {
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (transaction.status === "Success") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [transaction.status]);
  return (
    <div className=" fixed inset-0 bg-black/20 flex items-center justify-center z-40">
      <div
        className=" bg-white shadow-md rounded-lg z-1 p-5 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-13 h-13 mt-5 rounded-full border-4  flex items-center justify-center animate-bounce ${transaction.status === "Success" ? "border-green-500" : "border-red-500"}`}
        >
          {transaction.status === "Success" ? (
            <svg
              className="w-7 h-7 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="size-7 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>
        <div className="font-semibold text-4xl text-gray-500">
          ₹ {transaction.amount / 100}
        </div>

        <div
          className="flex rounded-lg w-full p-3 mt-5 gap-3 items-center"
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={transaction.receiver.profileImg}
              alt="Profile Pic"
              className="object-center object-cover"
              fill
            />
          </div>
          <div className="text-sm">
            <div>Paid to: {transaction.receiver.username}</div>
            <div>
              {format(new Date(transaction.createdAt), "dd MMM yyyy, hh:mm a")}
            </div>
          </div>
          <div
            className="ml-10 cursor-pointer"
            onClick={() => setShowFull((prev) => !prev)}
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
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>

        <div
          id="dropdown"
          className={`z-10 mt-2 transition-all duration-300 ease-in-out transform origin-top bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full  text-sm ${showFull ? "opacity-100 max-h-96 scale-y-100" : "opacity-0 max-h-0  scale-y-0"}`}
        >
          <ul
            className="py-2 text-sm text-gray-700 "
            aria-labelledby="dropdownDefaultButton"
          >
            <li className="border-b-2 border-gray-200 px-5 py-2">
              <div>Transaction Id:</div>
              <div className="text-black">{transaction.id}</div>
            </li>
            <li className="border-b-2 border-gray-200 px-5 py-2">
              <div>Recipient ID:</div>
              <div className="text-black">{transaction.receiver.publicId}</div>
            </li>
            <li className=" px-5 pt-2">
              <div>Category</div>
              <div className="text-black">
                {transaction.category?.name || "None"}
              </div>
            </li>
          </ul>
        </div>
        <div className="px-3 pt-3">
          <button
            onClick={onClick}
            className="bg-purple-500 text-white px-6 py-1.5 mt-2 rounded cursor-pointer text-2xl font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
