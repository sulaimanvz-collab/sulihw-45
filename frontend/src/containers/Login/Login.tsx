import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../app/hooks";
import { setUser } from "../../features/users/usersSlice";
import axiosApi from "../../axiosApi";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axiosApi.post("/users/sessions", {
        username,
        password,
      });
      dispatch(setUser(response.data));
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Неверный логин или пароль");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        const response = await axiosApi.post("/users/google", {
          credential: credentialResponse.credential,
        });
        dispatch(setUser(response.data));
        navigate("/");
      }
    } catch (err) {
      setError("Ошибка входа через Google");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOpenIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>

          <Divider sx={{ my: 2 }}>ИЛИ</Divider>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Auth Failed")}
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
