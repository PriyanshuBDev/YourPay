import RedirectString from "../../../../../components/RedirectString";
import { format } from "date-fns";
import SearchTrnxBar from "../../../../../components/SearchTrnxBar";
import SearchTrnxDate from "../../../../../components/SearchTrnxDate";

import SearchTrnxTable from "../../../../../components/SearchTrnxTable";
import { redirect } from "next/navigation";

export default async function SearchUser({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const input = (await searchParams).input || "";
  const to = (await searchParams).to || "";
  const from = (await searchParams).from || "";
  if (!input && !to && !from) {
    redirect("/transactions/history");
  }
  let formatedTo;
  let formatedFrom;
  if (to && from) {
    formatedTo = format(new Date(to), "dd/MM/yyyy");
    formatedFrom = format(new Date(from), "dd/MM/yy");
  }
  return (
    <div className="px-5 pb-5">
      <div className="flex  text-2xl">
        <RedirectString label="Transactions" to={"/transactions/history"} />
        <div>/</div>
        <div className="text-gray-700 font-semibold ">
          Search:{" "}
          {input ? input : to && from ? `${formatedFrom}-${formatedTo}` : ""}
        </div>
      </div>
      <div className="flex gap-10 w-full mt-10 justify-between">
        <div className="w-full">
          <SearchTrnxBar />
        </div>
        <div className="w-fit">
          <SearchTrnxDate />
        </div>
      </div>
      <SearchTrnxTable to={to} from={from} input={input} />
    </div>
  );
}
