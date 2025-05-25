import { Auction } from "@/lib/database/database-types";
import { Grid } from "@mui/material";
import AuctionCard from "./auction-card";

export default function AuctionsGrid({ auctions }: { auctions: Auction[] }) {
  return (
    <Grid 
      container 
      spacing={{ xs: 1, sm: 2 }}
      sx={{ mx: 'auto', px: { xs: 1, sm: 2 } }}
    >
      {auctions.map((auction) => (
        <Grid 
          key={auction.id}
          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          sx={{
            display: 'flex',
            padding: { xs: 0.5, sm: 1 }
          }}
        >
          <AuctionCard auction={auction} />
        </Grid>
      ))}
    </Grid>
  );
}
