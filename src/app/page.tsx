import { clientConfig, serverConfig } from "@/lib/config";
// import { Button } from "@mui/material";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Box, Container, Typography } from "@mui/material";

export default async function Home() {
  const the_cookies = await cookies();
  const tokens = await getTokens(the_cookies, {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    notFound();
  }

  return (
    <Container style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Super secure home page
      </Typography>
      <Typography variant="body1">
        Only <Box component="strong">{tokens?.decodedToken.email}</Box> holds the magic key to this kingdom!
      </Typography>
    </Container>
  );
}
