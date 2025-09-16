"use client";

import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import LoadingDots from "./LoadingDots";
import { CustomAlert } from "./CustomAlert";
import { auth } from "../lib/firebase";

const firebasePasswordResetErrors: Record<string, string> = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "No account found with this email.",
  "auth/missing-email": "Please provide your email address.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
};

export default function ChangePassword({ onClick }: { onClick: () => void }) {
  const [warningMsg, setWarningMsg] = useState("");
  const [msg, setMsg] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const email = session?.user.email;
  if (!email) {
    setWarningMsg("You are not authenticated");
    return;
  }
  const sendResetEmail = async () => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMsg(true);
    } catch (e) {
      console.error("Error sending email:", e instanceof Error ? e.message : e);
      if (e instanceof FirebaseError) {
        setWarningMsg(firebasePasswordResetErrors[e.code] || e.message);
      } else if (e instanceof Error) {
        setWarningMsg(e.message);
      } else {
        setWarningMsg("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className=" fixed inset-0 bg-black/20 flex items-center justify-center z-40"
      onClick={onClick}
    >
      =
      <div
        className=" bg-white shadow-md rounded-lg z-50 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {msg ? (
          <div className="max-w-xl p-10">
            <div className="font-semibold text-xl">
              A reset password link has been sent to your email at{" "}
              <strong>{email}</strong>. Please check your inbox.
            </div>
            <div>
              *If you couldn&apos;t find the link then check your spam folder*
            </div>
          </div>
        ) : (
          <div>
            <div className="font-semibold text-xl">
              Are you sure, you want to change password?
            </div>
            <div className="flex justify-center gap-2 mt-5">
              <button
                className="border-gray-300 border-3 hover:bg-gray-300 rounded-lg px-3 py-1 cursor-pointer bg-white"
                onClick={onClick}
              >
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white hover:bg-purple-700 rounded-lg px-3 py-1 cursor-pointer"
                onClick={async () => {
                  await sendResetEmail();
                }}
              >
                {loading ? (
                  <LoadingDots size="2" bg="bg-white" />
                ) : (
                  <div>Continue</div>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      {warningMsg && (
        <CustomAlert
          type={"error"}
          msg={warningMsg}
          onClose={() => setWarningMsg("")}
        />
      )}
    </div>
  );
}
