import BudgetSetter from "../../../components/BudgetSetter";
import Dropdown from "../../../components/Dropdown";
import DropdownFaqs from "../../../components/DropdownFaqs";
import LogOutBtn from "../../../components/LogOutBtn";
import PasswordDropdown from "../../../components/PasswordDropdown";
import ProfileEdit from "../../../components/ProfileEdit";

export default function Settings() {
  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-gray-50 px-5">
      <div className=" text-3xl sm:text-4xl lg:text-5xl text-purple-500 font-semibold">
        Settings
      </div>
      <div className="text-gray-500 text-base sm:text-lg mt-2">
        Manage preferences and settings seamlessly.
      </div>

      <div
        className="bg-white w-full rounded-xl p-5 sm:p-6 lg:p-8 mt-8 sm:mt-10"
        style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
      >
        <div className="text-purple-500 text-2xl sm:text-3xl font-semibold">
          Personal Info
        </div>
        <div className="">
          <ProfileEdit />
        </div>
      </div>
      <div>
        <BudgetSetter></BudgetSetter>
      </div>
      <div>
        <div
          className="bg-white w-full rounded-xl p-5 sm:p-6 lg:p-8 mt-8 sm:mt-10"
          style={{ boxShadow: "0 0 3px 2px rgba(0,0,0,0.05)" }}
        >
          <div className="text-purple-500 text-2xl sm:text-3xl font-semibold mb-5">
            General
          </div>
          <PasswordDropdown />
          <Dropdown label={"Contact Us"}>
            <div className="py-2 flex flex-col gap-4">
              <div className="flex gap-5 text-lg">
                <div>Email:</div>
                <div className="font-semibold">
                  priyanshubharti2185@gmail.com
                </div>
              </div>
              <div className="flex gap-5 text-lg">
                <div>Number:</div>
                <div className="font-semibold">+917050070859</div>
              </div>
            </div>
          </Dropdown>
          <Dropdown label={"FAQs"}>
            <DropdownFaqs label={"How do I send money to someone?"}>
              <div className="py-4">
                Open the app, select Payment, enter the recipient’s details
                (phone number, email, or account), enter the amount, enter the
                password and confirm the payment.
              </div>
            </DropdownFaqs>
            <DropdownFaqs label={"How do I do a wallet topUp?"}>
              <div className="py-4">
                Open the app, select Wallet, enter the amount, select bank and
                continue to bank website.
              </div>
            </DropdownFaqs>
            <DropdownFaqs label={"What should I do if a payment fails?"}>
              <div className="py-4">
                Check your internet connection and ensure your payment method
                has sufficient funds. Retry the transaction. If it still fails,
                contact Support with the transaction details.
              </div>
            </DropdownFaqs>
            <DropdownFaqs
              label={"Is my account and payment information secure?"}
            >
              <div className="py-4">
                Yes. The app uses encryption, secure servers, and two-factor
                authentication (2FA) to protect your data and transactions.
                Never share your PIN or password.
              </div>
            </DropdownFaqs>
            <DropdownFaqs label={"How do I reset my password(signIn/Up) ?"}>
              <div className="py-4">
                Go to Settings → General → Security → Change
                Password(signIn/Up), or use the Forgot Password option on the
                login screen. Follow the instructions sent to your registered
                email or phone.
              </div>
            </DropdownFaqs>
          </Dropdown>
        </div>
      </div>
      <div className="flex justify-center w-full  py-10">
        <LogOutBtn />
      </div>
    </div>
  );
}
