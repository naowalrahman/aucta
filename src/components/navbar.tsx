"use client";
import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Gavel as GavelIcon,
  Dashboard as DashboardIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import AuthButton from "@/components/auth-button";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { name: "Auctions", icon: <GavelIcon sx={{ mr: 1 }} />, path: "/auctions" },
    { name: "Dashboard", icon: <DashboardIcon sx={{ mr: 1 }} />, path: "/dashboard" },
    { name: "Profile", icon: <AccountCircleIcon sx={{ mr: 1 }} />, path: "/profile" },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{ backgroundColor: "white", color: "black", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ mr: 1 }}>
                  <Image src="/logo.png" alt="Aucta Logo" width={36} height={36} />
                </Box>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    mr: 2,
                    fontWeight: 700,
                    letterSpacing: ".1rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Aucta
                </Typography>
              </Box>
            </Link>
          </Box>

          {isMobile ? (
            <Box>
              <IconButton
                size="large"
                edge="end"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.name}
                    component={Link}
                    href={item.path}
                    onClick={handleClose}
                    selected={pathname === item.path}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {item.icon}
                      {item.name}
                    </Box>
                  </MenuItem>
                ))}
                <MenuItem>
                  <AuthButton />
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {navItems.map((item) => (
                <Link key={item.name} href={item.path} passHref style={{ textDecoration: "none" }}>
                  <Button
                    startIcon={item.icon}
                    color="inherit"
                    sx={{
                      fontWeight: pathname === item.path ? 700 : 500,
                      borderBottom: pathname === item.path ? "2px solid" : "none",
                      borderRadius: 0,
                      fontSize: "1rem",
                      minWidth: 100,
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              <Box sx={{ ml: 2 }}>
                <AuthButton />
              </Box>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
