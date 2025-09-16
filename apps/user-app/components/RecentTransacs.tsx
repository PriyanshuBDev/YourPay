"use client";

import { useEffect, useState } from "react";
import type { TransactionCardProps } from "./TransactionsCard";
import axios from "axios";
import { RecentTrnxCard } from "./RecentTrnx";

// const trnx: TransactionCardProps[] = [
//   {
//     recipient: "Alex",
//     category: "Subscription",
//     credit: 100000,
//     debit: 0,
//     date: "2025-08-20T09:15:00",
//     status: "Processing",
//     id: "1",
//   },
// {
//   recipient: "nice",
//   category: "Food",
//   credit: 0,
//   debit: 20000,
//   date: "2025-08-21T14:45:00",
//   status: "Success",
//   id: "1",
// },
// {
//   recipient: "Rink",
//   category: "Savings",
//   credit: 350000,
//   debit: 0,
//   date: "2025-08-18T08:05:00",
//   status: "Success",
//   id: "1",
// },
// {
//   recipient: "Alex",
//   credit: 100000,
//   debit: 0,
//   date: "2025-08-21T09:15:00",
//   status: "Faliure",
//   id: "1",
//   category: "None",
// },
// {
//   recipient: "Alex",
//   category: "Subscription",
//   credit: 100000,
//   debit: 0,
//   date: "2025-08-21T09:15:00",
//   status: "Processing",
//   id: "1",
// },
// ];

export interface AxiosFetchTrnxBinds {
  transactions: TransactionCardProps[];
  msg: string;
}

export default function RecentTransacs() {
  const [allTranx, setAllTranx] = useState(true);
  const [payment, setPayment] = useState(false);
  const [topUps, setTopUps] = useState(false);
  const [trnxs, setTrnxs] = useState<TransactionCardProps[]>([]);
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllTrnsacs() {
      try {
        setLoading(true);
        const res = await axios.get<AxiosFetchTrnxBinds>(
          `/api/transactions/recent?type=${type}`
        );
        setTrnxs(res.data.transactions);
      } catch (e) {
        console.error(
          "Error encountered while fetching recent transactions",
          e instanceof Error ? e.message : e
        );
        alert("Error encounetered");
      } finally {
        setLoading(false);
      }
    }
    fetchAllTrnsacs();
  }, [type]);
  return (
    <div className="w-full rounded-md max-h-79 ">
      <div className="flex w-full  border-gray-200 gap-8 mb-3">
        <button
          className={`py-2 px-2 cursor-pointer text-md hover:text-purple-500 ${
            allTranx ? "text-purple-500 border-b-4" : "text-gray-700"
          }`}
          onClick={() => {
            setAllTranx(true);
            setPayment(false);
            setTopUps(false);
            setType("all");
          }}
        >
          All
        </button>

        <button
          className={`py-2 cursor-pointer text-md hover:text-purple-500 ${
            payment ? "text-purple-500 border-b-4" : "text-gray-700"
          }`}
          onClick={() => {
            setAllTranx(false);
            setTopUps(false);
            setPayment(true);
            setType("p2p");
          }}
        >
          Payment
        </button>
        <button
          className={`py-2 cursor-pointer text-md hover:text-purple-500 ${
            topUps ? "text-purple-500 border-b-4" : "text-gray-700"
          }`}
          onClick={() => {
            setAllTranx(false);
            setPayment(false);
            setTopUps(true);
            setType("topUp");
          }}
        >
          TopUps
        </button>
      </div>

      {loading ? (
        <div className="text-gray-600 text-lg flex w-full h-54 justify-center  items-center">
          Loading Transactions...
        </div>
      ) : (
        <div>
          <table className="w-full text-left rtl:text-right lg:text-base md:text-sm sm:text-xs ">
            <thead className="uppercase border-b-2 border-gray-200 bg-purple-50">
              <tr>
                <td scope="col" className="xl:px-5 px-3 py-1 ">
                  Recipient
                </td>
                <td scope="col" className="xl:px-5 px-3 py-1 ">
                  Amount
                </td>
                <td scope="col" className="xl:px-5 px-3 py-1 ">
                  Status
                </td>
                <td scope="col" className="xl:px-5 px-3 py-1 ">
                  Date
                </td>
                <td scope="col" className="xl:px-5 px-3 py-1 ">
                  Category
                </td>
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
                    isCategory={true}
                  />
                ))}
            </tbody>
          </table>
          {trnxs.length === 0 && (
            <div className="flex w-full justify-center h-54 items-center text-lg text-gray-700 py-10">
              No Transactions Found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
