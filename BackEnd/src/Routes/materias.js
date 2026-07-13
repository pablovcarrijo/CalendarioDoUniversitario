import express from "express"

import { MateriasRepository } from "../Repository/materiasRepository.js";
import { UserRepository } from "../Repository/userRepository.js";
import { autenticar } from "../Middlewares/authMiddleware.js";
import { autorizarRoles } from "../Middlewares/permissionMiddleware.js";

const materiasRoutes = express.Router();
const repository = new MateriasRepository();
const repositoryUser = new UserRepository();

materiasRoutes.get('/', async (req, res) => {
    try {

        const { nome } = req.query;
        if (nome) {
            const materia = await repository.listarMateriaByNome(nome);
            if(materia.length === 0){
                return res.status(404).json({
                    mensagem: "Matéria não existe"
                })
            }
            return res.status(200).json(materia);
        }

        const materias = await repository.listarMaterias();
        return res.status(200).json(materias);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ mensagem: "Erro ao buscar matéria" });
    }
});

materiasRoutes.post('/', autenticar, autorizarRoles("PROFESSOR", "ADMINISTRADOR"), async (req, res) => {
    try {
        const { nome, descricao} = req.body;
        const professor_id = req.usuario.id;

        if (!nome) {
            return res.status(400).json({ mensagem: "Erro, nome da matéria ou id do professor é obrigatório" });
        }

        const materiaCriada = await repository.adicionarMateria(nome, descricao, professor_id);

        return res.status(201).json({
            mensagem: "Matéria criada com sucesso!",
            materia: materiaCriada
        })
    }
    catch(err){
        console.log(`Erro ao inserir matéria: ${err}`);
        return res.status(500).json({mensagem: "Erro ao inserir matéria!"})
    }    

})

materiasRoutes.put("/:id", autenticar, autorizarRoles("PROFESSOR", "ADMINISTRADOR"), async (req, res) => {

    const materiaAnterior = await repository.listarMateriaById(req.params.id);
    
    if(materiaAnterior.length === 0){
        console.log("Matéria não encontrada");
        return res.status(404).json({
            mensagem: "Matéria não encontrada"
        })
    }

    const nome = req.body.nome || materiaAnterior[0].nome;
    const descricao = req.body.descricao || materiaAnterior[0].descricao;
    const professor_id = materiaAnterior[0].professor_id;

    try{
        const updated = await repository.alterarMateria(req.params.id, nome, descricao);
        if(updated.affectedRows > 0){
            const materiaUpdate = await repository.listarMateriaById(req.params.id);
            return res.status(200).json({
                mensagem: "Matéria atualizada com sucesso",
                materia: materiaUpdate
            })
        }

        console.log("Erro ao atualiar materia");
        return res.status(404).json({
            mensagem: "Erro ao atualizar materia"
        })
        
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({mensagem: "Erro ao atualizar!"})
    }

})

materiasRoutes.delete("/:id", autenticar, autorizarRoles("PROFESSOR", "ADMINISTRADOR"), async (req, res) => {
    try{
        const idDelete = req.params.id;

        const resultado = await repository.deletarMateria(idDelete);

        if(resultado.affectedRows === 0){
            return res.status(404).json({mensagem: "Erro, matéria não encontrada"});
        }

        return res.status(204).send();
    }
    catch(err){
        console.log(`Erro ao deletar matéria: ${err}`)
        return res.status(500).json({mensagem: "Erro ao deletar matéria"})
    }
});

export default materiasRoutes;