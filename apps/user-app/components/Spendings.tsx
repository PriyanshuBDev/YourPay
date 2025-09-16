import { getMontlyBudget } from "../lib/actions/monthlyBudget";
import RedirectButton from "./RedirectButton";
import SpendingsChart from "./SpendingsChart";

const categoryColors: Record<
  string,
  { color: string; colorText: string; colorText2: string }
> = {
  Subscriptions: {
    color: "bg-indigo-500",
    colorText: "text-indigo-700",
    colorText2: "text-indigo-500",
  },
  "Food & Dining": {
    color: "bg-orange-500",
    colorText: "text-orange-700",
    colorText2: "text-orange-500",
  },
  Shopping: {
    color: "bg-pink-500",
    colorText: "text-pink-700",
    colorText2: "text-pink-500",
  },
  Installments: {
    color: "bg-rose-500",
    colorText: "text-rose-700",
    colorText2: "text-rose-500",
  },
  Travel: {
    color: "bg-teal-500",
    colorText: "text-teal-700",
    colorText2: "text-teal-500",
  },
  Miscellaneous: {
    color: "bg-yellow-500",
    colorText: "text-yellow-700",
    colorText2: "text-yellow-500",
  },
  "Bills & Utilities": {
    color: "bg-emerald-500",
    colorText: "text-emerald-700",
    colorText2: "text-emerald-500",
  },
  Savings: {
    color: "bg-green-500",
    colorText: "text-green-700",
    colorText2: "text-green-500",
  },
  Health: {
    color: "bg-blue-500",
    colorText: "text-blue-700",
    colorText2: "text-blue-500",
  },
  Entertainment: {
    color: "bg-violet-500",
    colorText: "text-violet-700",
    colorText2: "text-violet-500",
  },
};

export default async function Spendings() {
  const res = await getMontlyBudget();
  const fullSpends = res.budget.map((b) => {
    const extra = categoryColors[b.name] || {
      color: "bg-red-500",
      colorText: "text-red-700",
      colorText2: "text-red-500",
    };
    return { ...b, ...extra };
  });

  if (fullSpends.length < 1) {
    return (
      <div className="flex w-full h-full justify-center items-center flex-col gap-4">
        <div className="text-gray-700 text-lg">No data to show</div>
        <RedirectButton to={"/settings/budget"}>Create Budget</RedirectButton>
      </div>
    );
  }
  return (
    <div className="flex ">
      <div className="w-110 h-60">
        <SpendingsChart spends={fullSpends} />
      </div>

      <div className="grid grid-cols-2 w-full pb-5">
        {fullSpends.map((f, i) => (
          <div key={i} className="flex gap-3 items-center">
            <div className={`px-1 rounded h-8 ${f.color}`}></div>
            <div className={`${f.colorText} text-lg`}>{f.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
