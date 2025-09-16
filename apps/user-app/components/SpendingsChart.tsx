"use client";

import { useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
// type CategoryName =
//   | "Subscriptions"
//   | "Installments"
//   | "Food & Dining"
//   | "Travel"
//   | "Shopping"
//   | "Bills & Utilities"
//   | "Health"
//   | "Entertainment"
//   | "Miscellaneous"
//   | "Savings";

interface fullSpends {
  name: string;
  spent: number;
  limit: number;
  color: string;
  colorText: string;
  colorText2: string;
}

// export const categoryBudgets: CategoryBudget[] = [
//   { category: "Subscriptions", value: 10 },
//   { category: "Installments", value: 450 },
//   { category: "Food & Dining", value: 780 },
//   { category: "Travel", value: 670 },
//   { category: "Shopping", value: 4990 },
//   { category: "Bills & Utilities", value: 340 },
//   { category: "Health", value: 4320 },
//   { category: "Entertainment", value: 340 },
//   { category: "Miscellaneous", value: 900 },
//   { category: "Savings", value: 6700 },
// ];

const CustomTooltip = ({ active, payload, total }: any) => {
  if (active && payload && payload.length) {
    const { name, spent, colorText } = payload[0].payload as fullSpends;
    const percent = ((spent / total) * 100).toFixed(1);

    return (
      <div className="bg-white shadow-md p-2 rounded">
        <p className={`${colorText} font-semibold`}>{name}</p>
        <p className="text-sm">
          ₹{(spent / 100).toFixed(2)} ({percent}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function SpendingsChart({ spends }: { spends: fullSpends[] }) {
  const total = spends.reduce(
    (acc: number, cur: fullSpends) => acc + cur.spent,
    0
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      payload,
      value,
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill="currentColor"
          className={`${(payload as fullSpends).colorText2}`}
        />
      </g>
    );
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart tabIndex={-1}>
        <Pie
          data={spends}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          dataKey="spent"
          stroke="none"
          activeShape={renderActiveShape}
          onClick={(_, index) =>
            setActiveIndex(index === activeIndex ? null : index)
          }
        >
          {spends.map((entry: fullSpends) => (
            <Cell
              key={`cell-${entry.name}`}
              fill="currentColor"
              className={`${entry.colorText2} outline-none`}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip total={total} />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
