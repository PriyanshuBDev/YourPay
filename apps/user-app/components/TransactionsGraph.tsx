"use client";

import { useEffect, useState } from "react";
import TransactionAreaChart from "./TransactionsChart";
import { format } from "date-fns";
import axios from "axios";
import { TabProps } from "./TopUpsChart";

const transactions = [
  { date: "01", credit: 500, debit: 200 },
  { date: "02", credit: 300, debit: 150 },
  { date: "03", credit: 400, debit: 100 },
  { date: "04", credit: 250, debit: 350 },
  { date: "05", credit: 150, debit: 50 },
];

interface TrnxsProps {
  date: string;
  credit: number;
  debit: number;
}

interface AxiosTrnx {
  transactions: TrnxsProps[];
}
export default function TransactionsGraph() {
  const tabs = [
    { id: "today", label: "Today" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
  ];
  const [active, setActive] = useState(0);
  const [timePeriod, setTimePeriod] = useState("Today");
  const [trnxs, setTrnxs] = useState<TrnxsProps[]>();
  useEffect(() => {
    const fetchTrnxs = async () => {
      try {
        const res = await axios.get<AxiosTrnx>(
          `/api/creditDebit?timePeriod=${timePeriod}`
        );
        const formatted = res.data.transactions.map((t) => {
          let label = "";
          if (timePeriod === "Today") {
            label = format(new Date(t.date), "HH:mm");
          } else if (timePeriod === "Week") {
            label = format(new Date(t.date), "EEE");
          } else {
            label = format(new Date(t.date), "dd");
          }
          return { date: label, credit: t.credit / 100, debit: t.debit / 100 };
        });
        setTrnxs(formatted);
      } catch (e) {
        console.error(
          "Error fetching transactions:",
          e instanceof Error ? e.message : e
        );
      }
    };
    fetchTrnxs();
  }, [timePeriod]);
  return (
    <div className="w-full h-full pb-5">
      <div className="mx-auto max-w-xs">
        <div className="relative flex bg-gray-100 rounded-lg">
          <div
            className="absolute top-1 bottom-1 rounded-md bg-white shadow transition-all duration-300 mx-1"
            style={{
              left: `${(100 / tabs.length) * active}%`,
              width: `${93 / tabs.length}%`,
            }}
          />
          {tabs.map((t: TabProps, i: number) => (
            <button
              key={i}
              onClick={() => {
                setActive(i);
                setTimePeriod(t.label);
              }}
              className={`relative z-10 flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 cursor-pointer ${active === i ? "text-gray-900" : "text-gray-500 hover:text-gray-800"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {trnxs?.length === undefined || trnxs.length < 1 ? (
        <div className="flex w-full h-full justify-center items-center text-lg text-gray-700">
          No data to show
        </div>
      ) : (
        <TransactionAreaChart data={trnxs || transactions} />
      )}
    </div>
  );
}
