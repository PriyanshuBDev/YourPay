"use client";

import { RecaptchaVerifier } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithPhoneNumber } from "firebase/auth";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TextInput } from "@repo/ui/TextInput";

interface CheckUserAxiosBind {
  exists: boolean;
}

export default function SignInUpNumber() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [idToken, setIdToken] = useState("");
  const [warning, setWarning] = useState(false);
  const [warning2, setWarning2] = useState(false);
  const [warning3, setWarning3] = useState(false);
  const [warning4, setWarning4] = useState(false);
  const recaptchaRef = useRef<RecaptchaVerifier>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          type: "image",
        }
      );
    }
  }, []);
  const handleSendingOtp = async () => {
    if (!recaptchaRef.current) return console.error("Recaptcha not ready");
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    console.log(formattedPhone);
    const result = await signInWithPhoneNumber(
      auth,
      formattedPhone,
      recaptchaRef.current
    );
    setConfirmation(result);
    setStep(2);
  };

  const handleVerifyingOtp = async () => {
    const result = await confirmation.confirm(otp);
    const token = await result.user.getIdToken();
    setIdToken(token);

    const res = await axios.post<CheckUserAxiosBind>("/api/check-user", {
      idToken: token,
    });

    const data = res.data;
    if (data.exists) {
      const results = await signIn("credentials", {
        idToken: token,
        redirect: false,
      });
      if (!results?.error) {
        router.push("/home");
      }
    } else {
      setStep(3);
    }
  };

  const handleFullSignup = async () => {
    await axios.post("/api/signup", {
      idToken,
      username,
      password,
    });
    const results = await signIn("credentials", {
      idToken,
      redirect: false,
    });
    if (!results?.error) {
      router.push("/home");
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setWarning(value.length !== 10);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setWarning(value.length !== 6);
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setWarning(value.length < 5 || value.length > 15);
    setWarning2(value.includes(" "));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setWarning3(value.length !== 6);
    setWarning4(value !== password2);
  };
  const handlePassword2Change = (value: string) => {
    setPassword2(value);
    setWarning4(value !== password);
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      {step === 1 && (
        <>
          <TextInput
            label="Phone Number"
            onChange={(value) => handlePhoneChange(value)}
            type="number"
            placeholder="xxxxxxxxxx"
          ></TextInput>
          {warning && (
            <Alert
              warning={"Phone Number cannot be less or more than 10"}
            ></Alert>
          )}
          <div className="flex justify-center">
            <button
              className={`mt-5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${phone.length === 10 ? "bg-gray-800 hover:bg-gray-900 text-white" : "bg-gray-300 text-gray-400"}`}
              onClick={() => {
                if (!/^\d{10}$/.test(phone)) {
                  setWarning(true);
                } else {
                  setWarning(false);
                  handleSendingOtp();
                }
              }}
              disabled={phone.length !== 10}
            >
              Send OTP
            </button>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <TextInput
            label="OTP"
            onChange={(value) => handleOtpChange(value)}
            type="number"
            placeholder="xxxxxx"
          ></TextInput>
          {warning && (
            <Alert warning={"OTP cannot be less or more than 6"}></Alert>
          )}
          <div className="flex justify-center">
            <button
              className={`mt-5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${otp.length === 6 ? "bg-gray-800 hover:bg-gray-900 text-white" : "bg-gray-300 text-gray-400"}`}
              onClick={() => {
                if (otp.length === 6) {
                  handleVerifyingOtp();
                  setWarning(false);
                } else {
                  setWarning(true);
                }
              }}
              disabled={otp.length !== 6}
            >
              Verify OTP
            </button>
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <div className="flex justify-center my-3 text-2xl ">
            <h2>Setup Your Profile</h2>
          </div>
          <TextInput
            label="Username"
            onChange={(value) => {
              handleUsernameChange(value);
            }}
            placeholder="John Doe"
            type="text"
          ></TextInput>
          {warning && (
            <Alert
              warning={"Username cannot be less than 5 more than 15"}
            ></Alert>
          )}
          {warning2 && (
            <Alert warning={"Username cannot contain spaces"}></Alert>
          )}
          <TextInput
            label="Password (For Transactions, Topups etc)"
            onChange={(value) => handlePasswordChange(value)}
            placeholder="xxxxxx"
            type="password"
          ></TextInput>
          {warning3 && (
            <Alert
              warning={"Password cannot be less than or more than 6"}
            ></Alert>
          )}
          <TextInput
            label="Confirm Password"
            onChange={(value) => handlePassword2Change(value)}
            placeholder="xxxxxx"
            type="password"
          ></TextInput>
          {warning4 && <Alert warning={"Passwords do not match"}></Alert>}
          <div className="flex justify-center">
            <button
              className={`mt-5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${!warning && !warning2 && !warning3 && !warning4 ? "bg-gray-800 hover:bg-gray-900 text-white" : "bg-gray-300 text-gray-400"}`}
              onClick={handleFullSignup}
              disabled={warning || warning2 || warning3 || warning4}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function Alert({ warning }: { warning: string }) {
  return <div className="text-sm text-red-500 my-1">{warning}</div>;
}
