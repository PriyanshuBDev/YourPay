"use client";

import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface TransactionCardProps {
  recipient: string;
  credit: number;
  debit: number;
  status: string;
  date: string;
  category?: string;
  id: string;
  profileImg: string;
}

export default function TransactionsCard({
  recipient,
  debit,
  credit,
  id,
  status,
  date,
  category,
  profileImg,
}: TransactionCardProps) {
  let color: string;
  let color2: string;
  let colorText: string;
  let colorBorder: string;

  if (category === "Subscriptions") {
    color = "bg-indigo-500";
    color2 = "bg-indigo-50";
    colorText = "text-indigo-700";
    colorBorder = "border-indigo-500";
  } else if (category === "Food & Dining") {
    color = "bg-orange-500";
    color2 = "bg-orange-50";
    colorText = "text-orange-700";
    colorBorder = "border-orange-500";
  } else if (category === "Shopping") {
    color = "bg-pink-500";
    color2 = "bg-pink-50";
    colorText = "text-pink-700";
    colorBorder = "border-pink-500";
  } else if (category === "Installments") {
    color = "bg-rose-500";
    color2 = "bg-rose-50";
    colorText = "text-rose-700";
    colorBorder = "border-rose-500";
  } else if (category === "Travel") {
    color = "bg-teal-500";
    color2 = "bg-teal-50";
    colorText = "text-teal-700";
    colorBorder = "border-teal-500";
  } else if (category === "Miscellaneous") {
    color = "bg-yellow-500";
    color2 = "bg-yellow-50";
    colorText = "text-yellow-700";
    colorBorder = "border-yellow-500";
  } else if (category === "Bills & Utilities") {
    color = "bg-emerald-500";
    color2 = "bg-emerald-50";
    colorText = "text-emerald-700";
    colorBorder = "border-emerald-500";
  } else if (category === "Savings") {
    color = "bg-green-500";
    color2 = "bg-green-50";
    colorText = "text-green-700";
    colorBorder = "border-green-500";
  } else if (category === "Health") {
    color = "bg-blue-500";
    color2 = "bg-blue-50";
    colorText = "text-blue-700";
    colorBorder = "border-blue-500";
  } else if (category === "Entertainment") {
    color = "bg-violet-500";
    color2 = "bg-violet-50";
    colorText = "text-violet-700";
    colorBorder = "border-violet-500";
  } else {
    color = "bg-red-500";
    color2 = "bg-red-50";
    colorText = "text-red-700";
    colorBorder = "border-red-500";
  }
  const formated = format(new Date(date), "EEE hh:mm a");
  const router = useRouter();
  return (
    <div
      className="flex items-center border-b-2 border-gray-100 px-2 py-2 cursor-pointer"
      onClick={() => router.push(`/transactions/byId?id=${id}`)}
    >
      <div className="w-50">
        <div className="flex gap-2 items-center">
          <div className="relative md:w-8 md:h-8 w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={
                profileImg ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              }
              alt="Profile Pic"
              className="object-center object-cover"
              fill
            />
          </div>
          <div className="text-sm">{recipient}</div>
        </div>
      </div>
      <div className="flex w-30">
        <div
          className={`text-sm ${credit === 0 ? "text-red-500" : "text-green-500"}`}
        >
          {credit === 0
            ? `-₹${(debit / 100).toFixed(2)}`
            : `+₹${(credit / 100).toFixed(2)}`}
        </div>
      </div>
      <div className="w-35 flex">
        <div
          className={` text-xs flex gap-1 items-center rounded-2xl px-1.5 py-1 ${status === "Processing" ? "text-gray-700 bg-gray-100" : `${status === "Success" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${status === "Processing" ? " bg-gray-500" : `${status === "Success" ? " bg-green-500" : " bg-red-500"}`}`}
          ></div>{" "}
          {status}
        </div>
      </div>
      <div className="w-40">
        <div className="text-sm text-gray-500">{formated}</div>
      </div>
      {category && category != "None" ? (
        <div className="flex w-28">
          <div
            className={` flex items-center gap-1 px-2 py-0.5 rounded-3xl text-xs border-2 ${colorBorder} ${colorText} ${color2}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>{" "}
            {category}
          </div>
        </div>
      ) : (
        <div className="w-28">None</div>
      )}
    </div>
  );
}
