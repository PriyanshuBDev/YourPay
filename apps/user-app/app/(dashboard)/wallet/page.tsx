import WalletPage from "../../../components/WalletPage";
import { getBalance } from "../../../lib/actions/balance";

export default async function Transfer() {
  const { amount, locked } = await getBalance();
  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-gray-50 px-5 pb-10">
      <div className="flex justify-between w-full">
        <div>
          <div className=" text-3xl sm:text-4xl lg:text-5xl text-purple-500 font-semibold">
            Your Wallet
          </div>
          <div className="text-gray-500 text-base sm:text-lg mt-2">
            Seamless Top-Ups, Instant Balance.
          </div>
        </div>
        <div
          className="flex rounded-2xl"
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.1)" }}
        >
          <div className=" flex flex-col justify-center items-center text-white bg-purple-500 rounded-l-2xl  px-3">
            <div>Total Current Balance</div>
            <div className="text-3xl font-semibold">
              ₹ {((amount + locked) / 100).toFixed(2)}
            </div>
          </div>
          <div className=" flex flex-col justify-center items-center  bg-white rounded-r-2xl px-3">
            <div className="flex gap-5 w-full justify-between">
              <div>Unlocked:</div>
              <div className="font-semibold">₹ {(amount / 100).toFixed(2)}</div>
            </div>
            <div className="flex gap-5 w-full justify-between">
              <div>Locked:</div>
              <div className="font-semibold">₹ {(locked / 100).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      <WalletPage></WalletPage>
    </div>
  );
}
