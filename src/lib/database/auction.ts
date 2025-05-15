"use server";

import { Auction } from "./database-types";
import { getDatabase } from "../firebase-admin";

const database = await getDatabase();

export async function createAuction(auctionData: Omit<Auction, "id" | "createdAt" | "updatedAt">) {
  try {
    const timestamp = Date.now();
    const newAuctionRef = database.collection("auctions").doc();
    const initialStatus = "active";
    await newAuctionRef.set({
      id: newAuctionRef.id,
      ...auctionData,
      currentPrice: auctionData.startingPrice,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: initialStatus,
    });
    await database
      .collection("userAuctions")
      .doc(auctionData.createdBy)
      .collection("auctions")
      .doc(newAuctionRef.id)
      .set({
        id: newAuctionRef.id,
        createdAt: timestamp,
      });
    return { id: newAuctionRef.id };
  } catch (error) {
    console.error("Error creating auction:", error);
    throw new Error("Failed to create auction");
  }
}

export async function getAuction(auctionId: string) {
  try {
    const auctionDoc = await database.collection("auctions").doc(auctionId).get();
    if (!auctionDoc.exists) {
      return null;
    }
    const auction = auctionDoc.data() as Auction;
    return auction;
  } catch (error) {
    console.error("Error getting auction:", error);
    throw new Error("Failed to get auction");
  }
}

export async function updateAuction(auctionId: string, userId: string, auctionData: Partial<Auction>) {
  try {
    const auctionRef = database.collection("auctions").doc(auctionId);
    const auctionDoc = await auctionRef.get();
    if (!auctionDoc.exists) {
      throw new Error("Auction not found");
    }
    const auction = auctionDoc.data() as Auction;
    if (auction.createdBy !== userId) {
      throw new Error("Not authorized to update this auction");
    }
    const timestamp = Date.now();
    await auctionRef.update({
      ...auctionData,
      updatedAt: timestamp,
    });
    return true;
  } catch (error) {
    console.error("Error updating auction:", error);
    throw new Error("Failed to update auction");
  }
}

export async function deleteAuction(auctionId: string, userId: string) {
  try {
    const auctionRef = database.collection("auctions").doc(auctionId);
    const auctionDoc = await auctionRef.get();
    if (!auctionDoc.exists) {
      throw new Error("Auction not found");
    }
    const auction = auctionDoc.data() as Auction;
    if (auction.createdBy !== userId) {
      throw new Error("Not authorized to delete this auction");
    }
    await auctionRef.delete();
    await database.collection("userAuctions").doc(userId).collection("auctions").doc(auctionId).delete();
    return true;
  } catch (error) {
    console.error("Error deleting auction:", error);
    throw new Error("Failed to delete auction");
  }
}

export async function getUserHostedAuctions(userId: string) {
  try {
    const snapshot = await database
      .collection("userAuctions")
      .doc(userId)
      .collection("auctions")
      .orderBy("createdAt", "desc")
      .get();
    const auctionIds = snapshot.docs.map((doc) => doc.id);
    if (auctionIds.length === 0) {
      return [];
    }
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
    return results.flat();
  } catch (error) {
    console.error("Error getting user hosted auctions:", error);
    throw new Error("Failed to get user hosted auctions");
  }
}

export async function getPaginatedAuctions(
  limit = 20,
  startAfter?: { endDate: number } | FirebaseFirestore.DocumentSnapshot
) {
  try {
    let query = database.collection("auctions").orderBy("endDate", "asc").limit(limit);
    if (startAfter) {
      query = query.startAfter(startAfter);
    }
    const snapshot = await query.get();
    const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    const auctions = snapshot.docs.map((doc) => doc.data() as Auction);
    return {
      auctions,
      lastVisible,
      hasMore: snapshot.docs.length === limit,
    };
  } catch (error) {
    console.error("Error getting paginated auctions:", error);
    throw new Error("Failed to get paginated auctions");
  }
}

export async function loadMoreAuctions(timestamp: number) {
  try {
    const startAfter = { endDate: timestamp };
    const result = await getPaginatedAuctions(20, startAfter);
    return {
      auctions: result.auctions,
      hasMore: result.hasMore,
    };
  } catch (error) {
    console.error("Server action error getting more auctions:", error);
    throw new Error("Failed to load more auctions");
  }
}
