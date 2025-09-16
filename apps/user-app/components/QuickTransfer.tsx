"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import "./QuickTransfer.css";
import { getBalance } from "../lib/actions/balance";
import { getUserDetails } from "../lib/actions/userDetails";
import { p2pTransfer } from "../lib/actions/p2pTransfer";
import { getQuickUsers } from "../lib/actions/quickUsers";
import PaymentDone from "./PaymentDone";
import type { TransactionDetailsProps } from "./PaymentDone";
import Loading from "./Loading";
import {
  handleAmountChange,
  handleAmountKeyDown,
} from "../lib/functions/AmountFilter";
import { CustomAlert } from "./CustomAlert";

export interface QUser {
  profileImg: string;
  id: string;
  username: string;
  publicId: string;
  email: string;
}
// const Users: QUser[] = [
//   {
//     id: "1",
//     profileImg: "https://picsum.photos/id/1015/300/200",
//     username: "Alex",
//     email: "12",
//     publicId: "jjj",
//   },
//   {
//     id: "2",
//     profileImg: "https://picsum.photos/id/1014/300/200",
//     username: "Max12",
//     email: "12",
//     publicId: "jjj",
//   },
//   {
//     id: "3",
//     profileImg: "https://picsum.photos/id/1013/300/200",
//     username: "samMajor",
//     email: "12",
//     publicId: "jjj",
//   },
//   {
//     id: "4",
//     profileImg: "https://picsum.photos/id/1012/300/200",
//     username: "Ashakumari",
//     email: "12",
//     publicId: "jjj",
//   },
//   {
//     id: "5",
//     profileImg: "https://picsum.photos/id/1011/300/200",
//     username: "thisIsDon",
//     email: "12",
//     publicId: "jjj",
//   },
//   {
//     id: "6",
//     profileImg: "https://picsum.photos/id/1010/300/200",
//     username: "Sarah",
//     email: "12",
//     publicId: "jjj",
//   },
//   {
//     id: "7",
//     profileImg: "https://picsum.photos/id/1016/300/200",
//     username: "Alex",
//     email: "12",
//     publicId: "jjj",
//   },
//   {
//     id: "8",
//     profileImg: "https://picsum.photos/id/1018/300/200",
//     username: "Alex",
//     email: "12",
//     publicId: "jjj",
//   },
// ];

export interface categories {
  id: string;
  name: string;
  userId: string;
  limit: number;
}
export default function QuickTransfer() {
  const [balance, setBalance] = useState("0");
  const [showInput, setShowInput] = useState(false);
  const [password, setPassword] = useState("");
  const [categories, setCategories] = useState<categories[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [category, setCategory] = useState("None");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [qUsers, setQUsers] = useState<QUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentCard, setShowPaymentCard] = useState(false);
  const [transaction, setTransaction] = useState<TransactionDetailsProps>();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [warningMsg, setWarningMsg] = useState("");

  useEffect(() => {
    async function handleFetching() {
      const res = await getBalance();
      setBalance((res.amount / 100).toFixed(2));
      const { categories } = await getUserDetails();
      setCategories(categories || []);
      const qUsers = await getQuickUsers();
      setQUsers(qUsers.map((q) => q.qUser));
      setLoading(false);
    }
    handleFetching();
  }, []);

  return (
    <div>
      <div className="flex items-center w-full justify-between px-5 mb-5">
        <div className="text-xl font-semibold flex gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-amber-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Quick Transfer
        </div>
        <div className="text-2xl font-bold">₹ {balance}</div>
      </div>
      {loading ? (
        <div className="text-gray-600 text-lg flex w-full justify-center h-32 items-center">
          Loading users...
        </div>
      ) : qUsers.length === 0 ? (
        <div className="text-gray-600 text-lg flex w-full justify-center h-32 items-center">
          No users added for quick transfer
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-custom pb-1.5 px-5">
          <div
            className={`flex gap-3 mt-3 ${
              qUsers.length < 4 ? "justify-center" : "justify-start"
            }`}
          >
            {qUsers.map((q, i) => (
              <div key={q.id} className="flex-shrink-0">
                <div className="inline-flex justify-center w-full ">
                  <div
                    className={` flex flex-col py-3 px-5 items-center rounded-lg overflow-hidden focus:outline-none  focus:ring-2 focus:ring-purple-400 hover:bg-purple-300 ${activeIndex === i && "bg-purple-300"}`}
                    onClick={() => {
                      setUserId(q.id);
                      setActiveIndex(i);
                    }}
                  >
                    <div>
                      <div className="relative md:w-15 md:h-15 w-10 h-10 rounded-xl overflow-hidden">
                        <Image
                          src={q.profileImg}
                          alt="Profile Pic"
                          className="object-center object-cover"
                          fill
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                        />
                      </div>
                    </div>
                    <div className="text-wrap text-xs mt-2">{q.username}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="p-5 flex gap-30 items-center mt-2">
        <div className="text-xl font-semibold">Amount</div>
        <div className="flex items-center">
          <input
            type="number"
            className=" rounded-lg w-full bg-gray-200 text-xl px-5 py-2 outline-none focus:outline-none [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none 
             [moz-appearance:textfield]"
            onChange={(e) => handleAmountChange(e, setAmount)}
            onKeyDown={handleAmountKeyDown}
            value={amount}
          />
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white text-xl font-semibold px-13 py-2 rounded-lg ml-[-10] cursor-pointer"
            onClick={() => setShowInput(true)}
            disabled={!amount || amount.trim().length === 0 || !userId}
          >
            Continue
          </button>
        </div>
      </div>
      {showInput && (
        <div
          className=" fixed inset-0 bg-black/20 flex items-center justify-center z-40"
          onClick={() => setShowInput(false)}
        >
          <div
            className=" bg-white shadow-md rounded-lg z-1 "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end w-full px-3 pt-3">
              <button
                onClick={() => {
                  setShowInput(false);
                  setPassword("");
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
                Last Steps
              </div>
              <div className="w-full flex flex-col">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="xxxxxx"
                  maxLength={6}
                  className=" px-3 py-2 rounded-md  bg-gray-100 mb-5 text-lg"
                />

                <div className="flex mb-5 relative">
                  <div className="w-full bg-gray-100 px-3 py-2 text-lg rounded-md">
                    {category}
                  </div>
                  <div
                    id="dropdownDefaultButton"
                    data-dropdown-toggle="dropdown"
                    className=" cursor-pointer text-white bg-purple-500 hover:bg-purple-700 rounded-r-lg px-3.5 py-2.5  flex justfiy-center items-center"
                    onClick={() => setShowCategories((prev) => !prev)}
                  >
                    <svg
                      className="w-3.5 h-3.5 "
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </div>
                  {showCategories && (
                    <div
                      id="dropdown"
                      className="absolute top-12 left-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full"
                      style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 "
                        aria-labelledby="dropdownDefaultButton"
                      >
                        <li>
                          <button
                            onClick={() => {
                              setCategory("None");
                              setCategoryId("");
                            }}
                            className="block px-4 py-2 hover:bg-gray-100 w-full "
                          >
                            None
                          </button>
                        </li>

                        {categories.map((c) => (
                          <li key={c.id}>
                            <button
                              onClick={() => {
                                setCategory(c.name);
                                setCategoryId(c.id);
                              }}
                              className="block px-4 py-2 hover:bg-gray-100 w-full"
                            >
                              {c.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center w-full">
                <button
                  onClick={async () => {
                    setShowInput(false);
                    setPassword("");
                    setAmount("");
                    setPaymentLoading(true);
                    try {
                      if (categoryId.length === 0) {
                        const { transaction, msg, status } = await p2pTransfer(
                          userId,
                          Number(amount),
                          password
                        );
                        if (status !== 200) {
                          return setWarningMsg(msg);
                        }
                        setTransaction(transaction);
                      } else {
                        const { transaction, msg, status } = await p2pTransfer(
                          userId,
                          Number(amount),
                          password,
                          categoryId
                        );
                        if (status !== 200) {
                          return setWarningMsg(msg);
                        }
                        setTransaction(transaction);
                      }
                    } catch (e) {
                      console.error(
                        "Error encountered:",
                        e instanceof Error ? e.message : e
                      );
                      setWarningMsg("Error encountered");
                    }
                    setPaymentLoading(false);
                    setShowPaymentCard(true);
                  }}
                  className="bg-purple-500 text-white px-4 py-1 mt-2 rounded cursor-pointer text-lg"
                  disabled={!amount && amount.trim().length === 0}
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {!paymentLoading && showPaymentCard && transaction && (
        <PaymentDone
          transaction={transaction}
          onClick={() => setShowPaymentCard((prev) => !prev)}
        />
      )}
      {paymentLoading && <Loading></Loading>}
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
