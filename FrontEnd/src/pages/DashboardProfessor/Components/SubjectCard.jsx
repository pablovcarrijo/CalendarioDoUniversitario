import ActivityForm from "./ActivityForm.jsx";

function formatarData(valor) {
  if (!valor) return "Data não informada";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return valor;
  return data.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SubjectCard({
  materia,
  atividades,
  aberta,
  formularioAberto,
  novaAtividade,
  salvando,
  excluindoAtividadeId,
  excluindoMateria,
  editandoMateria,
  editandoAtividadeId,
  salvandoEdicaoId,
  edicaoMateria,
  edicaoAtividade,
  onAlternar,
  onAbrirFormulario,
  onAlterarAtividade,
  onSalvarAtividade,
  onCancelarAtividade,
  onExcluirAtividade,
  onExcluirMateria,
  onIniciarEdicaoMateria,
  onAlterarEdicaoMateria,
  onSalvarEdicaoMateria,
  onCancelarEdicaoMateria,
  onIniciarEdicaoAtividade,
  onAlterarEdicaoAtividade,
  onSalvarEdicaoAtividade,
  onCancelarEdicaoAtividade,
}) {
  return (
    <article className="professor-subject-card">
      <button
        type="button"
        className="subject-card-header"
        onClick={onAlternar}
        aria-expanded={aberta}
      >
        <span className="professor-subject-icon">
          {materia.nome?.charAt(0).toUpperCase()}
        </span>
        <span className="subject-card-copy">
          <strong>{materia.nome}</strong>
          <small>{materia.descricao || "Sem descrição"}</small>
        </span>
        <span className="activity-count">
          {atividades.length} {atividades.length === 1 ? "atividade" : "atividades"}
        </span>
        <span className="expand-icon">{aberta ? "⬆️" : "⬇️"}</span>
      </button>
      <div className="subject-card-actions">
        <button type="button" className="edit-subject-button" onClick={onIniciarEdicaoMateria}>
          Editar
        </button>
        <button
          type="button"
          className="delete-subject-button"
          onClick={onExcluirMateria}
          disabled={excluindoMateria}
          aria-label={`Excluir matéria ${materia.nome}`}
          title="Excluir matéria"
        >
          {excluindoMateria ? "…" : "×"}
        </button>
      </div>

      {editandoMateria && (
        <form className="activity-form subject-edit-form" onSubmit={onSalvarEdicaoMateria}>
          <label>
            Nome da matéria
            <input
              required
              value={edicaoMateria.nome}
              onChange={(event) =>
                onAlterarEdicaoMateria({ ...edicaoMateria, nome: event.target.value })
              }
            />
          </label>
          <label className="full-field">
            Descrição
            <textarea
              rows="3"
              value={edicaoMateria.descricao}
              onChange={(event) =>
                onAlterarEdicaoMateria({ ...edicaoMateria, descricao: event.target.value })
              }
            />
          </label>
          <div className="activity-form-actions full-field">
            <button type="button" className="secondary-professor-button" onClick={onCancelarEdicaoMateria}>
              Cancelar
            </button>
            <button type="submit" disabled={salvandoEdicaoId === `materia-${materia.id}`}>
              {salvandoEdicaoId === `materia-${materia.id}` ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      )}

      {aberta && (
        <div className="subject-card-content">
          <div className="activity-heading">
            <h3>Atividades</h3>
            <button type="button" onClick={onAbrirFormulario}>＋ Cadastrar atividade</button>
          </div>
          {formularioAberto && (
            <ActivityForm
              dados={novaAtividade}
              salvando={salvando}
              onAlterar={onAlterarAtividade}
              onSalvar={onSalvarAtividade}
              onCancelar={onCancelarAtividade}
            />
          )}
          {atividades.length === 0 ? (
            <p className="no-activities">Nenhuma atividade cadastrada nesta matéria.</p>
          ) : (
            <div className="professor-activity-list">
              {atividades.map((atividade) => (
                <article className="professor-activity" key={atividade.id}>
                  <span className="activity-date-icon">✓</span>
                  <div>
                    <h4>{atividade.titulo}</h4>
                    <p>{atividade.descricao || "Sem descrição"}</p>
                  </div>
                  <time>{formatarData(atividade.data_entrega)}</time>
                  <div className="professor-activity-actions">
                    <button
                      type="button"
                      className="edit-activity-button"
                      onClick={() => onIniciarEdicaoAtividade(atividade)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="delete-activity-button"
                      onClick={() => onExcluirAtividade(atividade)}
                      disabled={excluindoAtividadeId === atividade.id}
                      aria-label={`Excluir atividade ${atividade.titulo}`}
                      title="Excluir atividade"
                    >
                      {excluindoAtividadeId === atividade.id ? "…" : "×"}
                    </button>
                  </div>
                  {editandoAtividadeId === atividade.id && (
                    <div className="activity-edit-row">
                      <ActivityForm
                        dados={edicaoAtividade}
                        salvando={salvandoEdicaoId === `atividade-${atividade.id}`}
                        onAlterar={onAlterarEdicaoAtividade}
                        onSalvar={(event) => onSalvarEdicaoAtividade(event, atividade)}
                        onCancelar={onCancelarEdicaoAtividade}
                      />
                    </div>
                  )}
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
