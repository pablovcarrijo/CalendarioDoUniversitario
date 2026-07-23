import prisma from '../Config/db.js';

const formatarMateria = (materia) => ({
    id: materia.id,
    nome: materia.nome,
    descricao: materia.descricao,
    professor_id: materia.professor_id,
    professor_nome: materia.usuario.nome
});

const consultaMateria = {
    include: { usuario: { select: { nome: true } } }
};

export class MateriasRepository {
    async listarMaterias() {
        const materias = await prisma.materia.findMany(consultaMateria);
        return materias.map(formatarMateria);
    }

    async listarMateriaByNome(nome) {
        const materias = await prisma.materia.findMany({ ...consultaMateria, where: { nome } });
        return materias.map(formatarMateria);
    }

    async listarMateriaById(id) {
        const materia = await prisma.materia.findUnique({ ...consultaMateria, where: { id: Number(id) } });
        return materia ? [formatarMateria(materia)] : [];
    }

    async adicionarMateria(nome, descricao, professor_id) {
        return prisma.materia.create({
            data: { nome, descricao, professor_id: Number(professor_id) },
            select: { id: true, nome: true, descricao: true, professor_id: true }
        });
    }

    async alterarMateria(id, nome, descricao) {
        await prisma.materia.update({ where: { id: Number(id) }, data: { nome, descricao } });
        return { affectedRows: 1 };
    }

    async deletarMateria(id) {
        const resultado = await prisma.materia.deleteMany({ where: { id: Number(id) } });
        return { affectedRows: resultado.count };
    }
}
