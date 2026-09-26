import { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  CircularProgress,
  Container,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setRecipes, setLoading } from "../../features/recipes/recipesSlice";
import axiosApi from "../../axiosApi";

export const Recipes = () => {
  const { userId } = useParams<{ userId?: string }>();
  const dispatch = useAppDispatch();
  const { items: recipes, loading } = useAppSelector((state) => state.recipes);

  useEffect(() => {
    const fetchRecipes = async () => {
      dispatch(setLoading(true));
      try {
        const url = userId ? `/recipes?user=${userId}` : "/recipes";
        const response = await axiosApi.get(url);
        dispatch(setRecipes(response.data));
      } catch (e) {
        console.error(e);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchRecipes();
  }, [dispatch, userId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        {userId ? "Рецепты пользователя" : "Все рецепты"}
      </Typography>

      <Grid container spacing={3}>
        {recipes.map((item) => (
          <Grid key={item._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:8000/uploads/${item.image}`}
                alt={item.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  component={Link}
                  to={`/recipes/${item._id}`}
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    fontWeight: "bold",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Автор:{" "}
                  <Link
                    to={`/users/${item.user._id}`}
                    style={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    {item.user.username}
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
