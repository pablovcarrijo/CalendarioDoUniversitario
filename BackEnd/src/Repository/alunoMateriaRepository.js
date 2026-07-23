import prisma from '../Config/db.js';

export class AlunoMateriaRepository {
    async listarMateriasDoAluno(aluno_matricula) {
        const vinculos = await prisma.aluno_materia.findMany({
            where: { aluno_matricula },
            include: {
                usuario: { select: { id: true, nome: true, matricula: true } },
                materia: {
                    include: { usuario: { select: { nome: true } } }
                }
            }
        });

        return vinculos.map((vinculo) => ({
            vinculo_id: vinculo.id,
            aluno_id: vinculo.usuario.id,
            aluno_nome: vinculo.usuario.nome,
            aluno_matricula: vinculo.usuario.matricula,
            materia_id: vinculo.materia.id,
            materia_nome: vinculo.materia.nome,
            descricao: vinculo.materia.descricao,
            professor_id: vinculo.materia.professor_id,
            professor_nome: vinculo.materia.usuario.nome
        }));
    }

    async listarAlunosDaMateria(materia_id) {
        const vinculos = await prisma.aluno_materia.findMany({
            where: { materia_id: Number(materia_id) },
            include: {
                usuario: { select: { id: true, nome: true, email: true, matricula: true, role: true } }
            }
        });

        return vinculos.map((vinculo) => ({
            vinculo_id: vinculo.id,
            aluno_id: vinculo.usuario.id,
            nome: vinculo.usuario.nome,
            email: vinculo.usuario.email,
            matricula: vinculo.usuario.matricula,
            role: vinculo.usuario.role
        }));
    }

    async adicionarAlunoMateria(matricula, materia_id) {
        const vinculo = await prisma.aluno_materia.create({
            data: { aluno_matricula: matricula, materia_id: Number(materia_id) }
        });
        return { insertId: vinculo.id, affectedRows: 1 };
    }

    async deletarAlunoMateria(matricula, materia_id) {
        const resultado = await prisma.aluno_materia.deleteMany({
            where: { aluno_matricula: matricula, materia_id: Number(materia_id) }
        });
        return { affectedRows: resultado.count };
    }
}
