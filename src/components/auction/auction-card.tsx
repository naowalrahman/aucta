"use client";

import { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, CardActionArea } from "@mui/material";
import { useRouter } from "next/navigation";
import { Auction } from "@/lib/database-types";

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper function to format dates
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper to get status color
const getStatusColor = (status: string) => {
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
};

export default function AuctionCard({ auction }: { auction: Auction }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Calculate time remaining if the auction is active
  const now = Date.now();
  const isActive = auction.status === "active" && auction.endDate > now;

  const placeholderImage = "https://placehold.co/400x400?text=No+Image";

  return (
    <Card
      elevation={isHovered ? 4 : 1}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out",
        transform: isHovered ? "translateY(-4px)" : "none",
        width: "100%", // Ensure full width
      }}
    >
      <CardActionArea onClick={() => router.push(`/auction/${auction.id}`)}>
        {/* Image container with fixed dimensions */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 200, // Fixed height for all images
            overflow: "hidden",
            backgroundColor: "rgba(0,0,0,0.03)", // Light background for image area
            borderLeft: "1px solid rgba(0,0,0,0.08)",
            borderRight: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain", // Changed to contain to show full image
              maxHeight: "200px", // Match the container height
              objectPosition: "center",
            }}
            image={auction.imageUrl || placeholderImage}
            alt={auction.title}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1 }}>
              {auction.title}
            </Typography>
            <Chip label={auction.status} size="small" color={getStatusColor(auction.status) as any} sx={{ ml: 1 }} />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 2,
            }}
          >
            {auction.description}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Current Price:
            </Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {formatCurrency(auction.currentPrice || auction.startingPrice)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Start:
              </Typography>
              <Typography variant="body2">{formatDate(auction.startDate)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                End:
              </Typography>
              <Typography variant="body2">{formatDate(auction.endDate)}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button variant="contained" color="primary" fullWidth onClick={() => router.push(`/auction/${auction.id}`)}>
          {isActive ? "Place Bid" : "View Details"}
        </Button>
      </Box>
    </Card>
  );
}
