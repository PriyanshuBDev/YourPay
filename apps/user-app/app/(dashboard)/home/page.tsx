import Balance from "../../../components/Balance";
import Btn2 from "../../../components/Btn2";
import RecentTransacs from "../../../components/RecentTransacs";
import MonSavingsChart from "../../../components/MonSavingsChart";
import Budget from "../../../components/Budget";
import QuickTransfer from "../../../components/QuickTransfer";
import Spendings from "../../../components/Spendings";
import { getBalance } from "../../../lib/actions/balance";
import TransactionsGraph from "../../../components/TransactionsGraph";

export default async function Home() {
  const { amount, locked } = await getBalance();
  return (
    <div className="px-5 pb-10">
      <div className=" text-3xl sm:text-4xl lg:text-5xl text-purple-500 font-semibold">
        Home
      </div>
      <div className="text-xl text-gray-600">
        Acess & manage your account and transactions efficiently
      </div>
      <div className="grid xl:grid-cols-10 mt-5 gap-8 grid-cols-3">
        <div
          className="items-center px-5 py-5 rounded-2xl bg-white col-span-3"
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
        >
          <div className="flex text-xl gap-3 ">
            {" "}
            <svg
              className="w-7 h-7 text-purple-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8H5m12 0a1 1 0 0 1 1 1v2.6M17 8l-4-4M5 8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6M5 8l4-4 4 4m6 4h-4a2 2 0 1 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z"
              />
            </svg>
            <div className="font-semibold">Your Wallet</div>
          </div>
          <div className=" h-47 rounded-2xl bg-white mt-3">
            <Balance></Balance>
          </div>
          <div className=" mt-3 flex flex-col justify-center items-center text-white bg-purple-500 rounded-2xl w-full h-20">
            <div>Total Current Balance</div>
            <div className="text-3xl font-semibold">
              ₹ {((amount + locked) / 100).toFixed(2)}
            </div>
          </div>
        </div>
        <div
          className="py-5  h-90 rounded-2xl bg-white xl:col-span-4 col-span-3"
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
        >
          <div className="flex text-xl px-5 gap-3 l">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
            <div className="font-semibold">Cash Flow </div>
          </div>
          <div className="h-68 mt-5">
            <TransactionsGraph></TransactionsGraph>
          </div>
        </div>
        <div
          className=" py-5 h-90 pr-5 rounded-2xl bg-white col-span-3"
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
        >
          <div className="flex  text-xl px-5 gap-3">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-yellow-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
            <div className="font-semibold ">Monthly Savings </div>
          </div>
          <div className="h-75 pt-3">
            <MonSavingsChart></MonSavingsChart>
          </div>
        </div>
      </div>
      <div className=" gap-8 mt-8 grid lg:grid-cols-5 grid-cols-3">
        <div
          className=" h-fit px-5 py-5 rounded-2xl bg-white col-span-3 w-full"
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
        >
          <div className="flex justify-between items-center w-full">
            <div className="text-xl font-semibold  flex gap-3 items-center">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7 text-pink-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
                />
              </svg>
              Recent Transactions
            </div>
            <Btn2 label="view all" direct="/transactions/history"></Btn2>
          </div>
          <RecentTransacs></RecentTransacs>
        </div>

        <div
          className=" p-5 h-fit rounded-2xl bg-white col-span-3 lg:col-span-2 "
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
        >
          <div className="font-semibold flex  text-xl gap-3 items-center mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
            Your Budget
          </div>
          <Budget></Budget>
        </div>
      </div>
      <div className=" gap-8 grid lg:grid-cols-2 grid-cols-1">
        <div
          className=" h-fit pt-5 rounded-2xl bg-white mt-8 col-span-1"
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
        >
          <QuickTransfer></QuickTransfer>
        </div>
        <div
          className=" pt-5 rounded-2xl bg-white mt-8 col-span-1"
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
        >
          <div className="font-semibold flex px-5 text-xl gap-3 items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7 text-sky-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
              />
            </svg>
            Spendings
          </div>
          <Spendings></Spendings>
        </div>
      </div>
    </div>
  );
}
