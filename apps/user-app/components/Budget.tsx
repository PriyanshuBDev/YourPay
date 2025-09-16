import ProgressBar from "./ProgressBar";
import { getMontlyBudget } from "../lib/actions/monthlyBudget";
import RedirectButton from "./RedirectButton";

// export const categoryBudgets: CategoryBudget[] = [
//   { category: "Subscriptions", value: 10, limit: 2000 },
//   { category: "Installments", value: 450, limit: 8000 },
//   { category: "Food & Dining", value: 780, limit: 6000 },
//   { category: "Travel", value: 670, limit: 3000 },
//   { category: "Shopping", value: 4990, limit: 5000 },
//   { category: "Bills & Utilities", value: 340, limit: 4000 },
//   { category: "Health", value: 4320, limit: 3000 },
//   { category: "Entertainment", value: 340, limit: 2500 },
//   { category: "Miscellaneous", value: 900, limit: 1500 },
//   { category: "Savings", value: 6700, limit: 7000 },
// ];

export default async function Budget() {
  const res = await getMontlyBudget();
  if (res.budget.length < 1) {
    return (
      <div className="flex w-full h-75 justify-center items-center flex-col gap-4">
        <div className="text-gray-700 text-lg">No data to show</div>
        <RedirectButton to={"/settings"}>Create Budget</RedirectButton>
      </div>
    );
  }
  return (
    <div className="overflow-y-auto h-76">
      {res.budget.length < 4 ? (
        <div>
          {res.budget.map((b) => (
            <ProgressBar
              key={b.id}
              category={b.name}
              spent={b.spent}
              limit={b.limit}
            />
          ))}
          <div className="flex w-full justify-center mt-5">
            <RedirectButton to={"/settings"}>Create More Budget</RedirectButton>
          </div>
        </div>
      ) : (
        res.budget.map((b) => (
          <ProgressBar
            key={b.id}
            category={b.name}
            spent={b.spent}
            limit={b.limit}
          />
        ))
      )}
    </div>
  );
}
