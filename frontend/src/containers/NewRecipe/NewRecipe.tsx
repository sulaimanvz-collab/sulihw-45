import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import axiosApi from "../../axiosApi";

export const NewRecipe = () => {
  const [title, setTitle] = useState("");
  const [recipe, setRecipe] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const user = useAppSelector((state) => state.users.user);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !recipe || !image || !user) {
      setError("Заполните все поля и выберите изображение");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("recipe", recipe);
    formData.append("image", image);

    try {
      await axiosApi.post("/recipes", formData, {
        headers: { Authorization: user.token },
      });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка создания рецепта");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ my: 3, fontWeight: "bold" }}>
        Добавить новый рецепт
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Название рецепта"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Описание и правильный рецепт"
          required
          multiline
          rows={4}
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
        />
        <Button variant="outlined" component="label">
          Загрузить фото
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
          />
        </Button>
        {image && <Typography variant="caption">{image.name}</Typography>}

        <Button type="submit" variant="contained" size="large">
          Опубликовать рецепт
        </Button>
      </Box>
    </Container>
  );
};
