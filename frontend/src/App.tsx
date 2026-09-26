import { Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import { AppToolbar } from "./components/UI/AppToolbar";
import { Register } from "./containers/Register/Register";
import { Login } from "./containers/Login/Login";
import { Recipes } from "./containers/Recipes/Recipes";
import { FullRecipe } from "./containers/FullRecipe/FullRecipe";
import { NewRecipe } from "./containers/NewRecipe/NewRecipe";
import { NotFound } from "./containers/NotFound/NotFound";

export const App = () => {
  return (
    <>
      <AppToolbar />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Recipes />} />
          <Route path="/recipes/:id" element={<FullRecipe />} />
          <Route path="/recipes/new" element={<NewRecipe />} />
          <Route path="/users/:userId" element={<Recipes />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
};
