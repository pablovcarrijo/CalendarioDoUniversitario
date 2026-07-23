import prisma from '../Config/db.js';

const formatarAtividade = (atividade, materiaNome = 'nome') => ({
    id: atividade.id,
    titulo: atividade.titulo,
    descricao: atividade.descricao,
    data_entrega: atividade.data_entrega,
    [materiaNome]: atividade.materia.nome,
    materia_id: atividade.materia_id,
    criado_em: atividade.criado_em
});

const comMateria = { materia: { select: { nome: true } } };

export class AtividadesRepository {
    async listarAtividades() {
        const atividades = await prisma.atividade.findMany({ include: comMateria });
        return atividades.map((atividade) => formatarAtividade(atividade));
    }

    async listarAtividadesDoAluno(alunoMatricula, materiaId = null) {
        const atividades = await prisma.atividade.findMany({
            where: {
                ...(materiaId ? { materia_id: Number(materiaId) } : {}),
                materia: { aluno_materia: { some: { aluno_matricula: alunoMatricula } } }
            },
            include: comMateria,
            orderBy: { data_entrega: 'asc' }
        });
        return atividades.map((atividade) => formatarAtividade(atividade));
    }

    async listarAtividadePorMateria(materiaId) {
        const atividades = await prisma.atividade.findMany({
            where: { materia_id: Number(materiaId) },
            include: comMateria
        });
        return atividades.map((atividade) => formatarAtividade(atividade));
    }

    async listarAtividadePorId(id) {
        const atividade = await prisma.atividade.findUnique({
            where: { id: Number(id) },
            include: comMateria
        });
        return atividade ? [formatarAtividade(atividade, 'materia_nome')] : [];
    }

    async adicionarAtividadeMateria(titulo, descricao, data_entrega, materia_id) {
        return prisma.atividade.create({
            data: {
                titulo,
                descricao,
                data_entrega: new Date(data_entrega),
                materia_id: Number(materia_id)
            },
            select: {
                id: true, titulo: true, descricao: true, data_entrega: true,
                materia_id: true, criado_em: true
            }
        });
    }

    async alterarAtividade(id, titulo, descricao, data_entrega, materia_id) {
        await prisma.atividade.update({
            where: { id: Number(id) },
            data: {
                titulo,
                descricao,
                data_entrega: new Date(data_entrega),
                materia_id: Number(materia_id)
            }
        });
        return { affectedRows: 1 };
    }

    async deletarAtividade(atividadeId) {
        const resultado = await prisma.atividade.deleteMany({ where: { id: Number(atividadeId) } });
        return { affectedRows: resultado.count };
    }
}
