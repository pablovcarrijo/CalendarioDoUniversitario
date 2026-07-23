import { useMemo, useState } from "react";
function SubjectsPanel({
  materias,
  professores,
  salvando,
  onCriar,
  onExcluir,
}) {
  const [busca, setBusca] = useState("");
  const [formAberto, setFormAberto] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    professor_id: "",
  });
  const filtradas = useMemo(
    () =>
      materias.filter((m) =>
        `${m.nome} ${m.descricao} ${m.professor_nome}`
          .toLowerCase()
          .includes(busca.toLowerCase()),
      ),
    [materias, busca],
  );
  async function enviar(event) {
    event.preventDefault();
    const sucesso = await onCriar(form);
    if (sucesso) {
      setForm({ nome: "", descricao: "", professor_id: "" });
      setFormAberto(false);
    }
  }
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>Matérias</h2>
          <p>Consulte, cadastre e exclua matérias.</p>
        </div>
        <button type="button" onClick={() => setFormAberto(!formAberto)}>
          ＋ Nova matéria
        </button>
      </div>
      {formAberto && (
        <form className="admin-form" onSubmit={enviar}>
          <input
            required
            placeholder="Nome da matéria"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <select
            required
            value={form.professor_id}
            onChange={(e) => setForm({ ...form, professor_id: e.target.value })}
          >
            <option value="">Selecione o professor responsável</option>
            {professores.map((professor) => (
              <option key={professor.id} value={professor.id}>
                {professor.nome} — {professor.matricula}
              </option>
            ))}
          </select>
          <textarea
            rows="3"
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
          {professores.length === 0 && (
            <p className="admin-form-note">
              Cadastre um professor antes de criar uma matéria.
            </p>
          )}
          <div className="admin-form-actions">
            <button
              type="button"
              className="admin-secondary"
              onClick={() => setFormAberto(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando || professores.length === 0}
            >
              {salvando ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      )}
      <div className="admin-filters">
        <input
          type="search"
          placeholder="Buscar matéria ou professor"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
      <div className="admin-card-grid">
        {filtradas.map((m) => (
          <article className="admin-data-card" key={m.id}>
            <span className="admin-card-icon">
              {m.nome?.charAt(0).toUpperCase()}
            </span>
            <div>
              <h3>{m.nome}</h3>
              <p>{m.descricao || "Sem descrição"}</p>
              <small>Responsável: {m.professor_nome || "Não informado"}</small>
            </div>
            <button
              type="button"
              className="admin-delete"
              onClick={() => onExcluir(m)}
            >
              Excluir
            </button>
          </article>
        ))}
      </div>
      {filtradas.length === 0 && (
        <p className="admin-empty">Nenhuma matéria encontrada.</p>
      )}
    </section>
  );
}
export default SubjectsPanel;
