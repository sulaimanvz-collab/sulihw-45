import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CardMedia,
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  setCurrentRecipe,
  setLoading,
} from "../../features/recipes/recipesSlice";
import axiosApi from "../../axiosApi";

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  text: string;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23cccccc%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%23333333%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return PLACEHOLDER_IMAGE;
  if (imagePath.startsWith("http")) return imagePath;

  const filename = imagePath.split("/").pop()?.split("\\").pop();
  if (!filename) return PLACEHOLDER_IMAGE;

  return `http://localhost:8000/uploads/${filename}`;
};

export const FullRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentRecipe, loading } = useAppSelector((state) => state.recipes);
  const user = useAppSelector((state) => state.users.user);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");

  const fetchRecipeAndComments = async () => {
    if (!id) return;
    dispatch(setLoading(true));
    try {
      const recipeResponse = await axiosApi.get(`/recipes/${id}`);
      dispatch(setCurrentRecipe(recipeResponse.data));

      const commentsResponse = await axiosApi.get(`/comments?recipe=${id}`);
      setComments(commentsResponse.data);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchRecipeAndComments();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user || !id) return;

    try {
      await axiosApi.post(
        "/comments",
        {
          recipe: id,
          text: commentText,
        },
        {
          headers: { Authorization: user.token },
        },
      );
      setCommentText("");
      fetchRecipeAndComments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    try {
      await axiosApi.delete(`/comments/${commentId}`, {
        headers: { Authorization: user.token },
      });
      fetchRecipeAndComments();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !currentRecipe) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold" }} gutterBottom>
        {currentRecipe.title}
      </Typography>

      <CardMedia
        component="img"
        height="400"
        image={getImageUrl(currentRecipe.image)}
        alt={currentRecipe.title}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = PLACEHOLDER_IMAGE;
        }}
        sx={{ borderRadius: 2, mb: 3, objectFit: "cover" }}
      />

      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        Автор:{" "}
        <Typography
          component={Link}
          to={`/users/${currentRecipe.user._id}`}
          variant="h6"
          sx={{
            color: "primary.main",
            textDecoration: "none",
            fontWeight: "bold",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {currentRecipe.user.username}
        </Typography>
      </Typography>

      <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 4 }}>
        {currentRecipe.recipe}
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Комментарии ({comments.length})
      </Typography>

      {user && (
        <Box
          component="form"
          onSubmit={handleAddComment}
          sx={{ mb: 4, display: "flex", gap: 2 }}
        >
          <TextField
            fullWidth
            label="Оставить комментарий"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Отправить
          </Button>
        </Box>
      )}

      <List>
        {comments.map((comment) => (
          <ListItem
            key={comment._id}
            secondaryAction={
              (user?._id === comment.user._id ||
                user?._id === currentRecipe.user._id) && (
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <ListItemText
              primary={
                <Typography
                  component={Link}
                  to={`/users/${comment.user._id}`}
                  sx={{
                    color: "text.primary",
                    fontWeight: "bold",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {comment.user.username}
                </Typography>
              }
              secondary={comment.text}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};
