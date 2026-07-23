function ActivityForm({ dados, salvando, onAlterar, onSalvar, onCancelar }) {
  return (
    <form className="activity-form" onSubmit={onSalvar}>
      <label>
        Título
        <input
          required
          value={dados.titulo}
          onChange={(event) =>
            onAlterar({ ...dados, titulo: event.target.value })
          }
          placeholder="Título da atividade"
        />
      </label>
      <label>
        Data de entrega
        <input
          required
          type="date"
          value={dados.data_entrega}
          onChange={(event) =>
            onAlterar({ ...dados, data_entrega: event.target.value })
          }
        />
      </label>
      <label className="full-field">
        Descrição
        <textarea
          rows="3"
          value={dados.descricao}
          onChange={(event) =>
            onAlterar({ ...dados, descricao: event.target.value })
          }
          placeholder="Orientações para os alunos"
        />
      </label>
      <div className="activity-form-actions full-field">
        <button
          type="button"
          className="secondary-professor-button"
          onClick={onCancelar}
        >
          Cancelar
        </button>
        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar atividade"}
        </button>
      </div>
    </form>
  );
}

export default ActivityForm;
