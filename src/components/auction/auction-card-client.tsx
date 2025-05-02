"use client";

import { useState } from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, CardActionArea } from "@mui/material";
import { useRouter } from "next/navigation";
import { Auction } from "@/lib/database-types";

type FormattedData = {
  currentPrice: string;
  startDate: string;
  endDate: string;
  statusColor: "success" | "primary" | "error" | "default";
  isActive: boolean;
};

export default function AuctionCardClient({
  auction,
  formattedData,
  placeholderImage,
}: {
  auction: Auction;
  formattedData: FormattedData;
  placeholderImage: string;
}) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

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
        width: "100%",
      }}
    >
      <CardActionArea onClick={() => router.push(`/auctions/${auction.id}`)}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 200,
            overflow: "hidden",
            backgroundColor: "rgba(0,0,0,0.03)",
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
              objectFit: "contain",
              maxHeight: "200px",
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
            <Chip label={auction.status} size="small" color={formattedData.statusColor} sx={{ ml: 1 }} />
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
              {formattedData.currentPrice}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Start:
              </Typography>
              <Typography variant="body2">{formattedData.startDate}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                End:
              </Typography>
              <Typography variant="body2">{formattedData.endDate}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button variant="contained" color="primary" fullWidth onClick={() => router.push(`/auctions/${auction.id}`)}>
          {formattedData.isActive ? "Place Bid" : "View Details"}
        </Button>
      </Box>
    </Card>
  );
}
