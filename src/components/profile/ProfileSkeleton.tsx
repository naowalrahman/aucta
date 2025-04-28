import { Box, Skeleton, Divider, Grid, Paper, Container } from "@mui/material";

export default function ProfileSkeleton() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width={200} height={40} sx={{ mt: 2 }} />
          <Skeleton variant="text" width={150} height={30} />
        </Box>
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid key={item}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}
