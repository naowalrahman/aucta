import { Container, Typography, Box, Grid, Card, CardContent, Button, Stack, Chip, Divider } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

// Set this page to be statically rendered at build time.
// This would happen normally but because we have middleware.ts
// the default is server-rendered on demand.
export const dynamic = "force-static";

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.08)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Image src={`/${icon}.svg`} alt={title} width={40} height={40} />
        </Box>
        <Typography variant="h6" component="h3" gutterBottom fontWeight="500">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

function TechStackItem({ name, icon }: { name: string; icon: React.ReactElement }) {
  return (
    <Chip
      icon={icon}
      label={name}
      variant="outlined"
      sx={{
        border: "1px solid rgba(0,0,0,0.12)",
        m: 0.5,
        p: 1,
        "&:hover": {
          backgroundColor: "rgba(0,0,0,0.04)",
        },
      }}
    />
  );
}

export default function Home() {
  const features = [
    {
      title: "Real-time Bidding",
      description: "See bid updates instantly without refreshing the page, ensuring you never miss an opportunity.",
      icon: "realtime",
    },
    {
      title: "Secure Accounts",
      description: "Firebase Authentication keeps your profile and bidding activity protected at all times.",
      icon: "secure",
    },
    {
      title: "Custom Auctions",
      description: "Create auctions with custom start and end dates, images, and detailed descriptions.",
      icon: "auction",
    },
    {
      title: "User Profiles",
      description: "Manage your personal details and track your auction activity from your dashboard.",
      icon: "userprofile",
    },
    {
      title: "Responsive Design",
      description: "Bid from any device with a fully responsive interface optimized for all screen sizes.",
      icon: "responsive",
    },
    {
      title: "Server-side Rendering",
      description: "Enjoy fast page loads and SEO benefits with Next.js server-side rendering.",
      icon: "server",
    },
  ];

  const techStack = [
    {
      name: "Next.js",
      icon: "nextjs",
    },
    {
      name: "React",
      icon: "react",
    },
    {
      name: "Firebase",
      icon: "firebase",
    },
    {
      name: "Material UI",
      icon: "mui",
    },
    {
      name: "TypeScript",
      icon: "typescript",
    },
  ];

  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          borderRadius: { md: "0 0 50px 50px" },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  mb: 2,
                  background: "linear-gradient(90deg, #1a237e, #0288d1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Real-time Auctions Made Simple
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4, fontWeight: 400 }}>
                Create, bid, and track auctions in real-time with Aucta&apos;s modern platform
              </Typography>
              <Stack direction="row" spacing={2}>
                <Link href="/auctions" passHref legacyBehavior>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      background: "linear-gradient(90deg, #1a237e, #0288d1)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #0d47a1, #039be5)",
                      },
                    }}
                  >
                    Browse Auctions
                  </Button>
                </Link>
                <Link href="/register" passHref legacyBehavior>
                  <Button variant="outlined" size="large" sx={{ borderRadius: 2, px: 4, py: 1.5 }}>
                    Sign Up or Login
                  </Button>
                </Link>
              </Stack>
            </Grid>
            <Grid>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              ></Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="h3" gutterBottom fontWeight={600}>
            Platform Features
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: "700px", mx: "auto" }}>
            Everything you need to host successful auctions in real-time
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <FeatureCard title={feature.title} description={feature.description} icon={feature.icon} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Tech Stack Section */}
      <Box sx={{ bgcolor: "#f5f7fa", py: { xs: 6, md: 8 }, borderRadius: { md: "50px 50px 0 0" } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Built With Modern Tech
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: "700px", mx: "auto", mb: 4 }}>
              Aucta leverages the latest web technologies for performance, security, and an excellent user experience
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
              {techStack.map((item, index) => (
                <TechStackItem
                  key={index}
                  name={item.name}
                  icon={<Image src={`/${item.icon}.svg`} alt={item.name} width={20} height={20} />}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Ready to start bidding?
            </Typography>
            <Link href="/auctions" passHref legacyBehavior>
              <Button
                variant="contained"
                size="large"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  px: 4,
                  background: "linear-gradient(90deg, #1a237e, #0288d1)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #0d47a1, #039be5)",
                  },
                }}
              >
                Browse Auctions
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
