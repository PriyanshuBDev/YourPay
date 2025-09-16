"use client";

import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface prop {
  date: string;
  credit: number;
}

function Chart({ data }: { data: prop[] }) {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 10, bottom: 5, left: 10 }}
      >
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
        <defs>
          <pattern
            id="barStripes"
            patternUnits="userSpaceOnUse"
            width={6}
            height={6}
            patternTransform="rotate(45)"
          >
            <rect width="6" height="6" fill="#8B5CF6" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="white" strokeWidth={2} />
          </pattern>
        </defs>
        <Bar
          dataKey="credit"
          fill="url(#barStripes)"
          radius={[5, 5, 0, 0]}
        ></Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface AxiosTopUps {
  transactions: prop[];
}

export default function TopUpsChart() {
  const tabs = [
    { id: "today", label: "Today" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
  ];
  const [active, setActive] = useState(0);
  const [data, setData] = useState<prop[]>();
  const [timePeriod, setTimePeriod] = useState("Today");
  useEffect(() => {
    const fetchMonSavings = async () => {
      try {
        const res = await axios.get<AxiosTopUps>(
          `/api/topUps?timePeriod=${timePeriod}`
        );
        const formatted = res.data.transactions.map((t) => {
          let label = "";
          if (timePeriod === "Today") {
            label = format(new Date(t.date), "HH:mm");
          } else if (timePeriod === "Week") {
            label = format(new Date(t.date), "EEE");
          } else if (timePeriod === "Month") {
            label = format(new Date(t.date), "dd");
          } else if (timePeriod === "Year") {
            label = format(new Date(t.date), "MMM");
          }
          return { date: label, credit: t.credit / 100 };
        });
        setData(formatted);
      } catch (e) {
        console.error(
          "Error fetching transactions:",
          e instanceof Error ? e.message : e
        );
      }
    };
    fetchMonSavings();
  }, [timePeriod]);
  return (
    <div
      className="bg-white w-full rounded-xl p-5 sm:p-6 lg:p-8 mt-8 sm:mt-10 col-span-1 h-70"
      style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
    >
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
            {tabs.map((t, i) => (
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
        {data?.length === undefined || data.length < 1 ? (
          <div className="flex w-full h-full justify-center items-center text-lg text-gray-700">
            No data to show
          </div>
        ) : (
          <Chart data={data} />
        )}
      </div>
    </div>
  );
}
