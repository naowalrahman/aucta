import { Container, Paper, Divider, Alert } from "@mui/material";
import { getUserProfile } from "@/lib/database";
import { getAuthData } from "@/components/auth-provider-wrapper";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { Suspense } from "react";

export default async function ProfilePage() {
  const { user, isAuthenticated } = await getAuthData();

  if (!isAuthenticated || !user?.uid) {
    redirect("/login");
  }

  try {
    const profile = await getUserProfile(user.uid);
    if (profile === null) {
      throw new Error("Profile not found");
    }

    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Suspense fallback={<ProfileSkeleton />}>
            <ProfileHeader profile={profile} userId={user.uid} /> {/* CSR */}
            <Divider sx={{ my: 3 }} />
            <ProfileDetails profile={profile} /> {/* SSR */}
          </Suspense>
        </Paper>
      </Container>
    );
  } catch (error) {
    console.error("Error loading profile:", error);

    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Alert severity="error">Failed to load profile. Please try again later.</Alert>
        </Paper>
      </Container>
    );
  }
}
