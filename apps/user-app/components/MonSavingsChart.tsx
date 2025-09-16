"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface prop {
  month: string;
  savings: number;
}

function Chart({ data }: { data: prop[] }) {
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 10, bottom: 5, left: 10 }}
      >
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value: number) => `₹${value}`} />
        <defs>
          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#00C49F" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <Bar dataKey="savings" fill="#00C49F" radius={[5, 5, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.savings >= 0 ? "#00C49F" : "#FF4C4C"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface AxiosMonSavings {
  data: prop[];
}

export default function MonSavingsChart() {
  const [data, setData] = useState<prop[]>();
  useEffect(() => {
    const fetchMonSavings = async () => {
      const res = await axios.get<AxiosMonSavings>("/api/monthlySavings");
      setData(res.data.data);
    };
    fetchMonSavings();
  }, []);
  if (!data) {
    return (
      <div className="flex w-full h-full justify-center items-center text-lg text-gray-700">
        No data to show
      </div>
    );
  }
  return <Chart data={data}></Chart>;
}
