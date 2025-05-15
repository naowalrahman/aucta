import { Auction } from "@/lib/database/database-types";
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

export default function AuctionCard({ auction }: { auction: Auction }) {
  const now = Date.now();
  const isActive = auction.endDate > now;
  const placeholderImage = "https://placehold.co/400x400?text=No+Image";

  const formattedData = {
    currentPrice: formatCurrency(auction.currentPrice || auction.startingPrice),
    startDate: formatDate(auction.startDate),
    endDate: formatDate(auction.endDate),
    statusColor: isActive ? "success" : ("primary" as "success" | "primary"),
    isActive,
  };

  return <AuctionCardClient auction={auction} formattedData={formattedData} placeholderImage={placeholderImage} />;
}
