import { Container, CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { AppToolbar } from "./components/UI/AppToolbar";
import { Recipes } from "./containers/Recipes/Recipes";
import { FullRecipe } from "./containers/FullRecipe/FullRecipe";
import { Register } from "./containers/Register/Register";
import { Login } from "./containers/Login/Login";
import { NewRecipe } from "./containers/NewRecipe/NewRecipe";

export const App = () => {
  return (
    <>
      <CssBaseline />
      <header>
        <AppToolbar />
      </header>
      <main>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Recipes />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/new" element={<NewRecipe />} />
            <Route path="/recipes/:id" element={<FullRecipe />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </Container>
      </main>
    </>
  );
};
