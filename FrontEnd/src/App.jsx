import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login.jsx";
import Materias from "./pages/Materias/Materias.jsx";
import Atividades from "./pages/Atividades/Atividades.jsx";
import DashboardAluno from "./pages/DashboardAluno/DashboardAluno.jsx";
import "./pages/Login/login.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/aluno" element={<DashboardAluno />} />

      <Route path="/materias" element={<Materias />} />
      <Route path="/atividades" element={<Atividades />} />
    </Routes>
  );
}

export default App;