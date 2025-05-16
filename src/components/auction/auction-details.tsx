"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Auction, Bid, UserProfile } from "@/lib/database/database-types";
import { getUserProfile } from "@/lib/database/user";
import { createBid } from "@/lib/database/bid";
import { deleteAuction } from "@/lib/database/auction";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { onSnapshot, doc, collection, query, where, orderBy } from "firebase/firestore";
import { clientDatabase as db } from "@/lib/firebase";

/* This util function is repeated from auction-card.tsx, but its
so small that its not worth creating a separate file for it. */

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeRemaining(endDate: number) {
  const total = endDate - Date.now();

  if (total <= 0) {
    return "Auction ended";
  }

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
}

export default function AuctionDetails({
  auction: initialAuction,
  initialBids,
  auctionOwner,
}: {
  auction: Auction;
  initialBids: Bid[];
  auctionOwner: UserProfile;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [userDisplayName, setUserDisplayName] = useState<string | undefined>(undefined);
  const [auction, setAuction] = useState<Auction>(initialAuction);
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(initialAuction.endDate));
  const [isActive, setIsActive] = useState(initialAuction.endDate > Date.now());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      getUserProfile(user.uid).then((profile) => {
        setUserDisplayName(profile?.displayName);
      });
    }
  }, [user]);

  // Real-time updates for the auction data
  useEffect(() => {
    const auctionRef = doc(db, "auctions", auction.id as string);

    const unsubscribe = onSnapshot(
      auctionRef,
      (doc) => {
        if (doc.exists()) {
          const updatedAuction = doc.data() as Auction;
          setAuction(updatedAuction);
        }
      },
      (error) => {
        console.error("Error listening to auction updates:", error);
      }
    );

    return () => unsubscribe();
  }, [auction.id]);

  // Real-time updates for bid history
  useEffect(() => {
    // Create a query against the bids collection
    const bidsQuery = query(collection(db, "bids"), where("auctionId", "==", auction.id), orderBy("timestamp", "desc"));

    // Listen for updates to the bids collection
    const unsubscribe = onSnapshot(
      bidsQuery,
      (snapshot) => {
        const updatedBids: Bid[] = snapshot.docs.map((doc) => doc.data() as Bid);
        setBids(updatedBids);
      },
      (error) => {
        console.error("Error listening to bid updates:", error);
      }
    );

    return () => unsubscribe();
  }, [auction.id]);

  // Real-time updates for time remaining
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(auction.endDate);
      setTimeRemaining(remaining);

      // Check if the auction has ended during this interval
      if (auction.endDate <= Date.now()) {
        setIsActive(false);
        clearInterval(interval);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [auction.endDate, isActive]);

  const handleDeleteAuction = async () => {
    if (!user?.uid) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await deleteAuction(auction.id as string, user.uid);
      router.prefetch("/auctions");
      router.push("/auctions");
    } catch (error) {
      console.error("Error deleting auction:", error);
      setDeleteError("Failed to delete auction. Please try again.");
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      setError("You must be logged in to place a bid");
      return;
    }

    if (user.uid === auctionOwner.uid) {
      setError("You cannot bid on your own auction");
      return;
    }

    if (!isActive) {
      setError("This auction has ended");
      return;
    }

    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid bid amount");
      return;
    }

    const minBid = (auction.currentPrice || auction.startingPrice) + 1;

    if (amount < minBid) {
      setError(`Your bid must be at least ${formatCurrency(minBid)}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bid: Bid = {
        auctionId: auction.id as string,
        userId: user.uid,
        amount,
        userDisplayName: userDisplayName,
        timestamp: Date.now(),
      };
      await createBid(bid);

      setSuccess(true);
      setBidAmount("");

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error placing bid:", error);
      setError(error instanceof Error ? error.message : "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  const minBidAmount = (auction.currentPrice || auction.startingPrice) + 1;
  const placeholderImage = "https://placehold.co/400x400?text=No+Image";

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
          Back to Auctions
        </Button>

        {user?.uid === auction.createdBy && (
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteDialogOpen(true)}>
            Delete Auction
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Left column: Image and details */}
        <Grid size={{ xs: 12, md: 7, lg: 8 }}>
          <Card elevation={2}>
            <CardMedia
              component="img"
              sx={{
                height: { xs: 250, sm: 350, md: 400 },
                objectFit: "contain",
                bgcolor: "rgba(0,0,0,0.03)",
              }}
              image={auction.imageUrl || placeholderImage}
              alt={auction.title}
            />
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {auction.title}
                </Typography>
                <Chip
                  label={isActive ? "active" : "completed"}
                  color={isActive ? "success" : "primary"}
                  sx={{ ml: 1 }}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {isActive ? timeRemaining : "Auction ended"}
                  </Typography>
                </Box>

                {bids.length > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PeopleIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      {bids.length} {bids.length === 1 ? "bid" : "bids"}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccountCircleIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    Listed by: {auctionOwner.displayName}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 3 }}>
                {auction.description}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Start Date
                  </Typography>
                  <Typography variant="body1">{formatDate(auction.startDate)}</Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    End Date
                  </Typography>
                  <Typography variant="body1">{formatDate(auction.endDate)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right column: Bid information and form */}
        <Grid size={{ xs: 12, md: 5, lg: 4 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Current Price
              </Typography>
              <Typography variant="h3" color="primary" gutterBottom>
                {formatCurrency(auction.currentPrice || auction.startingPrice)}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Started at {formatCurrency(auction.startingPrice)}
              </Typography>

              {isActive ? (
                <>
                  <Divider sx={{ my: 3 }} />

                  {!isAuthenticated ? (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Please log in to place a bid
                    </Alert>
                  ) : (
                    <Box component="form" onSubmit={handleBidSubmit} noValidate>
                      <Typography variant="subtitle1" gutterBottom>
                        Place Your Bid
                      </Typography>

                      {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {error}
                        </Alert>
                      )}

                      {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                          Bid placed successfully!
                        </Alert>
                      )}

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="bidAmount"
                        label="Your Bid"
                        name="bidAmount"
                        type="number"
                        autoComplete="off"
                        value={bidAmount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBidAmount(e.target.value)}
                        disabled={loading}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          },
                        }}
                        helperText={`Minimum bid: ${formatCurrency(minBidAmount)}`}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading || !isAuthenticated}
                        sx={{ mt: 2 }}
                      >
                        {loading ? "Placing Bid..." : "Place Bid"}
                      </Button>
                    </Box>
                  )}
                </>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  This auction has ended
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Bid history */}
          <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bid History
            </Typography>

            {bids.length > 0 ? (
              <List>
                {bids.slice(0, 5).map((bid) => (
                  <ListItem key={bid.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <AccountCircleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={formatCurrency(bid.amount)}
                      secondary={`${bid.userDisplayName || "Anonymous"} - ${new Date(bid.timestamp).toLocaleString()}`}
                    />
                  </ListItem>
                ))}
                {bids.length > 5 && (
                  <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                    + {bids.length - 5} more bids
                  </Typography>
                )}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No bids yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-auction-dialog-title"
      >
        <DialogTitle id="delete-auction-dialog-title">Delete Auction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this auction? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAuction} color="error" variant="contained" disabled={deleteLoading}>
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
