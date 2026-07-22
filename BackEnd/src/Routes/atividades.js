import express from "express"

import { AtividadesRepository } from "../Repository/atividadesRepository.js";
import { MateriasRepository } from "../Repository/materiasRepository.js";
import { autenticar } from "../Middlewares/authMiddleware.js";
import { autorizarRoles } from "../Middlewares/permissionMiddleware.js";

const atividadeRoutes = express.Router();
const repository = new AtividadesRepository();
const repositorioMateria = new MateriasRepository();

atividadeRoutes.get('/', autenticar, async (req, res) => {
    try {
        const { materia } = req.query;

        if (req.usuario.role === "ALUNO") {
            const resultado =
                await repository.listarAtividadesDoAluno(
                    req.usuario.matricula,
                    materia
                );

            return res.status(200).json({
                resultado
            });
        }

        if (materia) {
            const resultado =
                await repository.listarAtividadePorMateria(materia);

            return res.status(200).json({
                materia,
                resultado
            });
        }

        const resultado =
            await repository.listarAtividades();

        return res.status(200).json({
            resultado
        });
    } catch (err) {
        console.log(`Erro ao listar atividades: ${err}`);

        return res.status(500).json({
            mensagem: "Erro ao encontrar atividades"
        });
    }
});

atividadeRoutes.post('/', autenticar, autorizarRoles("PROFESSOR", "ADMINISTRADOR"), async (req, res) => {
    try {
        const { titulo, descricao, data_entrega, materia_id } = req.body;
        
        
        if (!materia_id || !data_entrega || !titulo) {
            console.log("Titulo, data de entrega e id da matéria são obrigatórios");
            return res.status(400).json({
                mensagem: "Titulo, data de entrega e id da matéria são obrigatórios"
            })
        }
        
        const materia = await repositorioMateria.listarMateriaById(materia_id);

        if(materia.length === 0){
            console.log("Matéria não encontrada");
            return res.status(404).json({
                mensagem: "Matéria não encontrada"
            })
        }

        if(req.usuario.id != materia[0].professor_id && req.usuario.role != "ADMINISTRADOR"){
            console.log("Erro, professor não pode adicionar atividade em matérias além da dele.");
            return res.status(404).json({
                mensagem: "Erro, professor não pode adicionar atividade em matérias além da dele."
            })
        }

        const atividadeCriada = await repository.adicionarAtividadeMateria(titulo, descricao, data_entrega, materia_id);

        return res.status(201).json({
            mensagem: "Atividade criada com sucesso",
            atividade: atividadeCriada
        })

    }
    catch (err) {
        console.log(`Erro ao criar atividade: ${err}`);
        return res.status(500).json({
            mensagem: "Erro ao criar atividade"
        })
    }
})

atividadeRoutes.put('/:id', autenticar, autorizarRoles("PROFESSOR", "ADMINISTRADOR"), async (req, res) => {
    try {
        const atividadeId = req.params.id;

        const atividadeAnterior = await repository.listarAtividadePorId(atividadeId);

        if (atividadeAnterior.length === 0) {
            console.log("Atividade não encontrada");
            return res.status(404).json({
                mensagem: "Atividade não encontrada"
            });
        }

        const materiaAtual = await repositorioMateria.listarMateriaById(atividadeAnterior[0].materia_id);

        if (materiaAtual.length === 0) {
            console.log("Matéria atual da atividade não encontrada");
            return res.status(404).json({
                mensagem: "Matéria atual da atividade não encontrada"
            });
        }

        if (req.usuario.id != materiaAtual[0].professor_id && req.usuario.role != "ADMINISTRADOR") {
            console.log("Erro, professor só pode alterar atividades das matérias dele");
            return res.status(403).json({
                mensagem: "Erro, professor só pode alterar atividades das matérias dele"
            });
        }

        const titulo = req.body.titulo ?? atividadeAnterior[0].titulo;
        const descricao = req.body.descricao ?? atividadeAnterior[0].descricao;
        const data_entrega = req.body.data_entrega ?? atividadeAnterior[0].data_entrega;
        const materia_id = req.body.materia_id ?? atividadeAnterior[0].materia_id;

        const novaMateria = await repositorioMateria.listarMateriaById(materia_id);

        if (novaMateria.length === 0) {
            console.log("Nova matéria não encontrada");
            return res.status(404).json({
                mensagem: "Nova matéria não encontrada"
            });
        }

        if (req.usuario.id != novaMateria[0].professor_id && req.usuario.role != "ADMINISTRADOR") {
            console.log("Erro, professor não pode mover atividade para matéria que não é dele");
            return res.status(403).json({
                mensagem: "Erro, professor não pode mover atividade para matéria que não é dele"
            });
        }

        const updated = await repository.alterarAtividade(atividadeId, titulo, descricao, data_entrega, materia_id);

        if (updated.affectedRows > 0) {
            const atividadeUpdated = await repository.listarAtividadePorId(atividadeId);
            return res.status(200).json({
                mensagem: "Atividade atualizada",
                atividade: atividadeUpdated
            });
        }

        console.log("Erro ao atualizar");
        return res.status(404).json({
            mensagem: "Erro ao atualizar atividade"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            mensagem: "Erro ao atualizar atividade"
        });
    }
});

atividadeRoutes.delete('/:id', autenticar, autorizarRoles("PROFESSOR", "ADMINISTRADOR"), async (req, res) => {
    try {
        const idDelete = req.params.id;

        const atividade = await repository.listarAtividadePorId(idDelete);

        if (atividade.length === 0) {
            return res.status(404).json({
                mensagem: "Erro, atividade não encontrada"
            });
        }

        const materiaId = atividade[0].materia_id;

        const materia = await repositorioMateria.listarMateriaById(materiaId);

        if (materia.length === 0) {
            console.log("Matéria vinculada à atividade não encontrada");

            return res.status(404).json({
                mensagem: "Matéria vinculada à atividade não encontrada"
            });
        }

        if (materia[0].professor_id != req.usuario.id && req.usuario.role != "ADMINISTRADOR") {
            console.log("Erro, essa atividade não pertence a esse professor");

            return res.status(403).json({
                mensagem: "Erro, essa atividade não pertence a esse professor"
            });
        }

        const resultado = await repository.deletarAtividade(idDelete);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Erro, atividade não encontrada"
            });
        }

        return res.status(204).send();

    } catch (err) {
        console.log(`Erro ao deletar a atividade ${err}`);

        return res.status(500).json({
            mensagem: "Erro ao deletar a atividade"
        });
    }
});

export default atividadeRoutes