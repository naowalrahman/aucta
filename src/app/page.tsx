import { Container, Typography } from "@mui/material";

export default async function Home() {
  return (
    <Container
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Super Secure Home Page
      </Typography>
    </Container>
  );
}
