"use client";

import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import TrnxCard from "./TrnxCard";
import { AxiosBindsFullTrnxs } from "./TrnxTable";
import { TransactionCardProps } from "./TransactionsCard";
import axios from "axios";
import LoadingDots from "./LoadingDots";

interface Binds {
  input?: string;
  to?: string;
  from?: string;
}

export default function SearchTrnxTable({ input, to, from }: Binds) {
  const [trnxs, setTrnxs] = useState<TransactionCardProps[]>();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAllTrnxsByDate() {
      setLoading(true);
      try {
        const res = await axios.get<AxiosBindsFullTrnxs>(
          `/api/transactions/byDate?to=${to}&from=${from}&page=${page}`
        );
        setTrnxs(res.data.transactions);
        setTotalPage(res.data.totalPage);
        setTotal(res.data.total);
        console.log(res.data.transactions);
      } catch (e) {
        console.error(
          "Error encountered while fetching  transactions by date",
          e instanceof Error ? e.message : e
        );
        alert("Error encounetered");
      } finally {
        setLoading(false);
      }
    }
    async function fetchAllTrnxByInput() {
      setLoading(true);
      try {
        const res = await axios.get<AxiosBindsFullTrnxs>(
          `/api/transactions/byInput?input=${input}&page=${page}`
        );
        setTrnxs(res.data.transactions);
        setTotalPage(res.data.totalPage);
        setTotal(res.data.total);
        console.log(res.data.transactions);
      } catch (e) {
        console.error(
          "Error encountered while fetching transactions by input:",
          e instanceof Error ? e.message : e
        );
        alert("Error encounetered");
      } finally {
        setLoading(false);
      }
    }
    if (input) {
      fetchAllTrnxByInput();
    }
    if (to && from) {
      fetchAllTrnxsByDate();
    }
  }, [to, from, page, input]);
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
    <div className="w-full h-full">
      {!trnxs || trnxs?.length === 0 ? (
        <div className="flex justify-center items-center md:text-4xl sm:text-2xl text-xl text-gray-600 h-[calc(100vh-15rem)] w-full">
          No Transactions Found{" "}
        </div>
      ) : (
        <div className="w-full pb-10 pt-5">
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
                {trnxs.map((t: TransactionCardProps) => (
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
          </div>
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
