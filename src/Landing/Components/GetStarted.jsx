import { styled, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import homeIllustration from "../media/illus.png";
import CustomButton from "./CustomButton";
import { Link } from "react-router-dom";

const GetStarted = () => {
  const CustomContainer = styled(Container)(({ theme }) => ({
    backgroundColor: "#E6F4EA",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(5),
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
  }));

  const TextBox = styled(Box)(({ theme }) => ({
    flex: 1,
    textAlign: "center",
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up("md")]: {
      textAlign: "left",
      marginBottom: 0,
      marginRight: theme.spacing(4),
    },
  }));

  const ImageBox = styled(Box)(({ theme }) => ({
    flex: 1,
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  }));

  return (
    <CustomContainer>
      <TextBox>
        <Typography
          sx={{ fontSize: "1.7rem", color: "black", fontWeight: "700", my: 3 }}
        >
          Digitize your school in minutes <br /> with Tutor Connect&apos;s Integrated Platform
        </Typography>
        <Link to='/signup' style={{ textDecoration: "none" }}>
          <CustomButton
            backgroundColor="#fff"
            color="#4CAF50"
            buttonText="Get Started"
            getStartedBtn={true}
          />
        </Link>
      </TextBox>
      <ImageBox>
        <img
          src={homeIllustration}
          alt="Illustration"
          style={{ maxHeight: "400px", width: "auto" }}
        />
      </ImageBox>
    </CustomContainer>
  );
};

export default GetStarted;