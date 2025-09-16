"use client";

import { useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import { format, startOfDay } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useRouter } from "next/navigation";

export default function SearchTrnxDate() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: startOfDay(new Date()),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const router = useRouter();

  return (
    <div className="relative inline-block text-left ">
      <div className="flex gap-3 ">
        <div className="flex items-center bg-gray-200 rounded-full">
          <div
            className="flex items-center gap-2 cursor-pointer px-5 py-2"
            onClick={() => setOpen(!open)}
          >
            <div className="bg-purple-500 px-3 py-1 rounded-md text-white font-semibold flex gap-2 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
              {format(range[0]!.startDate, "dd/MM/yyyy")}{" "}
            </div>
            <div className="text-purple-500 font-semibold">to</div>
            <div className="bg-purple-500 px-3 py-1 rounded-md text-white font-semibold flex gap-2">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
              {format(range[0]!.endDate, "dd/MM/yyyy")}{" "}
            </div>
          </div>
          <button
            onClick={() => {
              router.push(
                `/transactions/history/search?from=${range[0]!.startDate.toISOString()}&to=${range[0]!.endDate.toISOString()}`
              );
            }}
            type="submit"
            className="text-white  rounded-full bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium px-6 py-3 cursor-pointer"
          >
            Search
          </button>
        </div>
        {open && (
          <div className="absolute z-20 mt-13  w-auto  bg-purple-300 rounded-lg shadow-lg p-3">
            <DateRange
              editableDateInputs={true}
              onChange={(item: RangeKeyDict) => {
                if (item.selection) {
                  setRange([
                    {
                      startDate: item.selection.startDate ?? new Date(),
                      endDate: item.selection.endDate ?? new Date(),
                      key: "selection",
                    },
                  ]);
                }
              }}
              moveRangeOnFirstSelection={false}
              ranges={range}
              className="rounded-lg "
              rangeColors={["#a855f7"]}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-3 py-1 text-sm rounded-lg bg-gray-200  hover:bg-gray-300 "
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
