"use client";
import { Button } from "@mui/material";
import { useAuth } from "@/lib/auth-context";
import { logout } from "@/lib/logout";

export default function AuthButton() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <form action={logout}>
      <Button variant="contained" type="submit">
        Logout
      </Button>
    </form>
  ) : (
    <Button variant="contained" href="/login">
      Login
    </Button>
  );
}
