"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface DataProp {
  name: string;
  value: number;
}

const COLORS = ["#5C59FF", "#BDC3FA"];

export default function Chart({ data }: { data: DataProp[] }) {
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-xl">
        No balance data
      </div>
    );
  }
  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <PieChart>
        <Pie
          data={data}
          cx={"50%"}
          cy={"50%"}
          outerRadius={60}
          innerRadius={40}
          fill="#8884d8"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            ></Cell>
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
        <Legend verticalAlign="bottom"></Legend>
      </PieChart>
    </ResponsiveContainer>
  );
}
