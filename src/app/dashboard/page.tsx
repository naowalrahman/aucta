"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Container, Typography, Box, Button, Grid, CircularProgress } from "@mui/material";
import { listAuctions, getUserAuctions } from "@/lib/database";
import { Auction } from "@/lib/database-types";
import AuctionCard from "@/components/auction/auction-card";
import CreateAuctionDialog from "@/components/auction/create-auction-dialog";
import AddIcon from "@mui/icons-material/Add";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    async function loadAuctions() {
      setLoading(true);
      try {
        if (activeTab === "all") {
          const allAuctions = await listAuctions();
          setAuctions(allAuctions);
        } else if (activeTab === "my" && user?.uid) {
          const myAuctions = await getUserAuctions(user.uid);
          setAuctions(myAuctions);
        }
      } catch (error) {
        console.error("Error loading auctions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAuctions();
  }, [activeTab, user?.uid]);

  if (!isAuthenticated && activeTab === "my") {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Please login to view your auctions
        </Typography>
      </Container>
    );
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          fullWidth={false}
          sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}
        >
          Create Auction
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Button
          variant={activeTab === "all" ? "contained" : "outlined"}
          onClick={() => setActiveTab("all")}
          sx={{ mr: 2 }}
        >
          All Auctions
        </Button>
        <Button variant={activeTab === "my" ? "contained" : "outlined"} onClick={() => setActiveTab("my")}>
          My Auctions
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      ) : auctions.length > 0 ? (
        <Grid container spacing={3}>
          {auctions.map((auction) => (
            <Grid
              key={auction.id}
              sx={{
                width: {
                  xs: "100%",
                  sm: "50%",
                  md: "33.333%",
                  lg: "25%",
                },
                // padding: 1.5, // Half of spacing={3} on each side
              }}
            >
              <AuctionCard auction={auction} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" my={8}>
          <Typography variant="h6" color="text.secondary">
            {activeTab === "all" ? "No auctions found" : "You haven't created any auctions yet"}
          </Typography>
          {activeTab === "my" && (
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => setOpenCreateDialog(true)}>
              Create Your First Auction
            </Button>
          )}
        </Box>
      )}

      <CreateAuctionDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          setOpenCreateDialog(false);
          // Reload auctions after creation
          if (activeTab === "my" && user?.uid) {
            getUserAuctions(user.uid).then(setAuctions);
          } else {
            listAuctions().then(setAuctions);
          }
        }}
      />
    </Container>
  );
}
