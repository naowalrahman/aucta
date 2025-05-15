"use server";

import { Bid, Auction } from "./database-types";
import { getDatabase } from "../firebase-admin";

const database = await getDatabase();

export async function createBid(bidData: Omit<Bid, "id" | "timestamp">) {
  try {
    const timestamp = Date.now();
    const newBidRef = database.collection("bids").doc();
    await newBidRef.set({
      id: newBidRef.id,
      ...bidData,
      timestamp,
    });
    await database.collection("userBids").doc(bidData.userId).collection("bids").doc(newBidRef.id).set({
      id: newBidRef.id,
      auctionId: bidData.auctionId,
      amount: bidData.amount,
      timestamp,
    });
    return { id: newBidRef.id };
  } catch (error) {
    console.error("Error creating bid:", error);
    throw new Error("Failed to create bid");
  }
}

export async function getAuctionBids(auctionId: string) {
  try {
    const snapshot = await database
      .collection("bids")
      .where("auctionId", "==", auctionId)
      .orderBy("timestamp", "desc")
      .get();
    return snapshot.docs.map((doc) => doc.data() as Bid);
  } catch (error) {
    console.error("Error getting auction bids:", error);
    throw new Error("Failed to get auction bids");
  }
}

export async function getUserBids(userId: string) {
  try {
    const userBidsRef = database.collection("userBids").doc(userId).collection("bids");
    const snapshot = await userBidsRef.orderBy("timestamp", "desc").get();
    const bidIds = snapshot.docs.map((doc) => doc.id);
    if (bidIds.length === 0) {
      return [];
    }
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < bidIds.length; i += batchSize) {
      const batch = bidIds.slice(i, i + batchSize);
      batches.push(batch);
    }
    const results = await Promise.all(
      batches.map((batch) =>
        database
          .collection("bids")
          .where("id", "in", batch)
          .get()
          .then((snap) => snap.docs.map((doc) => doc.data() as Bid))
      )
    );
    return results.flat();
  } catch (error) {
    console.error("Error getting user bids:", error);
    throw new Error("Failed to get user bids");
  }
}

export async function getUserParticipatedAuctions(userId: string) {
  try {
    const userBids = await getUserBids(userId);
    if (!userBids.length) {
      return [];
    }
    const auctionIds = Array.from(new Set(userBids.map((bid) => bid.auctionId)));
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < auctionIds.length; i += batchSize) {
      const batch = auctionIds.slice(i, i + batchSize);
      batches.push(batch);
    }
    const results = await Promise.all(
      batches.map((batch) =>
        database
          .collection("auctions")
          .where("id", "in", batch)
          .get()
          .then((snap) => snap.docs.map((doc) => doc.data() as Auction))
      )
    );
    const auctions = results.flat();
    return auctions;
  } catch (error) {
    console.error("Error getting user participated auctions:", error);
    throw new Error("Failed to get user participated auctions");
  }
}
