import { Auction } from "@/lib/database-types";
import { Grid } from "@mui/material";
import AuctionCard from "./auction-card";

export default function AuctionsGrid({ auctions }: { auctions: Auction[] }) {
  return (
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
          }}
        >
          <AuctionCard auction={auction} />
        </Grid>
      ))}
    </Grid>
  );
}
