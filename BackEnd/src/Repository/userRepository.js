import pool from '../Config/db.js';

export class UserRepository {

    async listarUsersByRole(role) {

        if (role) {
            const [users] = await pool.query(`
            
            SELECT
                id, nome, email, matricula, role
            FROM usuario
            WHERE role = ?`, [role]
            )
            return users;
        }

        const [users] = await pool.query(`
            SELECT
                id, nome, email, matricula, role
            FROM usuario`
        )
        return users;
    }

    async listarUsers(){
        const [users] = await pool.query(`
            SELECT
                id, nome, email, matricula, role
            FROM usuario`
        )
        return users;
    }

    async buscarUserByMatricula(matricula) {
        const [users] = await pool.query(`    
            SELECT 
                id, nome, email, matricula, role FROM usuario
                WHERE matricula = ?`, [matricula]
        )
        return users;
    }

    async buscarUserById(id) {
        const [users] = await pool.query(`    
            SELECT 
                id, nome, email, matricula, senha, role FROM usuario
                WHERE id = ?`, [id]
        )
        return users;
    }

    async buscarUserByEmail(email){
        const [users] = await pool.query(
            `SELECT
                id, nome, email, matricula, senha, role FROM usuario
            WHERE email = ?`, [email]
        )
        return users;
    }

    async adicionarUser(nome, email, matricula, senha, role) {
        const [resultado] = await pool.query(`
            
            INSERT INTO usuario (nome, email, matricula, senha, role)
            VALUES (?, ?, ?, ?, ?)`,[nome, email, matricula, senha, role]
        );

        return {
            id: resultado.insertId,
            nome, email, matricula, role
        } 
    }

    async alterarUser(id, nome, email, matricula, senha, role){
        const [resultado] = await pool.query(`
            
            UPDATE usuario SET nome = ?, email = ?, matricula = ?, senha = ?, role = ?
            WHERE id = ?`, [nome, email, matricula, senha, role, id]
        );
        return resultado;
    }

    async deletarUserByMatricula(matricula) {
        const [resultado] = await pool.query(`
            
            DELETE FROM usuario
            WHERE matricula = ?`, [matricula]
        )
        return resultado;
    }

}