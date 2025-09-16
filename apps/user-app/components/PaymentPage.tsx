"use client";

import { useEffect, useState } from "react";
import PaySearchUserBar from "./PaySearchUserBar";
import Image from "next/image";
import { categories } from "./QuickTransfer";
import PaymentDone, { TransactionDetailsProps } from "./PaymentDone";
import { getUserDetails } from "../lib/actions/userDetails";
import { p2pTransfer } from "../lib/actions/p2pTransfer";
import Loading from "./Loading";
import ErrorEncountered from "./ErrorEncountered";
import RecentTrnx from "./RecentTrnx";
import QuickUsers from "./QuickUsers";
import {
  handleAmountChange,
  handleAmountKeyDown,
} from "../lib/functions/AmountFilter";
import { CustomAlert } from "./CustomAlert";

export interface UserProps {
  id: string;
  username: string;
  profileImg: string;
  email: string;
  publicId: string;
}

export default function PaymentPage() {
  const [user, setUser] = useState<UserProps | null>(null);
  const [password, setPassword] = useState("");
  const [categories, setCategories] = useState<categories[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [category, setCategory] = useState("None");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentCard, setShowPaymentCard] = useState(false);
  const [transaction, setTransaction] = useState<TransactionDetailsProps>();
  const [showError, setShowError] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");

  useEffect(() => {
    const handleFetching = async () => {
      const { categories } = await getUserDetails();
      setCategories(categories || []);
    };
    handleFetching();
  }, []);
  const reload = () => {
    window.location.reload();
  };
  const unActive =
    !amount ||
    amount.trim().length === 0 ||
    !password ||
    password.trim().length === 0 ||
    !user ||
    !user.id;
  return (
    <div className="grid xl:grid-cols-2 gap-8 grid-cols-1">
      <div
        className="bg-white w-full rounded-xl p-5 sm:p-6 lg:p-8 mt-8 sm:mt-10 col-span-1 h-fit"
        style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
      >
        <PaySearchUserBar setUser={setUser}></PaySearchUserBar>
        <div
          className={`mt-3 transition-all duration-500 ease-in-out
    ${
      user
        ? "opacity-100 translate-y-0"
        : "opacity-0 -translate-y-3 pointer-events-none"
    }`}
        >
          {user && (
            <div>
              <div className="text-2xl text-purple-500 font-semibold">To,</div>
              <div className="flex w-full justify-center mt-2">
                <div className="relative md:w-17 md:h-17 w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={user.profileImg}
                    alt="Profile Pic"
                    className="object-center object-cover"
                    fill
                  />
                </div>
              </div>
              <div className="w-full flex justify-between items-center gap-1 mt-5">
                <div className="flex flex-col items-center">
                  <div className="text-gray-500 text-xs">Username</div>
                  <div className="font-semibold ">{user.username}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-gray-500 text-xs">Public ID</div>
                  <div className="font-semibold ">{user.publicId}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-gray-500 text-xs">Email</div>
                  <div className="font-semibold text-sm">{user.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-5">
          <div className="w-full flex flex-col">
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e, setAmount)}
              onKeyDown={handleAmountKeyDown}
              placeholder="Amount"
              className=" px-3 py-2 rounded-md  bg-gray-100 mb-5 text-lg"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              maxLength={6}
              className=" px-3 py-2 rounded-md  bg-gray-100 mb-5 text-lg"
            />
          </div>

          <div className="flex mb-1 relative">
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
                className={`w-3.5 h-3.5 transition-all duration-300 ${showCategories ? "rotate-180" : ""}`}
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
          </div>
          <div
            id="dropdown"
            className={`z-10 transition-all duration-300 ease-in-out transform origin-top bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full  text-sm ${showCategories ? "opacity-100 max-h-96 scale-y-100" : "opacity-0 max-h-0  scale-y-0"}`}
            style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
          >
            <ul
              className="py-2 text-sm text-gray-700 max-h-60 overflow-y-auto "
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

              {categories.map((c: categories) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setCategory(c.name);
                      setCategoryId(c.id);
                      setShowCategories((prev) => !prev);
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 w-full"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {showError && (
          <ErrorEncountered
            label={
              "An error is encountered. Please try again later. Any amount deducted while be refunded shortly."
            }
            onClick={() => setShowError(false)}
          />
        )}
        <div className="flex justify-center w-full">
          <button
            onClick={async () => {
              if (user?.id) {
                setPaymentLoading(true);
                try {
                  if (categoryId.length === 0) {
                    const { transaction, status, msg } = await p2pTransfer(
                      user.id,
                      Number(amount),
                      password
                    );
                    if (status !== 200) {
                      setWarningMsg(msg);
                    }
                    setTransaction(transaction);
                  } else {
                    const { transaction, status, msg } = await p2pTransfer(
                      user.id,
                      Number(amount),
                      password,
                      categoryId
                    );
                    if (status !== 200) {
                      setWarningMsg(msg);
                    }
                    setTransaction(transaction);
                  }
                  setAmount("");
                  setPassword("");
                  setCategory("None");
                } catch (e) {
                  console.error(
                    "Error encountered:",
                    e instanceof Error ? e.message : e
                  );
                  setWarningMsg("Error encountered");
                }
                setPaymentLoading(false);
                setShowPaymentCard(true);
              }
            }}
            className={` px-8 py-1.5 mt-2 rounded cursor-pointer text-xl ${unActive ? "bg-gray-300 text-gray-500" : "bg-purple-500 text-white"}`}
            disabled={unActive}
          >
            Transfer
          </button>
        </div>

        {!paymentLoading && showPaymentCard && transaction && (
          <PaymentDone
            transaction={transaction}
            onClick={() => {
              setShowPaymentCard((prev) => !prev);
              reload();
            }}
          />
        )}
        {paymentLoading && <Loading />}
      </div>
      <div className="mt-10 col-span-1">
        {" "}
        <RecentTrnx type="p2p" isCategory={true}></RecentTrnx>
        <QuickUsers setUser={setUser}></QuickUsers>
      </div>
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
