import pool from '../Config/db.js'

export class AlunoMateriaRepository {

    async listarMateriasDoAluno(aluno_matricula) {
        const [materias] = await pool.query(`
            SELECT
                aluno_materia.id AS vinculo_id,

                aluno.id AS aluno_id,
                aluno.nome AS aluno_nome,
                aluno.matricula AS aluno_matricula,

                materia.id AS materia_id,
                materia.nome AS materia_nome,
                materia.descricao,
                materia.professor_id,

                professor.nome AS professor_nome
            FROM aluno_materia
            INNER JOIN usuario AS aluno 
                ON aluno.matricula = aluno_materia.aluno_matricula
            INNER JOIN materia 
                ON materia.id = aluno_materia.materia_id
            INNER JOIN usuario AS professor 
                ON professor.id = materia.professor_id
            WHERE aluno_materia.aluno_matricula = ?
        `, [aluno_matricula]);

        return materias;
    }

    async listarAlunosDaMateria(materia_id) {
        const [alunos] = await pool.query(`
            SELECT
                aluno_materia.id AS vinculo_id,
                usuario.id AS aluno_id,
                usuario.nome,
                usuario.email,
                usuario.matricula,
                usuario.role
            FROM aluno_materia
            INNER JOIN usuario ON usuario.matricula = aluno_materia.aluno_matricula
            WHERE aluno_materia.materia_id = ?
        `, [materia_id]);

        return alunos;
    }

    async adicionarAlunoMateria(matricula, materia_id) {

        const [aluno_materia] = await pool.query(
            `INSERT INTO aluno_materia (aluno_matricula, materia_id)
            values (?, ?)`, [matricula, materia_id]
        );
        return aluno_materia;

    }

    async deletarAlunoMateria(matricula, materia_id) {
        const [aluno_materia] = await pool.query(
            `DELETE FROM aluno_materia
            WHERE aluno_matricula = ? AND materia_id = ?`, [matricula, materia_id]
        );
        return aluno_materia;
    }

}