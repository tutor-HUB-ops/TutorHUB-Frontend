import { styled, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React from "react";

import fbIcon from "../media/fbicon.png";
import twitterIcon from "../media/twittericon.png";
import linkedinIcon from "../media/linkedinicon.png";

const Footer = () => {
  const CustomContainer = styled(Container)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    gap: theme.spacing(3),
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      textAlign: "center",
      alignItems: "center",
    },
  }));

  const IconBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginTop: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
    },
  }));

  const FooterLink = styled("span")(() => ({
    display: "block",
    fontSize: "15px",  // Increased font size
    color: "#7A7A7E",
    fontWeight: "400", // Adjusted weight for better visibility
    cursor: "pointer",
    padding: "4px 0", // Increased padding for better spacing
    "&:hover": {
      color: "#000",
    },
  }));

  const FooterTitle = styled(Typography)(() => ({
    fontSize: "18px",  // Increased font size
    color: "#1C1C1D",
    fontWeight: "700", // Increased weight for emphasis
    marginBottom: "10px", // Adjusted margin for more spacing
  }));

  return (
    <Box sx={{ py: 10, backgroundColor: "#F5F5F5" }}>
      <CustomContainer
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 4,
        }}
      >
        <Box>
          <FooterTitle>Our Services</FooterTitle>
          <FooterLink>For Tutors</FooterLink>
          <FooterLink>For Students</FooterLink>
          <FooterLink>For Schools</FooterLink>
        </Box>

        <Box>
          <FooterTitle>About </FooterTitle>
          <FooterLink>Help Center</FooterLink>
          <FooterLink>FAQs</FooterLink>
        </Box>

        <Box>
          <FooterTitle>Features</FooterTitle>
          <FooterLink>Personal Profile</FooterLink>
          <FooterLink>Scheduling</FooterLink>
          <FooterLink>Learning Resources</FooterLink>
        </Box>

        <Box>
          <FooterTitle>Connect With Us</FooterTitle>
          <IconBox sx={{ mt: 1, display: 'flex', gap: 2 }}>
            <img src={fbIcon} alt="Facebook" style={{ height: 25, cursor: "pointer" }} />
            <img src={twitterIcon} alt="Twitter" style={{ height: 25, cursor: "pointer" }} />
            <img src={linkedinIcon} alt="LinkedIn" style={{ height: 25, cursor: "pointer" }} />
          </IconBox>
        </Box>
      </CustomContainer>
    </Box>

  );
};

export default Footer;