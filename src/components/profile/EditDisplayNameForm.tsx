"use client";

import { useState } from "react";
import { TextField, Button, Box, Alert } from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { createOrUpdateUserProfile } from "@/lib/database/user";

export default function EditDisplayNameForm({
  userId,
  initialDisplayName,
  onUpdateSuccess,
}: {
  userId: string;
  initialDisplayName: string;
  onUpdateSuccess: (newName: string) => void;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleUpdateProfile() {
    if (!userId) return;

    try {
      setIsSubmitting(true);
      setError("");
      await createOrUpdateUserProfile(userId, {
        displayName,
      });

      setSuccess("Profile updated successfully!");
      onUpdateSuccess(displayName);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 300 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          variant="outlined"
          size="small"
          disabled={isSubmitting}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 1 }}
          onClick={handleUpdateProfile}
          startIcon={<SaveIcon />}
          disabled={isSubmitting}
        >
          Save
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">Your new display name will only be reflected on future bids.</Alert>
      </Box>
    </Box>
  );
}
