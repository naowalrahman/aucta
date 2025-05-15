"use client";

import { useState } from "react";
import { Button, Box, CircularProgress, Grid } from "@mui/material";
import { Auction } from "@/lib/database/database-types";
import AuctionCard from "@/components/auction/auction-card";
import { loadMoreAuctions } from "@/lib/database/auction"; // Import the server action directly

export default function AuctionsClient({ initialAuctions }: { initialAuctions: Auction[] }) {
  const [auctions, setAuctions] = useState<Auction[]>(initialAuctions);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedMore, setLoadedMore] = useState(false);

  const handleLoadMore = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const lastAuction = auctions[auctions.length - 1];
      const timestamp = lastAuction?.createdAt;

      // Call the server action directly instead of using fetch to an API route
      const result = await loadMoreAuctions(timestamp);

      if (result.auctions?.length > 0) {
        setAuctions((prev) => [...prev, ...result.auctions]);
        setLoadedMore(true);
      }

      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error loading more auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Only render additional auctions that were loaded client-side
  const additionalAuctions = loadedMore ? auctions.slice(initialAuctions.length) : [];

  return (
    <>
      {additionalAuctions.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {additionalAuctions.map((auction) => (
            <Grid
              key={auction.id}
              sx={{
                width: {
                  xs: "100%",
                  sm: "50%",
                  md: "33.333%",
                  lg: "25%",
                },
              }}
            >
              <AuctionCard auction={auction} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 8 }}>
        {hasMore && (
          <Button variant="outlined" onClick={handleLoadMore} disabled={loading} sx={{ minWidth: "200px" }}>
            {loading ? <CircularProgress size={24} /> : "Load More"}
          </Button>
        )}
      </Box>
    </>
  );
}
