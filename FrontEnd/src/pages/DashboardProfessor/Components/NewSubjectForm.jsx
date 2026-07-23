function NewSubjectForm({ dados, salvando, onAlterar, onSalvar, onCancelar }) {
  return (
    <section className="professor-form-card">
      <div className="section-heading">
        <span>Nova matéria</span>
        <h2>Cadastre uma disciplina</h2>
        <p>Ela aparecerá imediatamente no seu painel.</p>
      </div>
      <form className="professor-form" onSubmit={onSalvar}>
        <label>
          Nome da matéria
          <input required value={dados.nome} onChange={(event) => onAlterar({ ...dados, nome: event.target.value })} placeholder="Ex.: Programação Web" />
        </label>
        <label>
          Descrição
          <textarea value={dados.descricao} onChange={(event) => onAlterar({ ...dados, descricao: event.target.value })} placeholder="Descreva o conteúdo da matéria" rows="5" />
        </label>
        <div className="form-actions">
          <button type="button" className="secondary-professor-button" onClick={onCancelar}>Cancelar</button>
          <button type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Cadastrar matéria"}</button>
        </div>
      </form>
    </section>
  );
}

export default NewSubjectForm;
