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
import { useParams } from "react-router-dom";
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
        image={`http://localhost:8000/uploads/${currentRecipe.image}`}
        alt={currentRecipe.title}
        sx={{ borderRadius: 2, mb: 3, objectFit: "cover" }}
      />

      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        Автор: {currentRecipe.user.username}
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
              primary={comment.user.username}
              secondary={comment.text}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};
