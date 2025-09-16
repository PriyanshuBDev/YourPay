"use client";

import { useEffect, useState } from "react";
import TrnxCard from "./TrnxCard";
import type { TransactionCardProps } from "./TransactionsCard";

import axios from "axios";
import Pagination from "./Pagination";
import LoadingDots from "./LoadingDots";

export interface AxiosBindsFullTrnxs {
  msg: string;
  transactions: TransactionCardProps[];
  totalPage: number;
  total: number;
}

export default function TrnxTable() {
  const [allTranx, setAllTranx] = useState(true);
  const [payment, setPayment] = useState(false);
  const [topUps, setTopUps] = useState(false);
  const [trnxs, setTrnxs] = useState<TransactionCardProps[]>();
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllTrnsacs() {
      setLoading(true);
      try {
        const res = await axios.get<AxiosBindsFullTrnxs>(
          `/api/transactions/full/${type}/${page}`
        );
        setTrnxs(res.data.transactions);
        setTotalPage(res.data.totalPage);
        setTotal(res.data.total);
      } catch (e) {
        console.error(
          "Error encountered while fetching all transactions",
          e instanceof Error ? e.message : e
        );
        alert("Error encounetered");
      } finally {
        setLoading(false);
      }
    }
    fetchAllTrnsacs();
  }, [type, page]);
  if (loading) {
    return (
      <div className="flex justify-center items-center md:text-4xl sm:text-2xl text-xl text-gray-600 h-[calc(100vh-15rem)] w-full">
        <div className="flex gap-3">
          Loading{" "}
          <div className="flex items-end">
            <LoadingDots size="2" bg="bg-gray-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      <div className="flex w-full  border-gray-200 gap-8 mb-4 lg:text-xl md:text-lg mt-2">
        <button
          className={`py-2 px-2 cursor-pointer text-md hover:text-purple-500 ${
            allTranx ? "text-purple-500 border-b-4" : "text-gray-700"
          }`}
          onClick={() => {
            setAllTranx(true);
            setPayment(false);
            setTopUps(false);
            setType("all");
          }}
        >
          All
        </button>

        <button
          className={`py-2 cursor-pointer text-md hover:text-purple-500 ${
            payment ? "text-purple-500 border-b-4" : "text-gray-700"
          }`}
          onClick={() => {
            setAllTranx(false);
            setTopUps(false);
            setPayment(true);
            setType("p2p");
          }}
        >
          Payment
        </button>
        <button
          className={`py-2 cursor-pointer text-md hover:text-purple-500 ${
            topUps ? "text-purple-500 border-b-4" : "text-gray-700"
          }`}
          onClick={() => {
            setAllTranx(false);
            setPayment(false);
            setTopUps(true);
            setType("topUp");
          }}
        >
          TopUps
        </button>
      </div>
      {!trnxs || trnxs?.length === 0 ? (
        <div className="flex justify-center items-center md:text-4xl sm:text-2xl text-xl text-gray-600 h-[calc(100vh-15rem)] w-full">
          No Transactions Found{" "}
        </div>
      ) : (
        <div
          className="mt-4 bg-white rounded-xl"
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
        >
          <table className="w-full text-left rtl:text-right lg:text-xl md:text-lg sm:text-sm">
            <thead className="uppercase border-b-2 border-gray-200 ">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold ">
                  Id
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Recipient
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Category
                </th>
              </tr>
            </thead>
            <tbody>
              {trnxs.map((t) => (
                <TrnxCard
                  key={t.id}
                  profileImg={t.profileImg}
                  recipient={t.recipient}
                  credit={t.credit}
                  debit={t.debit}
                  category={t.category}
                  date={t.date}
                  status={t.status}
                  id={t.id}
                />
              ))}
            </tbody>
          </table>

          <Pagination
            total={total}
            totalPage={totalPage}
            setPage={setPage}
            page={page}
          ></Pagination>
        </div>
      )}
    </div>
  );
}
