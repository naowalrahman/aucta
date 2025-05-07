"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateAuctionDialog from "@/components/auction/create-auction-dialog";
import { useRouter } from "next/navigation";

export default function DashboardClient() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const router = useRouter();

  return (
    <>
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

      <CreateAuctionDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          setOpenCreateDialog(false);
          router.refresh();
        }}
      />
    </>
  );
}
