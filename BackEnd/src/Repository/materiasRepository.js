import pool from '../Config/db.js';

export class MateriasRepository {

    async listarMaterias() {
        const [materias] = await pool.query(`
                SELECT 
                    materia.id, materia.nome, materia.descricao, materia.professor_id,
                    usuario.nome AS professor_nome
                FROM materia
                INNER JOIN usuario ON usuario.id = materia.professor_id    
            `);
        return materias;
    }

    async listarMateriaByNome(nome) {
        const [materias] = await pool.query(`
            SELECT 
                materia.id,
                materia.nome,
                materia.descricao,
                materia.professor_id,
                usuario.nome AS professor_nome
            FROM materia
            INNER JOIN usuario ON usuario.id = materia.professor_id
            WHERE materia.nome = ?
            `, [nome]);

        return materias;
    }

    async listarMateriaById(id) {
        const [materias] = await pool.query(`
            SELECT 
                materia.id,
                materia.nome,
                materia.descricao,
                materia.professor_id,
                usuario.nome AS professor_nome
            FROM materia
            INNER JOIN usuario ON usuario.id = materia.professor_id
            WHERE materia.id = ?
            `, [id]);

        return materias;
    }

    async adicionarMateria(nome, descricao, professor_id) {
        const [resultado] = await pool.query (`
            INSERT INTO materia (nome, descricao, professor_id)
            VALUES (?, ?, ?)            
        `, [nome, descricao, professor_id]);
        return {
            id: resultado.insertId,
            nome: nome, 
            descricao: descricao,
            professor_id: professor_id
        };
    }

    async alterarMateria(id, nome, descricao){
        const [resultado] = await pool.query(`
            UPDATE materia SET nome = ?, descricao = ? WHERE id = ?     
        `, [nome, descricao, id])
        return resultado;
    }

    async deletarMateria(id){
        const [resultado] = await pool.query(`
            DELETE FROM materia WHERE id = ?
        `, [id])
        return resultado;
    }
}

