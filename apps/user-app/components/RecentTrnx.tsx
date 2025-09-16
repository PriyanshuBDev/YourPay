"use client";

import Image from "next/image";
import categoryColorSetter from "../lib/functions/colorSetter";
import { TransactionCardProps } from "./TransactionsCard";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { AxiosFetchTrnxBinds } from "./RecentTransacs";
import axios from "axios";

export default function RecentTrnx({
  type,
  isCategory,
}: {
  type: string;
  isCategory: boolean;
}) {
  const [trnxs, setTrnxs] = useState<TransactionCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllTrnsacs() {
      try {
        const res = await axios.get<AxiosFetchTrnxBinds>(
          `/api/transactions/recent?type=${type}`
        );
        setTrnxs(res.data.transactions);
        setLoading(false);
      } catch (e) {
        console.error(
          "Error encountered while fetching recent transactions",
          e instanceof Error ? e.message : e
        );
        alert("Error encounetered");
      }
    }

    fetchAllTrnsacs();
  }, [type]);

  if (loading) {
    return (
      <div
        className=" bg-white rounded-2xl"
        style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
      >
        <div className="text-gray-600 text-lg flex w-full justify-center h-32 items-center">
          Loading Transactions...
        </div>
      </div>
    );
  }

  return (
    <div
      className=" bg-white rounded-xl"
      style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
    >
      <table className="w-full text-left rtl:text-right lg:text-base md:text-sm sm:text-xs">
        <thead className="uppercase border-b-2 border-gray-200 ">
          <tr>
            <td scope="col" className="xl:px-5 px-3 py-2 font-semibold">
              Recipient
            </td>
            <td scope="col" className="xl:px-5 px-3 py-2 font-semibold">
              Amount
            </td>
            <td scope="col" className="xl:px-5 px-3 py-2 font-semibold">
              Status
            </td>
            <td scope="col" className="xl:px-5 px-3 py-2 font-semibold">
              Date
            </td>
            {isCategory && (
              <td scope="col" className="xl:px-5 px-3 py-2 font-semibold">
                Category
              </td>
            )}
          </tr>
        </thead>
        <tbody>
          {trnxs.length > 0 &&
            trnxs.map((t: TransactionCardProps) => (
              <RecentTrnxCard
                key={t.id}
                profileImg={t.profileImg}
                recipient={t.recipient}
                credit={t.credit}
                debit={t.debit}
                category={t.category}
                date={t.date}
                status={t.status}
                id={t.id}
                isCategory={isCategory}
              />
            ))}
        </tbody>
      </table>
      {trnxs.length === 0 && (
        <div className="flex w-full h-full justify-center items-center text-lg text-gray-700 py-10">
          No Transactions Found
        </div>
      )}
    </div>
  );
}

interface RecentTrnxProps extends TransactionCardProps {
  isCategory: boolean;
}

export function RecentTrnxCard({
  recipient,
  debit,
  credit,
  id,
  status,
  date,
  category,
  profileImg,
  isCategory,
}: RecentTrnxProps) {
  const { color, color2, colorText, colorBorder } =
    categoryColorSetter(category);

  const formated = format(new Date(date), "EEE hh:mm a");
  const router = useRouter();
  return (
    <tr
      className="border-b border-gray-200 hover:bg-gray-100"
      onClick={() => router.push(`/transactions/byId?id=${id}`)}
    >
      <td scope="row" className="xl:px-5 p-3 py-2 font-medium">
        <div className="flex gap-2 items-center w-full">
          <div>
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
          </div>
          <div className="text-sm">{recipient}</div>
        </div>
      </td>
      <td className="xl:px-5 p-3 py-2">
        <div
          className={` text-sm ${credit === 0 ? "text-red-500" : "text-green-500"}`}
        >
          {credit === 0
            ? `-₹${(debit / 100).toFixed(2)}`
            : `+₹${(credit / 100).toFixed(2)}`}
        </div>
      </td>
      <td className="xl:px-5 p-3 py-2">
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
      <td className="xl:px-5 p-3  py-2 text-gray-500 text-xs">{formated}</td>
      {isCategory && (
        <td className="xl:px-5 p-3 py-2">
          {category && category != "None" ? (
            <div className="flex">
              <div
                className={` flex items-center gap-0.5 px-1 rounded-full text-xs border-2 text-nowrap ${colorBorder} ${colorText} ${color2}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>{" "}
                {category}
              </div>
            </div>
          ) : (
            <div>None</div>
          )}
        </td>
      )}
    </tr>
  );
}
