"use server";

import { UserProfile } from "./database-types";
import { getDatabase } from "../firebase-admin";

const database = await getDatabase();

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
