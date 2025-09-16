"use client";
import { JSX, useEffect, useState } from "react";
import { getMontlyBudget } from "../lib/actions/monthlyBudget";
import ProgressBar from "./ProgressBar";
import { budgetCreateUpdate } from "../lib/actions/BudgetCreateUpdate";
import { deleteBudget } from "../lib/actions/deleteBudget";
import { handleAmountKeyDown } from "../lib/functions/AmountFilter";
import { CustomAlert } from "./CustomAlert";

interface categoryProps {
  id: string;
  spent: number;
  limit: number;
  name: string;
}
export default function BudgetSetter() {
  const defaultCategories = [
    "Subscriptions",
    "Food & Dining",
    "Shopping",
    "Installments",
    "Travel",
    "Miscellaneous",
    "Bills & Utilities",
    "Savings",
    "Health",
    "Entertainment",
  ];
  const [categories, setCategories] = useState<categoryProps[]>([]);
  const [showLimitSetter, setShowLimitSetter] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [limit, setLimit] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [category, setCategory] = useState("");
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  useEffect(() => {
    const handleFetchingCategories = async () => {
      setLoading(true);
      const res = await getMontlyBudget();
      if (res.status != 200) {
        return setWarningMsg(res.msg);
      }
      setCategories(res.budget);
      setLoading(false);
    };
    handleFetchingCategories();
  }, [reload]);

  const createdNames = categories.map((cN) => cN.name);
  const notCreated = defaultCategories.filter(
    (dc) => !createdNames.includes(dc)
  );
  return (
    <div
      className="bg-white w-full rounded-xl p-5 sm:p-6 lg:p-8 mt-8 sm:mt-10"
      style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
    >
      <div className="text-purple-500 text-2xl sm:text-3xl font-semibold">
        Budget
      </div>
      {createdNames.length > 0 && (
        <div className={`grid lg:grid-cols-2 w-full mt-5 gap-x-5 gap-y-2`}>
          {categories.map((c) => (
            <div key={c.id} className="col-span-1 flex gap-2 w-full">
              <ProgressBar
                limit={c.limit}
                category={c.name}
                spent={c.spent}
              ></ProgressBar>

              <div className="flex gap-1 flex-col">
                <button
                  type="button"
                  onClick={() => {
                    setShowLimitSetter(true);
                    setCategoryId(c.id);
                    setCategory(c.name);
                  }}
                  className="cursor-pointer h-fit text-white bg-purple-500 hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-lg px-1.5 py-1.5 "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryId(c.id);
                    setShowWarning(true);
                  }}
                  className="cursor-pointer h-fit text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-1.5 py-1.5 "
                >
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
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {notCreated.length > 0 && (
        <div>
          <div className="text-xl font-semibold my-5">Click To Add More</div>
          <div className={`grid lg:grid-cols-2 gap-x-5 gap-y-2`}>
            {notCreated.map((n, i) => (
              <div key={i} className="col-span-1">
                <CategoryCard
                  onClick={() => {
                    if (!loading) {
                      setCategory(n);
                      setShowLimitSetter(true);
                    }
                  }}
                  category={n}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {showLimitSetter && (
        <div
          className=" fixed inset-0 bg-black/20 flex items-center justify-center z-40"
          onClick={() => {
            setShowLimitSetter(false);
            setLimit("");
            setCategory("");
            setCategoryId("");
          }}
        >
          <div
            className=" bg-white shadow-md rounded-lg z-50 "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end w-full px-3 pt-3">
              <button
                onClick={() => {
                  setShowLimitSetter(false);
                  setLimit("");
                  setCategory("");
                  setCategoryId("");
                }}
                className="text-gray-500 hover:underline cursor-pointer"
              >
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-8 pb-5">
              <div className="text-purple-500 text-2xl font-semibold w-full flex justify-center mb-8">
                Set Limit
              </div>
              <input
                type="number"
                value={limit}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setLimit(val);
                }}
                onKeyDown={handleAmountKeyDown}
                placeholder={
                  categoryId ? "Type Your New Limit" : "Type Your Limit"
                }
                className=" px-3 py-2 rounded w-70 bg-gray-100 mb-5 text-lg"
              />
              <div className="flex justify-center w-full">
                <button
                  onClick={async () => {
                    if (categoryId) {
                      const id = categoryId;
                      console.log(limit);

                      const res = await budgetCreateUpdate({
                        id,
                        limit: Number(limit),
                      });
                      if (res?.status !== 200) {
                        setWarningMsg(res?.msg);
                      }
                    } else {
                      const res = await budgetCreateUpdate({
                        limit: Number(limit),
                        name: category,
                      });
                      if (res?.status !== 200) {
                        setWarningMsg(res?.msg);
                      }
                    }
                    setShowLimitSetter(false);
                    setLimit("");
                    setCategory("");
                    setCategoryId("");
                    setReload((prev) => prev + 1);
                  }}
                  className="bg-purple-500 text-white px-4 py-1 mt-2 rounded cursor-pointer text-lg"
                  disabled={limit.length === 0}
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showWarning && (
        <div
          className=" fixed inset-0 bg-black/20 flex items-center justify-center z-40"
          onClick={() => {
            setCategoryId("");
            setShowWarning(false);
          }}
        >
          <div
            className=" bg-white shadow-md rounded-lg z-50 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-semibold text-xl">
              {" "}
              Are you sure, you want to delete this category?{" "}
            </div>
            <div className="text-sm text-red-500">
              *All transactions with this will be set to &quot;None&quot;
            </div>
            <div className="flex justify-center gap-2 mt-5">
              <button
                className="border-gray-300 border-3 hover:bg-gray-300 rounded-lg px-3 py-1 cursor-pointer bg-white"
                onClick={() => {
                  setCategoryId("");
                  setShowWarning(false);
                }}
              >
                {" "}
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white hover:bg-purple-700 rounded-lg px-3 py-1 cursor-pointer"
                onClick={async () => {
                  const res = await deleteBudget(categoryId);
                  setCategoryId("");
                  setShowWarning(false);
                  if (res?.status !== 200) {
                    setWarningMsg(res?.msg);
                  }
                  setReload((prev) => prev + 1);
                }}
              >
                {" "}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {warningMsg && (
        <CustomAlert
          type={"error"}
          msg={warningMsg}
          onClose={() => setWarningMsg("")}
        />
      )}
    </div>
  );
}

interface categoryCardBinds {
  onClick: () => void;
  category: string;
}

export function CategoryCard({ onClick, category }: categoryCardBinds) {
  const svgs: Record<number, JSX.Element> = {
    1: (
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
          d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
        />
      </svg>
    ),
    2: (
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
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
    ),
    3: (
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
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
    ),
    4: (
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
    ),
    5: (
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
          d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
        />
      </svg>
    ),
    6: (
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
          d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
        />
      </svg>
    ),
    7: (
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
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
        />
      </svg>
    ),
    8: (
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
          d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
        />
      </svg>
    ),
    9: (
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
          d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
        />
      </svg>
    ),
    10: (
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
          d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
        />
      </svg>
    ),
  };

  let color: string;
  let color2: string;
  let color3: string;
  let colorText: string;
  let svg: number;

  if (category === "Subscriptions") {
    color = "bg-indigo-700";
    color2 = "bg-indigo-300";
    color3 = "bg-indigo-100";
    colorText = "text-indigo-700";
    svg = 1;
  } else if (category === "Food & Dining") {
    color = "bg-orange-700";
    color2 = "bg-orange-300";
    color3 = "bg-orange-100";
    colorText = "text-orange-700";
    svg = 2;
  } else if (category === "Shopping") {
    color = "bg-pink-700";
    color2 = "bg-pink-300";
    color3 = "bg-pink-100";
    colorText = "text-pink-700";
    svg = 3;
  } else if (category === "Installments") {
    color = "bg-rose-700";
    color2 = "bg-rose-300";
    color3 = "bg-rose-100";
    colorText = "text-rose-700";
    svg = 4;
  } else if (category === "Travel") {
    color = "bg-teal-700";
    color2 = "bg-teal-300";
    color3 = "bg-teal-100";
    colorText = "text-teal-700";
    svg = 5;
  } else if (category === "Miscellaneous") {
    color = "bg-yellow-700";
    color2 = "bg-yellow-300";
    color3 = "bg-yellow-100";
    colorText = "text-yellow-700";

    svg = 6;
  } else if (category === "Bills & Utilities") {
    color = "bg-emerald-700";
    color2 = "bg-emerald-300";
    color3 = "bg-emerald-100";
    colorText = "text-emerald-700";

    svg = 7;
  } else if (category === "Savings") {
    color = "bg-green-700";
    color2 = "bg-green-300";
    color3 = "bg-green-100";
    colorText = "text-green-700";

    svg = 8;
  } else if (category === "Health") {
    color = "bg-blue-700";
    color2 = "bg-blue-300";
    color3 = "bg-blue-100";
    colorText = "text-blue-700";

    svg = 9;
  } else if (category === "Entertainment") {
    color = "bg-violet-700";
    color2 = "bg-violet-300";
    color3 = "bg-violet-100";
    colorText = "text-violet-700";

    svg = 10;
  } else {
    color = "bg-red-700";
    color2 = "bg-red-300";
    color3 = "bg-red-100";
    colorText = "text-red-700";
    svg = 0;
  }

  return (
    <div
      className={`px-3 py-2.5 flex items-center ${color3} gap-4 mb-3 rounded-lg w-full cursor-pointer`}
      onClick={() => onClick()}
    >
      <div
        className={`px-2 py-2 flex rounded-full items-center ${color2} ${colorText}`}
      >
        <span>{svgs[svg]}</span>
      </div>
      <div
        className={`${colorText} text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg`}
      >
        {category}
      </div>
    </div>
  );
}
