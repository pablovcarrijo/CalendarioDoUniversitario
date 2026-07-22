import pool from '../Config/db.js';

export class AtividadesRepository {

    async listarAtividades() {

        const [atividades] = await pool.query(`
            
            SELECT 
                atividade.id,
                atividade.titulo,
                atividade.descricao,
                atividade.data_entrega,
                materia.nome,
                atividade.materia_id,
                atividade.criado_em
            FROM atividade
            INNER JOIN materia ON materia.id = atividade.materia_id            
        `);

        return atividades;

    }

    async listarAtividadesDoAluno(alunoMatricula, materiaId = null) {
        let sql = `
        SELECT
            atividade.id,
            atividade.titulo,
            atividade.descricao,
            atividade.data_entrega,
            materia.nome,
            atividade.materia_id,
            atividade.criado_em
        FROM atividade

        INNER JOIN materia
            ON materia.id = atividade.materia_id

        INNER JOIN aluno_materia
            ON aluno_materia.materia_id = materia.id

        WHERE aluno_materia.aluno_matricula = ?
    `;

        const parametros = [alunoMatricula];

        if (materiaId) {
            sql += ` AND materia.id = ?`;
            parametros.push(materiaId);
        }

        sql += ` ORDER BY atividade.data_entrega ASC`;

        const [atividades] = await pool.query(sql, parametros);

        return atividades;
    }

    async listarAtividadePorMateria(materiaId) {
        const [atividades] = await pool.query(`
            SELECT
                atividade.id,
                atividade.titulo,
                atividade.descricao,
                atividade.data_entrega,
                materia.nome,
                atividade.materia_id,
                atividade.criado_em
            FROM atividade
            INNER JOIN materia ON materia.id = atividade.materia_id
            WHERE materia.id = ?`, [materiaId]);

        return atividades;
    }

    async listarAtividadePorId(id) {
        const [atividade] = await pool.query(
            `
        SELECT 
            atividade.id,
            atividade.titulo,
            atividade.descricao,
            atividade.data_entrega,
            materia.nome AS materia_nome,
            atividade.materia_id,
            atividade.criado_em
        FROM atividade
        INNER JOIN materia ON materia.id = atividade.materia_id
        WHERE atividade.id = ?
        `,
            [id]
        );

        return atividade;
    }

    async adicionarAtividadeMateria(titulo, descricao, data_entrega, materia_id) {
        const [atividade] = await pool.query(
            `INSERT INTO atividade (titulo, descricao, data_entrega, materia_id)
            VALUES (?, ?, ?, ?)`, [titulo, descricao, data_entrega, materia_id]
        );

        const [resultado] = await pool.query(
            `SELECT
                id, titulo, descricao, data_entrega, materia_id, criado_em
            FROM atividade
            WHERE id = ?`, [atividade.insertId]
        );

        return resultado[0];
    }

    async alterarAtividade(id, titulo, descricao, data_entrega, materia_id) {

        const [atividade] = await pool.query(
            `UPDATE atividade SET
                titulo = ?, descricao = ?, data_entrega = ?, materia_id = ?
            WHERE id = ?`, [titulo, descricao, data_entrega, materia_id, id]
        );

        return atividade;
    }

    async deletarAtividade(atividadeId) {
        const [resultado] = await pool.query(`
            DELETE FROM atividade WHERE atividade.id = ?`, [atividadeId]
        );
        return resultado
    }

}