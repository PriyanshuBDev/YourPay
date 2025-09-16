"use server";

import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

interface props {
  status: string;
  amount: number;
  token: string;
}

export async function webhookTeller({ status, amount, token }: props) {
  const session = await getServerSession(authOptions);
  const user_identifier = session?.user.uid;
  if (!user_identifier) {
    return {
      msg: "You are not authenticated",
      status: 401,
    };
  }
  const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL;
  try {
    await axios.post(`${webhookUrl}/bankWebhook`, {
      token,
      status,
      user_identifier,
      amount: amount * 100,
    });
  } catch (e) {
    console.error("Error encountered:", e instanceof Error ? e.message : e);
    return {
      msg: "Error encountered",
      status: 500,
    };
  }
}
