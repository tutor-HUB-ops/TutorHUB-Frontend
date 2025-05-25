import { Box, Typography, Grid, Card, CardContent, CardMedia, styled } from "@mui/material";
import {
  commerce, english, data_science, physics, geo,
  chem, math, psycho, soft_skill, med
} from '../media/Subject icons/Subjects';

const courses = [
  { title: "Mathematics", icon: math },
  { title: "English", icon: english },
  { title: "Physics", icon: physics },
  { title: "Soft Skills", icon: soft_skill },
  { title: "Chemistry", icon: chem },
  { title: "Data Science", icon: data_science },
  { title: "Geography", icon: geo },
  { title: "Commerce", icon: commerce },
  { title: "Medical", icon: med },
  { title: "Psychology", icon: psycho },
];

const GreenDivider = styled(Box)({
  width: "80px",
  height: "5px",
  backgroundColor: "#4CAF50",
  margin: "0 auto",
  borderRadius: "4px",
});

const CourseCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  borderRadius: "16px",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#4CAF50", 
    color: "white",
  },
  textAlign: "center",
  padding: theme.spacing(2),
  backgroundColor: "#f9f9f9",
}));

const Courses = () => {
  return (
    <Box sx={{ px: 4, py: 6, backgroundColor: "#fff" }}>
      <GreenDivider />

      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          mt: 2,
          color: "#333",
        }}
      >
        Explore Course Categories
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          color: "#555",
          mt: 1,
          mb: 4,
        }}
      >
        Discover specialized courses across multiple disciplines
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <CourseCard elevation={3}>
              <CardMedia
                component="img"
                image={course.icon}
                alt={course.title}
                sx={{ width: "70px", height: "70px", mx: "auto", mb: 2 }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {course.title}
                </Typography>
              </CardContent>
            </CourseCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Courses;
