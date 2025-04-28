"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { clientApp } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Container, Link as MuiLink, Paper, TextField, Typography } from "@mui/material";
import { createOrUpdateUserProfile } from "@/lib/database";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmation) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(getAuth(clientApp), email, password);
      try {
        await createOrUpdateUserProfile(credential.user.uid, {
          uid: credential.user.uid,
          email: email,
          displayName: email.split("@")[0],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      } catch (e) {
        console.error("Error creating user profile:", e);
        setError((e as Error).message);
      }
      router.push("/");
    } catch (e) {
      console.error("Error during registration:", e);
      setError((e as Error).message);
      setIsLoading(false);
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={6} sx={{ width: "100%", p: 4, borderRadius: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 3, fontWeight: "bold", lineHeight: 1.3 }}
        >
          Sign Up for Aucta
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            variant="outlined"
            disabled={isLoading}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
            disabled={isLoading}
          />

          <TextField
            label="Confirm password"
            type="password"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            fullWidth
            required
            variant="outlined"
            disabled={isLoading}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{
              mt: 2,
              py: 1.5,
              bgcolor: "grey.700",
              "&:hover": { bgcolor: "grey.800" },
            }}
          >
            {isLoading ? "Creating account..." : "Create an account"}
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link href="/login" passHref>
                <MuiLink component="span" underline="hover" sx={{ color: "grey.700", fontWeight: "medium" }}>
                  Login here
                </MuiLink>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
