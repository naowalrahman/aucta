import { Card, CardContent, Typography, Grid } from "@mui/material";
import { UserProfile } from "@/lib/database-types";

export default function ProfileDetails({ profile }: { profile: UserProfile }) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              User ID
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
              {profile.uid || "N/A"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Account Created
            </Typography>
            <Typography variant="body1">{profile.createdAt ? formatDate(profile.createdAt) : "N/A"}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid>
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Last Updated
            </Typography>
            <Typography variant="body1">{profile.updatedAt ? formatDate(profile.updatedAt) : "N/A"}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
