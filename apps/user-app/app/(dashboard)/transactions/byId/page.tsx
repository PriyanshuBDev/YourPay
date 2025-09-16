import { redirect } from "next/navigation";
import RedirectString from "../../../../components/RedirectString";
import { getTransactionDetails } from "../../../../lib/actions/transactionDetails";
import { format } from "date-fns";
import Image from "next/image";
import QuickUserBtn from "../../../../components/QuickUserBtn";

interface trnxByIdPageProps {
  searchParams?: {
    id?: string;
  };
}

export default async function TrnxById({ searchParams }: trnxByIdPageProps) {
  const id = searchParams?.id ?? "";
  if (!id) {
    redirect("/transactions/history");
  }
  const res = await getTransactionDetails(id);
  const trnx = res.trnxDetails;
  if (!trnx || trnx === null || trnx === undefined) {
    redirect("/transactions/history");
  }
  // const trnx = {
  //   id: "7b0fdb45-d88c-4a54-b863-ecb09bad5118",
  //   status: "Success",
  //   date: "2025-08-23T10:52:41.000Z",
  //   recipient: {
  //     name: "Alex",
  //     profileImg: "",
  //     publicId: "fkasjfklasdjfklj",
  //     number: "+912345678901",
  //     isQUser: true,
  //     id: "kfkajf",
  //   },
  //   credit: 0,
  //   debit: 30000,
  //   category: "Subscriptions",
  // };
  const formated = format(new Date(trnx.date!), "EEE d, yyyy hh:mm a");
  let color: string;
  let color2: string;
  let colorText: string;
  let colorBorder: string;

  if (trnx.category === "Subscriptions") {
    color = "bg-indigo-500";
    color2 = "bg-indigo-50";
    colorText = "text-indigo-700";
    colorBorder = "border-indigo-500";
  } else if (trnx.category === "Food & Dining") {
    color = "bg-orange-500";
    color2 = "bg-orange-50";
    colorText = "text-orange-700";
    colorBorder = "border-orange-500";
  } else if (trnx.category === "Shopping") {
    color = "bg-pink-500";
    color2 = "bg-pink-50";
    colorText = "text-pink-700";
    colorBorder = "border-pink-500";
  } else if (trnx.category === "Installments") {
    color = "bg-rose-500";
    color2 = "bg-rose-50";
    colorText = "text-rose-700";
    colorBorder = "bg-rose-500";
  } else if (trnx.category === "Travel") {
    color = "bg-teal-500";
    color2 = "bg-teal-50";
    colorText = "text-teal-700";
    colorBorder = "border-teal-500";
  } else if (trnx.category === "Miscellaneous") {
    color = "bg-yellow-500";
    color2 = "bg-yellow-50";
    colorText = "text-yellow-700";
    colorBorder = "border-yellow-500";
  } else if (trnx.category === "Bills & Utilities") {
    color = "bg-emerald-500";
    color2 = "bg-emerald-50";
    colorText = "text-emerald-700";
    colorBorder = "border-emerald-500";
  } else if (trnx.category === "Savings") {
    color = "bg-green-500";
    color2 = "bg-green-50";
    colorText = "text-green-700";
    colorBorder = "border-green-500";
  } else if (trnx.category === "Health") {
    color = "bg-blue-500";
    color2 = "bg-blue-50";
    colorText = "text-blue-700";
    colorBorder = "border-blue-500";
  } else if (trnx.category === "Entertainment") {
    color = "bg-violet-500";
    color2 = "bg-violet-50";
    colorText = "text-violet-700";
    colorBorder = "border-violet-500";
  } else {
    color = "bg-red-500";
    color2 = "bg-red-50";
    colorText = "text-red-700";
    colorBorder = "border-red-500";
  }
  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-gray-50 px-5">
      <div className=" text-3xl sm:text-4xl lg:text-5xl text-purple-500 font-semibold">
        Transaction Details
      </div>
      <div className="flex items-center gap-0.5 mt-2">
        <RedirectString label="Transactions" to={"/transactions/history"} />
        <div className="text-2xl"> / </div>
        <div className="text-gray-700 font-semibold ">{id}</div>
      </div>
      <div
        className="bg-white rounded-3xl p-5 mt-10"
        style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
      >
        <div className="text-gray-500">Transaction ID</div>
        <div className="text-2xl">{id}</div>

        <div
          className={`text-5xl flex justify-center w-full mt-5 font-semibold ${trnx.credit === 0 ? "text-red-500" : "text-green-500"}`}
        >
          {trnx.credit === 0
            ? `₹${(trnx.debit / 100).toFixed(2)}`
            : `₹${(trnx.credit! / 100).toFixed(2)}`}
        </div>
        <div className="flex justify-between gap-3 p-5">
          <div>
            <div className="text-gray-500 text-lg mb-2">Status</div>
            <div
              className={` text-xl font-semibold inline-flex gap-2 items-center rounded-full px-2  ${trnx.status === "Processing" ? "text-gray-700 bg-gray-100" : `${trnx.status === "Success" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${trnx.status === "Processing" ? " bg-gray-500" : `${trnx.status === "Success" ? " bg-green-500" : " bg-red-500"}`}`}
              ></div>{" "}
              <div>{trnx.status}</div>
            </div>
          </div>
          <div>
            <div className="text-gray-500 text-xl mb-2">Date</div>
            <div className="font-semibold text-xl">{formated}</div>
          </div>
          <div>
            <div className="text-gray-500 text-lg mb-2">Category</div>
            <div className="font-semibold text-xl">
              {trnx.category !== "None" ? (
                <div className="flex">
                  <div
                    className={` flex items-center gap-2 px-2  rounded-full border-2 font-semibold ${colorBorder} ${colorText} ${color2}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${color}`}></div>{" "}
                    {trnx.category}
                  </div>
                </div>
              ) : (
                <div>None</div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t-2 border-gray-100 p-3">
          <div className="text-xl font-semibold mb-5">Recipient</div>
          <div className=" flex gap-8">
            <div>
              <div className="relative md:w-18 md:h-18 w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={
                    trnx.recipient!.profileImg ||
                    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  }
                  alt="Profile Pic"
                  className="object-center object-cover"
                  fill
                />
              </div>
            </div>
            <div className=" flex justify-between w-full items-center">
              <div>
                {trnx.recipient!.name && <div>{trnx.recipient!.name}</div>}
                {trnx.recipient!.publicId && (
                  <div>{trnx.recipient!.publicId}</div>
                )}
                {trnx.recipient!.email && <div>{trnx.recipient!.email}</div>}
              </div>
              {trnx.recipient!.isQUser != null && (
                <QuickUserBtn
                  id={trnx.recipient!.id}
                  isDisable={trnx.recipient!.isQUser}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
