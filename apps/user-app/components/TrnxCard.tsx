"use client";

import { format } from "date-fns";
import type { TransactionCardProps } from "./TransactionsCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import categoryColorSetter from "../lib/functions/colorSetter";

export default function TrnxCard({
  recipient,
  debit,
  credit,
  id,
  status,
  date,
  category,
  profileImg,
}: TransactionCardProps) {
  const { color, color2, colorText, colorBorder } =
    categoryColorSetter(category);

  const formated = format(new Date(date), "EEE hh:mm a");
  const router = useRouter();
  return (
    <tr
      className="border-b border-gray-200 hover:bg-gray-100"
      onClick={() => router.push(`/transactions/byId?id=${id}`)}
    >
      <td className="px-6 py-4 text-xs max-w-40">{id}</td>
      <th scope="row" className="px-6 py-4 font-medium">
        <div className="flex gap-4 items-center">
          <div className="relative md:w-10 md:h-10 w-8 h-8 rounded-full overflow-hidden">
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
          <div>{recipient}</div>
        </div>
      </th>
      <td className="px-6 py-4">
        <div className={` ${credit === 0 ? "text-red-500" : "text-green-500"}`}>
          {credit === 0
            ? `-₹${(debit / 100).toFixed(2)}`
            : `+₹${(credit / 100).toFixed(2)}`}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex">
          <div
            className={` text-xs flex gap-1 items-center rounded-2xl px-1.5 py-1 ${status === "Processing" ? "text-gray-700 bg-gray-100" : `${status === "Success" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${status === "Processing" ? " bg-gray-500" : `${status === "Success" ? " bg-green-500" : " bg-red-500"}`}`}
            ></div>{" "}
            {status}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-500">{formated}</td>
      <td className="px-6 py-4">
        {category !== "None" ? (
          <div className="flex">
            <div
              className={` flex items-center gap-1 px-2 py-0.5 rounded-3xl text-xs border-2 ${colorBorder} ${colorText} ${color2}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>{" "}
              {category}
            </div>
          </div>
        ) : (
          <div>None</div>
        )}
      </td>
    </tr>
  );
}
