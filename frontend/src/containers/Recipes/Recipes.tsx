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

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23cccccc%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23333333%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

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

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    if (imagePath.startsWith("http")) return imagePath;

    const filename = imagePath.split("/").pop()?.split("\\").pop();
    if (!filename) return PLACEHOLDER_IMAGE;

    return `http://localhost:8000/uploads/${filename}`;
  };

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
                image={getImageUrl(item.image)}
                alt={item.title}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
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
