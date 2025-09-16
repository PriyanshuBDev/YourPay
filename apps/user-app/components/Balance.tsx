import { getBalance } from "../lib/actions/balance";
import Chart from "./BalanceChart";

export default async function Balance() {
  const payload = await getBalance();
  let amount;
  let locked;
  if (payload.amount === 0) {
    amount = 0;
  } else {
    amount = payload.amount / 100;
  }

  if (payload.locked === 0) {
    locked = 0;
  } else {
    locked = payload.locked / 100;
  }

  const data = [
    { name: "Unlocked", value: amount },
    { name: "Locked", value: locked },
  ];
  return <Chart data={data}></Chart>;
}
