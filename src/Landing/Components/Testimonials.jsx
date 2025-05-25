import { Box, Container, styled, Typography, Grid } from "@mui/material";
import { testimonials } from "../media/testimonials/properties";

const Testimonials = () => {
  const Wrapper = styled(Box)(({ theme }) => ({
    backgroundColor: "#F3F6F4",
    padding: theme.spacing(8, 2),
  }));

  const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: "36px",
    textAlign: "center",
    color: "#000",
    marginBottom: theme.spacing(2),
  }));

  const SectionSub = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    fontSize: "24px",
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: theme.spacing(6),
  }));

  const Card = styled(Box)(({ theme }) => ({
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: theme.spacing(3),
    textAlign: "center",
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }));

  const ImageBox = styled("img")(({ theme }) => ({
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "50%",
    marginBottom: theme.spacing(2),
  }));

  const Head = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: "18px",
    color: "#222",
  }));

  const Description = styled(Typography)(({ theme }) => ({
    fontSize: "14px",
    color: "#555",
    lineHeight: 1.5,
  }));

  return (
    <Wrapper>
      <Container maxWidth="lg">
        <SectionTitle>Enable Better Outcomes</SectionTitle>
        <SectionSub>For Everyone</SectionSub>

        <Grid container spacing={4}>
          {testimonials.map((el) => (
            <Grid item xs={12} sm={6} md={4} key={el.head}>
              <Card>
                <ImageBox src={el.image} alt={el.head} />
                <Head>{el.head}</Head>
                <Description>{el.des}</Description>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
};

export default Testimonials;