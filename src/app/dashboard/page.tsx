import { Suspense } from "react";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import { getUserHostedAuctions } from "@/lib/database/auction";
import { getUserParticipatedAuctions } from "@/lib/database/bid";
import { Auction } from "@/lib/database/database-types";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { getAuthData } from "@/components/auth-provider-wrapper";
import AuctionsGrid from "@/components/auction/auction-grid";
import { TabPicker } from "@/components/dashboard/tab-switcher";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const tab = (await searchParams).tab === "host" ? "host" : "participate";

  try {
    const { user, isAuthenticated } = await getAuthData();

    if (!isAuthenticated || !user?.uid) {
      return (
        <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Please login to view your dashboard
          </Typography>
        </Container>
      );
    }

    let auctions: Auction[] = [];

    if (tab === "host") {
      auctions = await getUserHostedAuctions(user.uid);
    } else {
      auctions = await getUserParticipatedAuctions(user.uid);
    }

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
            Auctions Dashboard
          </Typography>

          <Suspense>
            <DashboardClient />
          </Suspense>
        </Box>

        <TabPicker tab={tab} />

        <Suspense
          fallback={
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress />
            </Box>
          }
        >
          {auctions.length > 0 ? <AuctionsGrid auctions={auctions} /> : <EmptyState />}
        </Suspense>
      </Container>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" component="h1" color="error" gutterBottom>
          Error loading dashboard
        </Typography>
        <Typography>Please try again later.</Typography>
      </Container>
    );
  }
}

function EmptyState() {
  return (
    <Box sx={{ textAlign: "center", my: 8 }}>
      <Typography variant="h6" color="text.secondary">
        No auctions in this category yet.
      </Typography>
    </Box>
  );
}
