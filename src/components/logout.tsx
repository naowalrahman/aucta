"use client";
import { Button } from "@mui/material";
import { logout } from "@/lib/logout";

export default function Logout() {
  return (
    <form action={logout}>
      <Button variant="contained" type="submit">
        Logout
      </Button>
    </form>
  );
}
