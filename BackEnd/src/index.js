import express from "express";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from "cors";

import materiasRoutes from "./Routes/materias.js"
import atividadesRoutes from "./Routes/atividades.js"
import usersRoutes from "./Routes/user.js"
import alunoMateriaRoutes from "./Routes/alunoMateria.js"
import authLoginRoutes from "./Routes/authLogin.js"
import usersRoutesProfessor from "./Routes/registarProfessor.js"
import usersRoutesAluno from "./Routes/registerAluno.js"

dotenv.config();

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/materias", materiasRoutes);
app.use("/atividades", atividadesRoutes)
app.use("/users", usersRoutes);
app.use("/aluno_materia", alunoMateriaRoutes)
app.use("/login", authLoginRoutes)
app.use("/register", usersRoutesAluno)
app.use("/register", usersRoutesProfessor)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})