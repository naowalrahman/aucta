import { Auction } from "@/lib/database-types";
import AuctionCardClient from "./auction-card-client";

/* Formats necessary data on server and passes props to client component */

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "success";
    case "completed":
      return "primary";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
}

export default function AuctionCard({ auction }: { auction: Auction }) {
  const now = Date.now();
  const isActive = auction.status === "active" && auction.endDate > now;
  const placeholderImage = "https://placehold.co/400x400?text=No+Image";

  const formattedData = {
    currentPrice: formatCurrency(auction.currentPrice || auction.startingPrice),
    startDate: formatDate(auction.startDate),
    endDate: formatDate(auction.endDate),
    statusColor: getStatusColor(auction.status) as "success" | "primary" | "error" | "default",
    isActive,
  };

  return <AuctionCardClient auction={auction} formattedData={formattedData} placeholderImage={placeholderImage} />;
}
