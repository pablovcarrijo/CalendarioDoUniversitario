import { useMemo, useState } from "react";
function ActivitiesPanel({
  atividades,
  materias,
  salvando,
  onCriar,
  onExcluir,
}) {
  const [busca, setBusca] = useState("");
  const [materiaFiltro, setMateriaFiltro] = useState("TODAS");
  const [formAberto, setFormAberto] = useState(false);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    data_entrega: "",
    materia_id: "",
  });
  const filtradas = useMemo(
    () =>
      atividades.filter(
        (a) =>
          (materiaFiltro === "TODAS" ||
            String(a.materia_id) === materiaFiltro) &&
          `${a.titulo} ${a.descricao} ${a.nome}`
            .toLowerCase()
            .includes(busca.toLowerCase()),
      ),
    [atividades, busca, materiaFiltro],
  );
  async function enviar(event) {
    event.preventDefault();
    const sucesso = await onCriar({
      ...form,
      materia_id: Number(form.materia_id),
    });
    if (sucesso) {
      setForm({ titulo: "", descricao: "", data_entrega: "", materia_id: "" });
      setFormAberto(false);
    }
  }
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>Atividades</h2>
          <p>Gerencie atividades de qualquer matéria.</p>
        </div>
        <button type="button" onClick={() => setFormAberto(!formAberto)}>
          ＋ Nova atividade
        </button>
      </div>
      {formAberto && (
        <form className="admin-form admin-activity-form" onSubmit={enviar}>
          <input
            required
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
          <select
            required
            value={form.materia_id}
            onChange={(e) => setForm({ ...form, materia_id: e.target.value })}
          >
            <option value="">Selecione a matéria</option>
            {materias.map((m) => (
              <option value={m.id} key={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
          <input
            required
            type="date"
            value={form.data_entrega}
            onChange={(e) => setForm({ ...form, data_entrega: e.target.value })}
          />
          <textarea
            rows="3"
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
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
          placeholder="Buscar atividade ou matéria"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          value={materiaFiltro}
          onChange={(e) => setMateriaFiltro(e.target.value)}
        >
          <option value="TODAS">Todas as matérias</option>
          {materias.map((m) => (
            <option value={String(m.id)} key={m.id}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-card-grid">
        {filtradas.map((a) => (
          <article className="admin-data-card" key={a.id}>
            <span className="admin-card-icon activity">✓</span>
            <div>
              <h3>{a.titulo}</h3>
              <p>{a.descricao || "Sem descrição"}</p>
              <small>
                {a.nome} ·{" "}
                {new Date(a.data_entrega).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
              </small>
            </div>
            <button
              type="button"
              className="admin-delete"
              onClick={() => onExcluir(a)}
            >
              Excluir
            </button>
          </article>
        ))}
      </div>
      {filtradas.length === 0 && (
        <p className="admin-empty">Nenhuma atividade encontrada.</p>
      )}
    </section>
  );
}
export default ActivitiesPanel;
