import { Box, styled, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import heroImg from "../media/hero-boy.png";
import CustomButton from "./CustomButton";

const Hero = () => {
  const CustomBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing(5),
    padding: theme.spacing(4, 0),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
      textAlign: "center",
      gap: theme.spacing(3),
    },
  }));

  const Title = styled(Typography)(({ theme }) => ({
    fontSize: "48px",
    fontWeight: 700,
    lineHeight: 1.3,
    margin: theme.spacing(2, 0),
    color: "black",
    [theme.breakpoints.down("sm")]: {
      fontSize: "36px",
    },
  }));


  const StatsBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-around",
    padding: theme.spacing(3),
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: "12px",
    marginTop: theme.spacing(4),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      gap: theme.spacing(2),
    },
  }));

  const StatItem = styled(Box)({
    textAlign: "center",
    padding: "0 16px",
  });

  return (
    <Box sx={{ backgroundColor: "#F9F9F9", py: 1 }}>
      <Container maxWidth="lg" sx={{ maxWidth: '800px', width: '80%', mx: 'auto' }}>        <Navbar />
        <CustomBox>
          <Box sx={{ flex: 1, maxWidth: "560px" }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "16px",
                color: "#4CAF50",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Future of Education
            </Typography>

            <Title variant="h1">
              Transform Your Learning Experience
            </Title>

            <Typography
              variant="body1"
              sx={{
                fontSize: "18px",
                color: "#555",
                lineHeight: 1.5,
                mb: 3,
              }}
            >
              Join thousands of students mastering new skills with our interactive platform.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <CustomButton
                  color="#4CAF50"
                  buttonText="Start Learning"
                  borderColor="#4CAF50"
                  hoverColor="#fff"
                  backgroundColor="#fff"
                />
              </Link>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <img
              src={heroImg}
              alt="Happy student learning"
              style={{
                maxWidth: "90%",
                height: "auto",
                borderRadius: "12px",
                boxShadow: "0 10px 20px rgba(76, 175, 80, 0.15)",
              }}
            />
          </Box>
        </CustomBox>

        <StatsBox>
          <StatItem>
            <Typography variant="h4" sx={{ color: "#4CAF50", fontWeight: 700 }}>
              1-on-1
            </Typography>
            <Typography variant="body2">Personalized Tutoring Sessions</Typography>
          </StatItem>
          <StatItem>
            <Typography variant="h4" sx={{ color: "#4CAF50", fontWeight: 700 }}>
              40+
            </Typography>
            <Typography variant="body2">Subjects Offered</Typography>
          </StatItem>
          <StatItem>
            <Typography variant="h4" sx={{ color: "#4CAF50", fontWeight: 700 }}>
              24/7
            </Typography>
            <Typography variant="body2">Access to Learning Resources</Typography>
          </StatItem>

          <StatItem>
            <Typography variant="h4" sx={{ color: "#4CAF50", fontWeight: 700 }}>
              100%
            </Typography>
            <Typography variant="body2">Tutor Background Verification</Typography>
          </StatItem>
        </StatsBox>

      </Container>
    </Box>
  );
};

export default Hero;