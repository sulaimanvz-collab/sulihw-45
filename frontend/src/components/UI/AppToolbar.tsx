import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { unsetUser } from "../../features/users/usersSlice";
import axiosApi from "../../axiosApi";

export const AppToolbar = () => {
  const user = useAppSelector((state) => state.users.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (user?.token) {
        await axiosApi.delete("/users/sessions", {
          headers: { Authorization: user.token },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(unsetUser());
      navigate("/");
    }
  };

  return (
    <AppBar position="sticky" sx={{ mb: 4, backgroundColor: "#3f51b5" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: "inherit", textDecoration: "none", fontWeight: "bold" }}
        >
          Recipe place
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
              <Typography
                component={Link}
                to={`/users/${user._id}`}
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Hello, {user.username}!
              </Typography>
              <Button color="inherit" onClick={handleLogout} variant="outlined">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
