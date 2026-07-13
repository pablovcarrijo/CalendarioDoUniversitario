import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRepository } from "../Repository/userRepository.js";

dotenv.config();

const userRepository = new UserRepository();

export async function autenticar(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            console.log("Usuário não está logado, refaça o login");
            return res.status(401).json({
                mensagem: "Usuário não está logado, refaça o login"
            })
        }

        const dadosToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userRepository.buscarUserById(dadosToken.id);

        if (!user || user.length === 0) {
            return res.status(401).json({
                mensagem: "Usuário não encontrado"
            })
        }

        req.usuario = {
            id: user[0].id,
            nome: user[0].nome,
            email: user[0].email,
            matricula: user[0].matricula,
            role: user[0].role
        };

        next();

    }
    catch (err) {
        console.log(`->${err}`);
        return res.status(401).json({
            mensagem: "Erro ao fazer autenticação"
        })
    }
}