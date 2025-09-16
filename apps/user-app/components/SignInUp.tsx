"use client";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TextInput } from "@repo/ui/TextInput";
import { CustomAlert } from "./CustomAlert";
import LoadingDots from "./LoadingDots";
import { FirebaseError } from "firebase/app";
import SignInUpImage from "./SignInUpImage";
import YourPayIcon from "./Icon";
import PasswordInput from "./PasswordInput";
import { checkEmailExists } from "../lib/actions/checkEmailExists";

const firebaseErrors: Record<string, string> = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/wrong-password": "Incorrect password.",
  "auth/user-not-found": "No account found with this email.",
  "auth/email-already-in-use": "This email is already registered.",
};

export default function SignInUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [password3, setPassword3] = useState("");
  const [password4, setPassword4] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [warning, setWarning] = useState(false);
  const [warning2, setWarning2] = useState(false);
  const [warning3, setWarning3] = useState(false);
  const [warning4, setWarning4] = useState(false);
  const [warning5, setWarning5] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();
  const [src, setSrc] = useState("/assets/home.png");

  const handleStep2 = async () => {
    setStep(2);
    if (mode === "login") {
      setSrc("/assets/wallet.png");
    } else {
      setSrc("/assets/trnx.png");
    }
  };

  const handleCheckEmail = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      console.log("Email being checked:", `"${email}"`);
      const exist = await checkEmailExists(cleanEmail);
      if (exist) {
        setMode("login");
      } else {
        setMode("signup");
      }
      handleStep2();
    } catch (e) {
      if (e instanceof FirebaseError) {
        setWarningMsg(firebaseErrors[e.code] || e.message);
      } else if (e instanceof Error) {
        setWarningMsg(e.message);
      } else {
        setWarningMsg("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      if (!user.emailVerified) {
        setWarningMsg("Please verify your email before logging in.");
        return;
      }
      const token = await user.getIdToken();
      const results = await signIn("credentials", {
        idToken: token,
        redirect: false,
      });
      if (!results?.error) router.push("/home");
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (e.code === "auth/user-not-found") {
          handleStep2();
        } else {
          setWarningMsg(firebaseErrors[e.code] || e.message);
        }
      } else if (e instanceof Error) {
        setWarningMsg(e.message);
      } else {
        setWarningMsg("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (loading) return;
    setLoading(true);
    try {
      interface AxiosProps {
        msg: string;
        available: boolean;
      }
      if (username.length >= 5 && username.length <= 15) {
        try {
          const res = await axios.post<AxiosProps>("/api/checkUsername", {
            username,
          });
          if (!res.data.available) {
            setWarningMsg("Username already taken");
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error(
            "Error encountered while checking username:",
            e instanceof Error ? e.message : e
          );
          setWarningMsg("Username already taken");
          setLoading(false);
          return;
        }
      }
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(user);
      const idToken = await user.getIdToken();
      console.log(idToken, username, password3);
      await axios.post("/api/signup", {
        idToken,
        username,
        password: password3,
      });
      setStep(3);
      setSrc("/assets/payment.png");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setWarningMsg(firebaseErrors[e.code] || e.message);
      } else if (e instanceof Error) {
        setWarningMsg(e.message);
      } else {
        setWarningMsg("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(async () => {
        if (auth.currentUser) {
          await reload(auth.currentUser);
          if (auth.currentUser.emailVerified) {
            const token = await auth.currentUser.getIdToken();
            const results = await signIn("credentials", {
              idToken: token,
              redirect: false,
            });
            if (!results?.error) {
              router.push("/home");
            }
          } else {
            setWarningMsg("Still not verified. Please check your inbox.");
          }
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [step, router]);
  useEffect(() => {
    setWarningMsg("");
  }, [step]);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setWarning(value.length < 5 || value.length > 15);
    setWarning2(value.includes(" "));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setWarning4(value !== password2);
  };
  const handlePassword2Change = (value: string) => {
    setPassword2(value);
    setWarning4(value !== password);
  };
  const handlePassword3Change = (value: string) => {
    setPassword3(value);
    setWarning3(value.length !== 6);
    setWarning5(value !== password4);
  };
  const handlePassword4Change = (value: string) => {
    setPassword4(value);
    setWarning5(value !== password3);
  };

  return (
    <div className="grid grid-cols-3 justify-between items-center h-screen gap-10 drop-shadow-2xl">
      <div className="col-span-1">
        <div className=" w-full rounded-md p-8">
          <div className="text-white font-semibold text-5xl w-full flex justify-center mb-5 gap-4">
            <div>
              <YourPayIcon size={60} />
            </div>{" "}
            YourPay
          </div>

          <div>
            {step === 1 && (
              <>
                <TextInput
                  label="Email"
                  onChange={setEmail}
                  type="email"
                  placeholder="you@example.com"
                ></TextInput>
                <div className="flex justify-center">
                  <button
                    className={`flex justify-center items-center mt-5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-200 font-medium rounded-lg text-lg w-30 h-10 me-2 mb-2 ${email ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-gray-300 text-gray-400"}`}
                    onClick={handleCheckEmail}
                    disabled={!email}
                  >
                    {loading ? (
                      <LoadingDots bg="bg-white" size="2" />
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              </>
            )}
            {step === 2 && mode === "login" && (
              <>
                <PasswordInput
                  label="Password"
                  onChange={setPassword}
                  placeholder="xxxxxx"
                ></PasswordInput>
                <div className="flex justify-center">
                  <button
                    className={` flex justify-center items-center mt-5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-200 font-medium rounded-lg text-lg w-30 h-10 me-2 mb-2 ${email && password ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-gray-300 text-gray-400"}`}
                    onClick={handleLogin}
                    disabled={!email || !password}
                  >
                    {loading ? <LoadingDots bg="bg-white" size="2" /> : "Login"}
                  </button>
                </div>
              </>
            )}
            {step === 2 && mode === "signup" && (
              <>
                <div className="flex justify-center my-3 text-2xl text-purple-500 font-semibold">
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
                <PasswordInput
                  label="Password (For signIn/Up)"
                  onChange={(value) => handlePasswordChange(value)}
                  placeholder="xxxxxx"
                ></PasswordInput>
                <PasswordInput
                  label="Confirm Password"
                  onChange={(value) => handlePassword2Change(value)}
                  placeholder="xxxxxx"
                ></PasswordInput>
                {warning4 && <Alert warning={"Passwords do not match"}></Alert>}
                <PasswordInput
                  label="YourPay Password (For Transactions, etc)"
                  onChange={(value) => handlePassword3Change(value)}
                  placeholder="xxxxxx"
                ></PasswordInput>
                {warning3 && (
                  <Alert
                    warning={"Password cannot be less than or more than 6"}
                  ></Alert>
                )}
                <PasswordInput
                  label="Confirm YourPay Password"
                  onChange={(value) => handlePassword4Change(value)}
                  placeholder="xxxxxx"
                ></PasswordInput>
                {warning5 && (
                  <Alert warning={"YourPay Passwords do not match"}></Alert>
                )}
                <div className=" text-red-500 my-1">
                  *YourPay Password cannot be changed
                </div>
                <div className="flex justify-center">
                  <button
                    className={` flex justify-center items-center mt-5 cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-200 font-medium rounded-lg text-lg w-30 h-10 me-2 mb-2 ${!warning && !warning2 && !warning3 && !warning4 ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-gray-300 text-gray-400"}`}
                    onClick={handleSignup}
                    disabled={warning || warning2 || warning3 || warning4}
                  >
                    {loading ? (
                      <LoadingDots bg="bg-white" size="2" />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </>
            )}
            {step === 3 && (
              <div className="text-center my-5">
                <h2 className="text-lg font-semibold">Check your inbox</h2>
                <p>
                  We sent a verification link to <strong>{email}</strong>.
                  Please verify before loggin in.
                </p>
                <div>
                  *If you couldn&apos;t find the link then check your spam
                  folder*
                </div>
              </div>
            )}
            {warningMsg && (
              <CustomAlert
                type={"error"}
                msg={warningMsg}
                onClose={() => setWarningMsg("")}
              />
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <SignInUpImage src={src} />
      </div>
    </div>
  );
}

export function Alert({ warning }: { warning: string }) {
  return <div className="text-sm text-red-500 my-1">{warning}</div>;
}
