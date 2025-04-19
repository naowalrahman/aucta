import { clientConfig, serverConfig } from "@/lib/config";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { Box, Button, Container, Typography } from "@mui/material";
import Logout from "@/components/logout";

export default async function Home() {
  const tokens = await getTokens(await cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

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
      {tokens ? (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Only <Box component="strong">{tokens?.decodedToken.email}</Box> holds the magic key to this kingdom!
          </Typography>
          <Logout />
        </Box>
      ) : (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please log in to access this page.
          </Typography>
          <Button variant="contained" href="/login">
            Login
          </Button>
        </Box>
      )}
    </Container>
  );
}
