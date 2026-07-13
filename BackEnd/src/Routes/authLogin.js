import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { UserRepository } from "../Repository/userRepository.js";
import { autenticar } from "../Middlewares/authMiddleware.js";

const authLoginRoutes = express.Router();
const repositoryUser = new UserRepository();

authLoginRoutes.post('/', async (req, res) => {

    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Email e senha são obrigatórios"
            })
        }

        const user = await repositoryUser.buscarUserByEmail(email);

        if (!user || user.length === 0) {
            return res.status(404).json({
                mensagem: "Email não cadastrado, por favor cadastrar"
            })
        }

        if (senha === user[0].senha) {

            const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '2h' })

            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 2 * 60 * 60 * 1000
            })

            return res.status(200).json({
                mensagem: "Login realizado com sucesso",
                token: token,
                usuario: {
                    id: user[0].id,
                    nome: user[0].nome,
                    email: user[0].email,
                    matricula: user[0].matricula,
                    role: user[0].role
                }
            })
        }
        else {
            console.log("Senha inválida");
            return res.status(404).json({
                mensagem: "Senha inválida"
            })
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            mensagem: "Erro ao fazer login"
        })
    }
})

authLoginRoutes.get('/me', autenticar, async (req, res) => {
    return res.status(200).json({
        usuario: req.usuario
    })    
})

authLoginRoutes.post('/logout', (req, res) => {
    res.clearCookie("token");

    return res.status(200).json({
        mensagem: "Logou realizado com sucesso"
    })
})

export default authLoginRoutes;