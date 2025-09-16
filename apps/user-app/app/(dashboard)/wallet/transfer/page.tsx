"use client";

import { Btn3 } from "../../../../components/Btn3";
import { useRouter, useSearchParams } from "next/navigation";
import { webhookTeller } from "../../../../lib/actions/webhookTeller";
import { useEffect, useState } from "react";
import Loading from "../../../../components/Loading";
import { CustomAlert } from "../../../../components/CustomAlert";

export default function Transfer() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const rawAmount = searchParams.get("amount");
  const [loading, setLoading] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");

  useEffect(() => {
    if (!token || !rawAmount) {
      alert("Error encountered");
      return router.push("/home");
    }
  }, [router, rawAmount, token]);
  if (!token || !rawAmount) {
    return null;
  }
  const amount = Number(rawAmount);
  return (
    <div className="w-full h-full p-10">
      <div className=" text-xl sm:text-lg lg:text-2xl px-15 sm:px-10 lg:px-20 text-purple-500 font-semibold text-center">
        Proceed button before would have redirected you to an actual Bank API
        for the transaction and our webhook would have confirm and complete the
        transaction.
      </div>
      <div className=" text-2xl sm:text-xl lg:text-3xl text-purple-500 font-semibold text-center mt-5">
        *Since we don&apos;t have an actual Bank API therefore below are buttons
        to tell the webhook about the transaction.*
      </div>
      <div className="mt-10 flex gap-10 w-full justify-center">
        <Btn3
          onClick={() => {
            router.push("/wallet");
          }}
          label="Procced"
          bg={"bg-gray-200"}
          text={"text-gray-500"}
          hoverBg="hover:bg-gray-300"
          hoverText="hover:text-gray-600"
          focus="focus:ring-gray-100"
        ></Btn3>
        <Btn3
          onClick={async () => {
            setLoading(true);
            try {
              await webhookTeller({
                token,
                amount,
                status: "SUCCESS",
              });
              router.push("/wallet");
            } catch (e) {
              console.error(
                "Error encountered:",
                e instanceof Error ? e.message : e
              );
              return setWarningMsg("Error encountered");
            } finally {
              setLoading(false);
            }
          }}
          label="Success"
          bg={"bg-green-200"}
          text={"text-green-500"}
          hoverBg="hover:bg-green-300"
          hoverText="hover:text-green-600"
          focus="focus:ring-green-100"
        ></Btn3>
        <Btn3
          onClick={async () => {
            setLoading(true);
            try {
              await webhookTeller({
                token,
                amount,
                status: "FAILED",
              });
              router.push("/wallet");
            } catch (e) {
              console.error(
                "Error encountered:",
                e instanceof Error ? e.message : e
              );
              return setWarningMsg("Error encountered");
            } finally {
              setLoading(false);
            }
          }}
          label="Falied"
          bg={"bg-red-200"}
          text={"text-red-500"}
          hoverBg="hover:bg-red-300"
          hoverText="hover:text-red-600"
          focus="focus:ring-red-100"
        ></Btn3>
      </div>
      {loading && <Loading />}
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
