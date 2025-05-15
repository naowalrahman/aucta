import { Suspense } from "react";
import { Container, Typography, Box, Button, CircularProgress } from "@mui/material";
import { getPaginatedAuctions } from "@/lib/database/auction";
import Link from "next/link";
import AuctionsClient from "@/components/auction/auctions-client";
import AuctionsGrid from "@/components/auction/auction-grid";

export default async function AuctionsPage() {
  try {
    // Initial fetch of first 20 auctions
    const { auctions, hasMore } = await getPaginatedAuctions(20);

    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 0 },
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: { xs: 2, sm: 0 } }}>
            Active Auctions
          </Typography>

          <Link href="/dashboard" passHref style={{ textDecoration: "none" }}>
            <Button variant="outlined" color="primary">
              Go to Dashboard
            </Button>
          </Link>
        </Box>

        <Suspense
          fallback={
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress />
            </Box>
          }
        >
          {auctions.length > 0 ? (
            <>
              <AuctionsGrid auctions={auctions} />
              {hasMore && <AuctionsClient initialAuctions={auctions} />}
            </>
          ) : (
            <Box sx={{ textAlign: "center", my: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No active auctions found
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} component={Link} href="/dashboard?tab=host">
                Create an Auction
              </Button>
            </Box>
          )}
        </Suspense>
      </Container>
    );
  } catch (error) {
    console.error("Auctions page error:", error);
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" component="h1" color="error" gutterBottom>
          Error loading auctions
        </Typography>
        <Typography>Please try again later.</Typography>
      </Container>
    );
  }
}
