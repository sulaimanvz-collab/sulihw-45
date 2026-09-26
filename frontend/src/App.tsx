import { Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import { AppToolbar } from "./components/UI/AppToolbar";
import { Register } from "./containers/Register/Register";
import { Login } from "./containers/Login/Login";
import { NotFound } from "./containers/NotFound/NotFound";

export const App = () => {
  return (
    <>
      <AppToolbar />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<h1>Главная рецептов (скоро)</h1>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
};
