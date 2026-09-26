import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <Container sx={{ textAlign: "center", mt: 8 }}>
      <Typography
        variant="h1"
        sx={{ fontWeight: "bold", color: "text.secondary" }}
      >
        404
      </Typography>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Страница не найдена
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Вернуться на главную
      </Button>
    </Container>
  );
};
