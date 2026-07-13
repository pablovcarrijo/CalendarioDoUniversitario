import express from 'express'

import { UserRepository } from "../Repository/userRepository.js";
import { autenticar } from "../Middlewares/authMiddleware.js"
import { autorizarRoles } from '../Middlewares/permissionMiddleware.js';

const usersRoutes = express.Router();
const repository = new UserRepository();

usersRoutes.get('/', async (req, res) => {
    try {

        const { role } = req.query;

        if (role) {
            const user = await repository.listarUsersByRole(role);
            if (user.length === 0) {
                return res.status(404).json({
                    mensagem: "Usuário não existe!"
                })
            }
            return res.status(200).json(user)
        }

        const users = await repository.listarUsers();
        return res.status(200).json(users);

    }
    catch (err) {
        console.log(`Erro ao listar users: ${err}`)
        return res.status(500).json({
            mensagem: "Erro ao listar users"
        })
    }
})

usersRoutes.get('/:matricula', async (req, res) => {
    try {

        const matriculaUsuario = req.params.matricula;

        const user = await repository.buscarUserByMatricula(matriculaUsuario);

        if (user.length === 0) {
            return res.status(404).json({ mensagem: "Erro, usuário não encontrado" })
        }

        return res.status(200).json(user);

    }
    catch (err) {
        console.log(`Erro ao buscar usuário por matricula ${err}`)
        return res.status(500).json({ mensagem: "Erro ao buscar usuário por matricula" })
    }
})

usersRoutes.put("/", autenticar, async (req, res) => {
    try {

        const user = await repository.buscarUserById(req.usuario.id);
        if (user.length === 0) {
            return res.status(404).json({ mensagem: "Erro, usuário não encontrado" })
        }

        const nome = req.body.nome ?? user[0].nome;
        const email = req.body.email ?? user[0].email;
        const matricula = req.body.matricula ?? user[0].matricula;
        const senha = req.body.senha ?? user[0].senha;
        const role = user[0].role;

        await repository.alterarUser(req.usuario.id, nome, email, matricula, senha, role);
        const userUpdate = await repository.buscarUserById(req.usuario.id);

        const { senha: _, ...userSemSenha } = userUpdate[0];

        return res.status(200).json({
            mensagem: "Usuário atualizado",
            user: userSemSenha
        })

    }
    catch (err) {
        console.log(`Erro ao atualizar usuário: ${err}`)
        return res.status(500).json({ mensagem: "Erro ao atualizar usuário" })
    }
})

usersRoutes.delete("/", autenticar, async (req, res) => {
    try {
        const resultado = await repository.deletarUserByMatricula(req.usuario.matricula);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Erro, usuário não encontrado" })
        }
        res.clearCookie("token")
        return res.status(204).send();
    }
    catch (err) {
        console.log(`Erro ao deletar: ${err}`);
        res.status(500).json({
            mensagem: "Erro ao deletar user"
        })
    }
})

usersRoutes.delete("/:matricula", autenticar, autorizarRoles("ADMINISTRADOR"), async (req, res) => {
    try {
        const resultado = await repository.deletarUserByMatricula(req.params.matricula);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: "Erro, usuário não encontrado" })
        }
        return res.status(204).send();
    }
    catch (err) {
        console.log(`Erro ao deletar: ${err}`);
        res.status(500).json({
            mensagem: "Erro ao deletar user"
        })
    }
})


export default usersRoutes;