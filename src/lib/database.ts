"use server";
import { getDatabase } from "./firebase-admin";
import { UserProfile, Auction, Bid } from "./database-types";

const database = await getDatabase();

// User-related server actions

export async function getUserProfile(userId: string) {
  try {
    const userDoc = await database.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return null;
    }
    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw new Error("Failed to get user profile");
  }
}

export async function createOrUpdateUserProfile(userId: string, userData: Partial<UserProfile>) {
  try {
    const timestamp = Date.now();
    const userRef = database.collection("users").doc(userId);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // Create new user
      await userRef.set({
        uid: userId,
        ...userData,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    } else {
      // Update existing user
      await userRef.update({
        ...userData,
        updatedAt: timestamp,
      });
    }
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
}

// Auction-related server actions

export async function createAuction(auctionData: Omit<Auction, "id" | "createdAt" | "updatedAt">) {
  try {
    const timestamp = Date.now();
    const newAuctionRef = database.collection("auctions").doc();

    await newAuctionRef.set({
      id: newAuctionRef.id,
      ...auctionData,
      currentPrice: auctionData.startingPrice,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    // Also add to user-specific collection
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
    return auctionDoc.data() as Auction;
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

    // Check if the user is the creator of the auction
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

    // Check if the user is the creator of the auction
    if (auction.createdBy !== userId) {
      throw new Error("Not authorized to delete this auction");
    }

    // Delete the auction
    await auctionRef.delete();

    // Also remove from user-specific collection
    await database.collection("userAuctions").doc(userId).collection("auctions").doc(auctionId).delete();

    return true;
  } catch (error) {
    console.error("Error deleting auction:", error);
    throw new Error("Failed to delete auction");
  }
}

export async function listAuctions(limit = 20, startAfter?: any) {
  try {
    let query = database.collection("auctions").orderBy("createdAt", "desc").limit(limit);

    if (startAfter) {
      query = query.startAfter(startAfter);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => doc.data() as Auction);
  } catch (error) {
    console.error("Error listing auctions:", error);
    throw new Error("Failed to list auctions");
  }
}

export async function getUserAuctions(userId: string) {
  try {
    const userAuctionsRef = database.collection("userAuctions").doc(userId).collection("auctions");

    const snapshot = await userAuctionsRef.orderBy("createdAt", "desc").get();

    // Get the full auction data for each auction ID
    const auctionIds = snapshot.docs.map((doc) => doc.id);

    if (auctionIds.length === 0) {
      return [];
    }

    // Get all auctions in batches (Firestore has a limit of 10 for "in" queries)
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
    console.error("Error getting user auctions:", error);
    throw new Error("Failed to get user auctions");
  }
}

// Bid-related server actions

export async function createBid(bidData: Omit<Bid, "id" | "timestamp">) {
  try {
    // First, get the auction to check if the bid amount is valid
    const auctionRef = database.collection("auctions").doc(bidData.auctionId);
    const auctionDoc = await auctionRef.get();

    if (!auctionDoc.exists) {
      throw new Error("Auction not found");
    }

    const auction = auctionDoc.data() as Auction;

    // Check if auction is active
    if (auction.status !== "active") {
      throw new Error("Auction is not active");
    }

    // Check if auction hasn't ended
    if (auction.endDate < Date.now()) {
      throw new Error("Auction has ended");
    }

    // Check if the bid amount is higher than the current price
    if (bidData.amount <= (auction.currentPrice || auction.startingPrice)) {
      throw new Error("Bid amount must be higher than current price");
    }

    const timestamp = Date.now();
    const newBidRef = database.collection("bids").doc();

    // Create the bid
    await newBidRef.set({
      id: newBidRef.id,
      ...bidData,
      timestamp,
    });

    // Update the auction's current price
    await auctionRef.update({
      currentPrice: bidData.amount,
      updatedAt: timestamp,
    });

    // Also add to user-specific collection
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

    // Get the full bid data
    const bidIds = snapshot.docs.map((doc) => doc.id);

    if (bidIds.length === 0) {
      return [];
    }

    // Get all bids in batches (Firestore has a limit of 10 for "in" queries)
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
