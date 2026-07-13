import express from "express"

import { UserRepository } from "../Repository/userRepository.js";

const usersRoutesAluno = express.Router();
const repository = new UserRepository();

usersRoutesAluno.post('/aluno', async (req, res) => {
    try {

        const { nome, email, matricula, senha } = req.body;

        if (nome && email && matricula && senha) {
            const resultado = await repository.adicionarUser(nome, email, matricula, senha, "ALUNO");
            return res.status(201).json({
                mensagem: "Aluno criado com sucesso!",
                usuario: resultado
            })
        }
        console.log("Algum campo não inserido");
        return res.status(400).json({ mensagem: "Erro, preencha todos os campos" })
    }
    catch (err) {
        console.log(`Erro ao inserir novo usuário: ${err}`)
        return res.status(500).json({ mensagem: "Erro ao inserir novo usuário" })
    }
});

export default usersRoutesAluno;