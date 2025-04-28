"use client";

import { useState } from "react";
import { Typography, Box, Avatar, Button } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import EditDisplayNameForm from "./EditDisplayNameForm";
import { UserProfile } from "@/lib/database-types";

export default function ProfileHeader({ profile, userId }: { profile: UserProfile; userId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName || "");

  const getInitials = () => {
    if (displayName) {
      return displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return profile.email?.[0]?.toUpperCase() || "?";
  };

  const handleUpdateSuccess = (newName: string) => {
    setDisplayName(newName);
    setIsEditing(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
      <Avatar
        sx={{
          width: 120,
          height: 120,
          bgcolor: "primary.main",
          fontSize: "2.5rem",
          mb: 2,
        }}
      >
        {getInitials()}
      </Avatar>

      {isEditing ? (
        <EditDisplayNameForm userId={userId} initialDisplayName={displayName} onUpdateSuccess={handleUpdateSuccess} />
      ) : (
        <>
          <Typography variant="h4" sx={{ fontWeight: "bold", mt: 2 }}>
            {displayName || "No Display Name"}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            sx={{ mt: 1 }}
          >
            Edit Name
          </Button>
        </>
      )}

      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        {profile.email || "No email available"}
      </Typography>
    </Box>
  );
}
