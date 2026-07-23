import prisma from '../Config/db.js';

const dadosPublicos = { id: true, nome: true, email: true, matricula: true, role: true };
const dadosComSenha = { ...dadosPublicos, senha: true };

export class UserRepository {
    async listarUsersByRole(role) {
        if (role && !['ALUNO', 'PROFESSOR', 'ADMINISTRADOR'].includes(role)) {
            return [];
        }

        return prisma.usuario.findMany({
            where: role ? { role } : undefined,
            select: dadosPublicos
        });
    }

    async listarUsers() {
        return prisma.usuario.findMany({ select: dadosPublicos });
    }

    async buscarUserByMatricula(matricula) {
        const user = await prisma.usuario.findUnique({ where: { matricula }, select: dadosPublicos });
        return user ? [user] : [];
    }

    async buscarUserById(id) {
        const user = await prisma.usuario.findUnique({ where: { id: Number(id) }, select: dadosComSenha });
        return user ? [user] : [];
    }

    async buscarUserByEmail(email) {
        const user = await prisma.usuario.findUnique({ where: { email }, select: dadosComSenha });
        return user ? [user] : [];
    }

    async adicionarUser(nome, email, matricula, senha, role) {
        return prisma.usuario.create({
            data: { nome, email, matricula, senha, role },
            select: dadosPublicos
        });
    }

    async alterarUser(id, nome, email, matricula, senha, role) {
        await prisma.usuario.update({
            where: { id: Number(id) },
            data: { nome, email, matricula, senha, role }
        });
        return { affectedRows: 1 };
    }

    async deletarUserByMatricula(matricula) {
        const resultado = await prisma.usuario.deleteMany({ where: { matricula } });
        return { affectedRows: resultado.count };
    }
}
