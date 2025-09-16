"use client";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  // CartesianGrid,
} from "recharts";

interface DataProps {
  date: string;
  credit: number;
  debit: number;
}
export default function TransactionAreaChart({ data }: { data: DataProps[] }) {
  const chartData =
    data.length === 1
      ? [{ date: "Start", credit: 0, debit: 0 }, data[0]]
      : data;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
      >
        <defs>
          <linearGradient id="colorCredit" x1="0" y1="0" x2="0" y2="1">
            <stop offset={"5%"} stopColor="#0CF070" stopOpacity={0.8} />
            <stop offset={"95%"} stopColor="#0CF070" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
            <stop offset={"5%"} stopColor="#F02626" stopOpacity={0.8} />
            <stop offset={"95%"} stopColor="#F02626" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* <CartesianGrid strokeDasharray={"3 3"}></CartesianGrid> */}
        <XAxis dataKey={"date"}></XAxis>
        <YAxis></YAxis>
        <Tooltip
          formatter={(value: number, name: string) => [
            `₹${value.toFixed(2)}`,
            name,
          ]}
        />
        <Legend />

        <Area
          type="monotone"
          dataKey={"credit"}
          name="Credit"
          stroke="#0CF070"
          fill="url(#colorCredit)"
          dot={data.length > 1}
        />
        <Area
          type="monotone"
          dataKey={"debit"}
          name="Debit"
          stroke="#F02626"
          fill="url(#colorDebit)"
          dot={data.length > 1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
