import ActivityForm from "./ActivityForm.jsx";

function formatarData(valor) {
  if (!valor) return "Data não informada";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;
  return data.toLocaleString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function SubjectCard({ materia, atividades, aberta, formularioAberto, novaAtividade, salvando, onAlternar, onAbrirFormulario, onAlterarAtividade, onSalvarAtividade, onCancelarAtividade }) {
  return (
    <article className="professor-subject-card">
      <button type="button" className="subject-card-header" onClick={onAlternar} aria-expanded={aberta}>
        <span className="professor-subject-icon">{materia.nome?.charAt(0).toUpperCase()}</span>
        <span className="subject-card-copy"><strong>{materia.nome}</strong><small>{materia.descricao || "Sem descrição"}</small></span>
        <span className="activity-count">{atividades.length} {atividades.length === 1 ? "atividade" : "atividades"}</span>
        <span className="expand-icon">{aberta ? "⌃" : "⌄"}</span>
      </button>

      {aberta && (
        <div className="subject-card-content">
          <div className="activity-heading"><h3>Atividades</h3><button type="button" onClick={onAbrirFormulario}>＋ Cadastrar atividade</button></div>
          {formularioAberto && <ActivityForm dados={novaAtividade} salvando={salvando} onAlterar={onAlterarAtividade} onSalvar={onSalvarAtividade} onCancelar={onCancelarAtividade} />}
          {atividades.length === 0 ? (
            <p className="no-activities">Nenhuma atividade cadastrada nesta matéria.</p>
          ) : (
            <div className="professor-activity-list">
              {atividades.map((atividade) => (
                <article className="professor-activity" key={atividade.id}>
                  <span className="activity-date-icon">✓</span>
                  <div><h4>{atividade.titulo}</h4><p>{atividade.descricao || "Sem descrição"}</p></div>
                  <time>{formatarData(atividade.data_entrega)}</time>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default SubjectCard;
