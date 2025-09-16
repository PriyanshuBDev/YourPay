"use client";

import { useState } from "react";
import RecentTrnx from "./RecentTrnx";
import TopUpsChart from "./TopUpsChart";
import { createOnRampTransactions } from "../lib/actions/createOnRampTransactions";
import { useRouter } from "next/navigation";
import {
  handleAmountChange,
  handleAmountKeyDown,
} from "../lib/functions/AmountFilter";
import { CustomAlert } from "./CustomAlert";
import Loading from "./Loading";

export default function WalletPage() {
  const [amount, setAmount] = useState("");
  const [showBanks, setShowBanks] = useState(false);
  const [bank, setBank] = useState("Select Bank");
  const [password, setPassword] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const banks = [
    "Axis Bank",
    "Bank of Baroda (BoB)",
    "Bank of India",
    "Bank of Maharashtra",
    "Canara Bank",
    "Central Bank of India",
    "City Union Bank",
    "DCB Bank",
    "Federal Bank",
    "HDFC Bank",
    "ICICI Bank",
    "IDFC FIRST Bank",
    "Indian Bank",
    "Indian Overseas Bank",
    "IndusInd Bank",
    "Jammu & Kashmir Bank",
    "Karur Vysya Bank",
    "Karnataka Bank",
    "Kotak Mahindra Bank",
    "Punjab & Sind Bank",
    "Punjab National Bank (PNB)",
    "RBL Bank",
    "South Indian Bank",
    "State Bank of India (SBI)",
    "UCO Bank",
    "Union Bank of India",
    "Yes Bank",
  ];
  return (
    <div className="grid xl:grid-cols-2 gap-8 grid-cols-1 pb-10">
      <div
        className="bg-white w-full rounded-xl p-5 sm:p-6 lg:p-8 mt-8 sm:mt-10 col-span-1 h-fit"
        style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
      >
        <div className="text-purple-500 text-2xl font-semibold">
          TopUp Your Wallet
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
              {bank}
            </div>
            <div
              id="dropdownDefaultButton"
              data-dropdown-toggle="dropdown"
              className=" cursor-pointer text-white bg-purple-500 hover:bg-purple-700 rounded-r-lg px-3.5 py-2.5  flex justfiy-center items-center"
              onClick={() => setShowBanks((prev) => !prev)}
            >
              <svg
                className={`w-3.5 h-3.5 transition-all duration-300 ${showBanks ? "rotate-180" : ""}`}
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
            className={`z-10 transition-all duration-300 ease-in-out transform origin-top bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full  text-sm ${showBanks ? "opacity-100 max-h-96 scale-y-100" : "opacity-0 max-h-0  scale-y-0"}`}
            style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
          >
            <ul
              className="py-2 text-sm text-gray-700 max-h-60 overflow-y-auto "
              aria-labelledby="dropdownDefaultButton"
            >
              {banks.map((b, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      setBank(b);
                      setShowBanks((prev) => !prev);
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 w-full border-b border-gray-200"
                  >
                    {b}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-center w-full mt-5">
          <button
            onClick={async () => {
              setLoading(true);
              try {
                const { status, msg, token } = await createOnRampTransactions(
                  bank,
                  Number(amount),
                  password
                );
                if (status !== 200) {
                  setWarningMsg(msg);
                }
                if (token) {
                  router.push(
                    `/wallet/transfer?token=${token}&&amount=${amount}`
                  );
                }
              } catch (e) {
                console.error(
                  "Error encountered:",
                  e instanceof Error ? e.message : e
                );
                setWarningMsg("Error encountered");
              } finally {
                setLoading(false);
              }
            }}
            className={` px-8 py-1.5 mt-2 rounded cursor-pointer text-xl ${amount.length === 0 || !amount || bank === "Select Bank" ? "bg-gray-300 text-gray-500" : "bg-purple-500 text-white"}`}
            disabled={amount.length === 0 || !amount || bank === "Select Bank"}
          >
            Proceed
          </button>
        </div>
      </div>
      <div className="mt-10 col-span-1">
        {" "}
        <RecentTrnx type="topUps" isCategory={false}></RecentTrnx>
        <TopUpsChart />
      </div>
      {warningMsg && (
        <CustomAlert
          type={"error"}
          msg={warningMsg}
          onClose={() => setWarningMsg("")}
        />
      )}
      {loading && <Loading />}
    </div>
  );
}
