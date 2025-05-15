export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  // Add any other fields needed for user profiles
};

export type Auction = {
  id?: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice?: number;
  imageUrl?: string;
  startDate: number;
  endDate: number;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  status?: "active" | "completed";
};

export type Bid = {
  id?: string;
  auctionId: string;
  userId: string;
  amount: number;
  timestamp: number;
  userDisplayName?: string;
};
