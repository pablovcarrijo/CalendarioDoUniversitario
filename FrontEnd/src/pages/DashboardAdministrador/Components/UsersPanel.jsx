import { useMemo, useState } from "react";

function UsersPanel({ usuarios, salvando, onCriar, onExcluir }) {
  const [busca, setBusca] = useState("");
  const [role, setRole] = useState("TODOS");
  const [formAberto, setFormAberto] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    matricula: "",
    senha: "",
    role: "ALUNO",
  });
  const filtrados = useMemo(
    () =>
      usuarios.filter(
        (user) =>
          (role === "TODOS" || user.role === role) &&
          `${user.nome} ${user.email} ${user.matricula}`
            .toLowerCase()
            .includes(busca.toLowerCase()),
      ),
    [usuarios, role, busca],
  );

  async function enviar(event) {
    event.preventDefault();
    const sucesso = await onCriar(form);
    if (sucesso) {
      setForm({ nome: "", email: "", matricula: "", senha: "", role: "ALUNO" });
      setFormAberto(false);
    }
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>Usuários</h2>
          <p>Cadastre, localize e remova alunos e professores.</p>
        </div>
        <button type="button" onClick={() => setFormAberto(!formAberto)}>
          ＋ Novo usuário
        </button>
      </div>
      {formAberto && (
        <form className="admin-form admin-user-form" onSubmit={enviar}>
          <input
            required
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            placeholder="Matrícula"
            value={form.matricula}
            onChange={(e) => setForm({ ...form, matricula: e.target.value })}
          />
          <input
            required
            type="password"
            placeholder="Senha"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="ALUNO">Aluno</option>
            <option value="PROFESSOR">Professor</option>
          </select>
          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-secondary"
              onClick={() => setFormAberto(false)}
            >
              Cancelar
            </button>
            <button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      )}
      <div className="admin-filters">
        <input
          type="search"
          placeholder="Buscar por nome, e-mail ou matrícula"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="TODOS">Todos</option>
          <option value="ALUNO">Alunos</option>
          <option value="PROFESSOR">Professores</option>
          <option value="ADMINISTRADOR">Administradores</option>
        </select>
      </div>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Matrícula</th>
              <th>Perfil</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.nome}</strong>
                </td>
                <td>{user.email}</td>
                <td>{user.matricula}</td>
                <td>
                  <span
                    className={`role-badge role-${user.role.toLowerCase()}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-delete"
                    onClick={() => onExcluir(user)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && (
          <p className="admin-empty">Nenhum usuário encontrado.</p>
        )}
      </div>
    </section>
  );
}
export default UsersPanel;
