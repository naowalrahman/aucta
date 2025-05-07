"use client";

import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export function TabPicker({ tab }: { tab: "host" | "participate" }) {
  const router = useRouter();

  return (
    <Box sx={{ mb: 4 }}>
      <Button
        variant={tab === "participate" ? "contained" : "outlined"}
        onClick={() => router.push("/dashboard?tab=participate")}
        sx={{ mr: 2 }}
      >
        Participating Auctions
      </Button>
      <Button variant={tab === "host" ? "contained" : "outlined"} onClick={() => router.push("/dashboard?tab=host")}>
        Hosting Auctions
      </Button>
    </Box>
  );
}
