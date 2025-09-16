import SearchTrnxBar from "../../../../components/SearchTrnxBar";
import SearchTrnxDate from "../../../../components/SearchTrnxDate";
import TrnxTable from "../../../../components/TrnxTable";

export default function TransactionsHistory() {
  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-gray-50 px-5">
      <div className=" text-3xl sm:text-4xl lg:text-5xl text-purple-500 font-semibold">
        Transaction History
      </div>
      <div className="text-gray-500 text-base sm:text-lg mt-2 ml-2">
        Your financial record, securely storedly.
      </div>
      <div className="flex gap-10 w-full mt-10 justify-between">
        <div className="w-full">
          <SearchTrnxBar />
        </div>
        <div className="w-fit">
          <SearchTrnxDate />
        </div>
      </div>
      <TrnxTable />
    </div>
  );
}
