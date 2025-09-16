"use client";

import Image from "next/image";
import EnableDisableBtn from "./EnableDisableBtn";
import { useEffect, useState } from "react";
import { toggleQUser } from "../lib/actions/toggleQUser";
import type { TransactionDetailsProps } from "./PaymentDone";
import type { categories } from "./QuickTransfer";
import { p2pTransfer } from "../lib/actions/p2pTransfer";
import PaymentDone from "./PaymentDone";
import { getUserDetails } from "../lib/actions/userDetails";
import Loading from "./Loading";
import {
  handleAmountChange,
  handleAmountKeyDown,
} from "../lib/functions/AmountFilter";
import { CustomAlert } from "./CustomAlert";

interface UserCardProps {
  id: string;
  username: string;
  email: string;
  publicId: string;
  isQUser: boolean;
  profileImg: string;
}
export default function UserCard({
  id,
  username,
  email,
  publicId,
  isQUser,
  profileImg,
}: UserCardProps) {
  const [showInput, setShowInput] = useState(false);
  const [password, setPassword] = useState("");
  const [categories, setCategories] = useState<categories[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [category, setCategory] = useState("None");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentCard, setShowPaymentCard] = useState(false);
  const [transaction, setTransaction] = useState<TransactionDetailsProps>();
  const [warningMsg, setWarningMsg] = useState("");

  useEffect(() => {
    const handleFetching = async () => {
      const { categories } = await getUserDetails();
      setCategories(categories || []);
    };
    handleFetching();
    setUserId(id);
  }, [id]);
  return (
    <div
      className="flex rounded-lg w-full md:p-5 sm:p-3 p-2 mt-5 gap-8 items-center bg-white"
      style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
    >
      <div>
        <div className="relative md:w-15 md:h-15 w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={profileImg}
            alt="Profile Pic"
            className="object-center object-cover"
            fill
          />
        </div>
      </div>
      <div className="w-full flex justify-between items-center gap-5">
        <div className="flex flex-col text-sm ">
          <div className="font-semibold text-lg">{username}</div>
          <div>{publicId}</div>
          <div>{email}</div>
        </div>
        <div className="flex h-fit text-nowrap">
          <EnableDisableBtn
            onClick={async () => {
              await toggleQUser(id);
            }}
            isDisable={isQUser}
            ELabel="Quick User"
            DLabel="Add"
          ></EnableDisableBtn>
          <div
            className={`cursor-pointer  hover:bg-purple-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-xl px-3 py-2 me-2 mb-2 bg-purple-500 text-white`}
            onClick={() => setShowInput(true)}
          >
            Pay
          </div>
        </div>
      </div>
      {showInput && (
        <div
          className=" fixed inset-0 bg-black/20 flex items-center justify-center z-40"
          onClick={() => {
            setShowInput(false);
            setPassword("");
            setAmount("");
            setCategory("None");
          }}
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
                  setAmount("");
                  setCategory("None");
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
              <div className="text-purple-500 text-2xl font-semibold w-full flex justify-center mb-5">
                Paying To
              </div>
              <div className="flex w-full justify-center flex-col items-center">
                <div className="relative md:w-15 md:h-15 w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={profileImg}
                    alt="Profile Pic"
                    className="object-center object-cover"
                    fill
                  />
                </div>
                <div className="text-xl mt-2 font-semibold">{username}</div>
                <div className="text-sm mb-3">{email}</div>
              </div>

              <div className="w-full flex flex-col">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e, setAmount)}
                  onKeyDown={handleAmountKeyDown}
                  placeholder="₹"
                  className=" px-3 py-2 rounded-md  bg-gray-100 mb-5 text-lg"
                />
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

                        {categories.map((c: categories) => (
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
