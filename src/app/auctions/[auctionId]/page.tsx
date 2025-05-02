import { notFound } from "next/navigation";
import { getAuction, getAuctionBids, getUserProfile } from "@/lib/database";
import AuctionDetails from "./auction-details";
import { Suspense } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";

export default async function AuctionPage({ params }: { params: Promise<{ auctionId: string }> }) {
  const { auctionId } = await params;

  try {
    const auction = await getAuction(auctionId);

    if (!auction) {
      return notFound();
    }

    const auctionOwner = await getUserProfile(auction.createdBy);
    if (!auctionOwner) {
      return notFound();
    }

    const bids = await getAuctionBids(auctionId);

    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Suspense
          fallback={
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress />
            </Box>
          }
        >
          <AuctionDetails auction={auction} initialBids={bids} auctionOwner={auctionOwner} />
        </Suspense>
      </Container>
    );
  } catch (error) {
    console.error("Error fetching auction:", error);
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" component="h1" color="error" gutterBottom>
          Error loading auction
        </Typography>
        <Typography>There was a problem retrieving the auction details.</Typography>
      </Container>
    );
  }
}
