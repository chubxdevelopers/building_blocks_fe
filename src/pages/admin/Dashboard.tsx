import { Container, Typography, Paper, Box } from "@mui/material";

export default function Dashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 140,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Users
          </Typography>
          <Typography component="p" variant="h4">
            0
          </Typography>
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 140,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Features
          </Typography>
          <Typography component="p" variant="h4">
            0
          </Typography>
        </Paper>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 140,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Capabilities
          </Typography>
          <Typography component="p" variant="h4">
            0
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
