import express from 'express'

import { AlunoMateriaRepository } from "../Repository/alunoMateriaRepository.js"
import { UserRepository } from '../Repository/userRepository.js';
import { MateriasRepository } from '../Repository/materiasRepository.js';
import { autenticar } from "../Middlewares/authMiddleware.js";
import { autorizarRoles } from "../Middlewares/permissionMiddleware.js";

const alunoMateriaRoutes = express.Router();
const repository = new AlunoMateriaRepository();
const repositoryUser = new UserRepository();
const repositoryMateria = new MateriasRepository();

alunoMateriaRoutes.get('/aluno/:matricula', autenticar, async (req, res) => {
    try {
        const matricula_aluno = req.params.matricula;

        const aluno_existe = await repositoryUser.buscarUserByMatricula(matricula_aluno);

        if (aluno_existe.length === 0) {
            console.log("Aluno não cadastrado")
            return res.status(404).json({
                mensagem: "Aluno não cadastrado"
            })
        }

        if (aluno_existe[0].role !== "ALUNO") {
            console.log("Essa matrícula não pertence a um aluno");
            return res.status(404).json({
                mensagem: "Essa matrícula não pertence a um aluno"
            })
        }

        const aluno_materia = await repository.listarMateriasDoAluno(matricula_aluno);
        if (aluno_materia.length === 0) {
            console.log("Aluno sem nenhuma matéria")
            return res.status(404).json({
                mensagem: "Aluno sem nenhuma matéria"
            })
        }
        return res.status(200).json(aluno_materia);

    }
    catch (err) {
        console.log(`Erro: ${err}`)
        return res.status(500).json({
            mensagem: "Erro ao buscar matérias do aluno"
        })
    }
});

alunoMateriaRoutes.get('/materia/:id', autenticar, async (req, res) => {
    try {

        const materia_id = req.params.id;

        const materia_existe = await repositoryMateria.listarMateriaById(materia_id);
        if (materia_existe.length === 0) {
            console.log("Matéria não existe");
            return res.status(404).json({
                mensagem: "Matéria não existe"
            })
        }

        const materia_aluno = await repository.listarAlunosDaMateria(materia_id);
        if (materia_aluno.length === 0) {
            console.log("Matéria sem aluno")
            return res.status(404).json({
                mensagem: "Matéria sem aluno"
            })
        }

        return res.status(200).json({ materia_aluno })

    } catch (err) {
        console.log(`Erro: ${err}`)
        return res.status(500).json({
            mensagem: "Erro ao buscar matérias ligadas a alunos"
        })
    }
});

alunoMateriaRoutes.post('/', autenticar, autorizarRoles("ALUNO", "ADMINISTRADOR"), async (req, res) => {

    try {
        const matricula = req.usuario.matricula;
        const { materia_id } = req.body;

        if (!materia_id) {
            console.log("Erro, insira a matrícula e o id da matéria");
            return res.status(404).json({
                mensagem: "Erro, insira a matrícula e o id da matéria"
            })
        }

        await repository.adicionarAlunoMateria(matricula, materia_id);

        return res.status(201).json({
            mensagem: "Aluno cadastrado na matéria com sucesso"
        })
    }
    catch (err) {
        console.log(`Erro ao vincular aluno com matéria: ${err}`)
        return res.status(500).json({
            mensagem: "Erro ao vincular aluno com matéria"
        })
    }
});

alunoMateriaRoutes.delete('/:matricula/:materia_id', autenticar, autorizarRoles("ADMINISTRADOR"), async (req, res) => {
    try {
        const { matricula, materia_id } = req.params;

        if (!matricula || !materia_id) {
            console.log("Infome a matrícula e o id da matéria");
            return res.status(400).json({
                mensagem: "Informe a matrícula e o id da matéria"
            })
        }

        const resultado = await repository.deletarAlunoMateria(matricula, materia_id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Erro ao deletar"
            })
        }

        return res.status(204).send();
    }
    catch (err) {
        console.log(`Erro ao deletar aluno da matéria: ${err}`)
        return res.status(500).json({
            mensagem: "Erro ao deletar o aluno da matéria"
        })
    }
});

alunoMateriaRoutes.delete('/:materia_id', autenticar, async (req, res) => {
    try {
        const materia_id = req.params.materia_id;
        const matricula = req.usuario.matricula;

        if (!materia_id) {
            console.log("Infome o id da matéria");
            return res.status(400).json({
                mensagem: "Informe a matrícula e o id da matéria"
            })
        }

        const resultado = await repository.deletarAlunoMateria(matricula, materia_id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Erro ao deletar"
            })
        }

        return res.status(204).send();
    }
    catch (err) {
        console.log(`Erro ao deletar aluno da matéria: ${err}`)
        return res.status(500).json({
            mensagem: "Erro ao deletar o aluno da matéria"
        })
    }
});

export default alunoMateriaRoutes;