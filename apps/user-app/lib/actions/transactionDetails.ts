import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function getTransactionDetails(TrnxId: string) {
  const session = await getServerSession(authOptions);
  const id = session?.user.uid;
  if (!id) {
    return { msg: "You are not authenticated", status: 401, trnxDetails: {} };
  }
  try {
    let trnxDetails;
    const onRamp = await prisma.onRampTransaction.findUnique({
      where: {
        id: TrnxId,
        UserId: id,
      },
      select: {
        id: true,
        createdAt: true,
        provider: true,
        status: true,
        amount: true,
      },
    });
    const p2p = await prisma.p2PTransaction.findFirst({
      where: {
        OR: [{ senderId: id }, { receiverId: id }],
        id: TrnxId,
      },
      select: {
        id: true,
        createdAt: true,
        sender: {
          select: {
            username: true,
            profileImg: true,
            publicId: true,
            email: true,
          },
        },
        receiver: {
          select: {
            username: true,
            profileImg: true,
            publicId: true,
            email: true,
          },
        },
        receiverId: true,
        senderId: true,
        amount: true,
        status: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (onRamp) {
      trnxDetails = {
        id: onRamp.id,
        status: onRamp.status,
        credit: onRamp.amount,
        debit: 0,
        date: onRamp.createdAt.toISOString(),
        category: "None",
        recipient: {
          name: onRamp.provider,
          profileImg: "",
          publicId: "",
          email: "",
          isQUser: null,
        },
      };
    }
    if (p2p) {
      let mainUserId;
      let quickUserId;
      if (p2p.senderId === id) {
        mainUserId = p2p.senderId;
        quickUserId = p2p.receiverId;
      } else {
        mainUserId = p2p.receiverId;
        quickUserId = p2p.senderId;
      }
      const isQUser = await prisma.quickUser.findUnique({
        where: {
          userId_qUserId: {
            userId: mainUserId,
            qUserId: quickUserId,
          },
        },
        select: {
          qUserId: true,
        },
      });
      const isSender = p2p.senderId === id;
      const counterparty = isSender ? p2p.receiver : p2p.sender;
      trnxDetails = {
        id: p2p.id,
        status: p2p.status,
        date: p2p.createdAt.toISOString(),
        recipient: {
          name: counterparty.username,
          profileImg: counterparty.profileImg,
          publicId: counterparty.publicId,
          email: counterparty.email,
          id: isSender ? p2p.receiverId : p2p.senderId,
          isQUser: !!isQUser?.qUserId,
        },
        credit: !isSender ? p2p.amount : 0,
        debit: isSender ? p2p.amount : 0,
        category: p2p.category?.name || "None",
      };
    }
    if (!onRamp && !p2p) {
      return { msg: "Transaction not found", status: 404, trnxDetails: {} };
    }

    return {
      msg: "Successfully fetched transaction details",
      trnxDetails,
      status: 200,
    };
  } catch (e) {
    console.error(
      "Error encountered while fetching transaction details:",
      e instanceof Error ? e.message : e
    );
    return { msg: "Error encountered", status: 500, trnxDetails: {} };
  }
}
