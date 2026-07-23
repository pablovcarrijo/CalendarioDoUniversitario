import SubjectCard from "./SubjectCard.jsx";

function ProfessorSubjects({
  materias,
  atividadesPorMateria,
  materiaAberta,
  formularioAtividade,
  novaAtividade,
  salvandoAtividadeId,
  onCadastrarPrimeira,
  onAlternarMateria,
  onAbrirFormulario,
  onAlterarAtividade,
  onSalvarAtividade,
  onCancelarAtividade,
}) {
  if (materias.length === 0) {
    return (
      <section className="professor-empty">
        <span>📚</span>
        <h2>Nenhuma matéria cadastrada</h2>
        <p>Crie sua primeira matéria para começar a adicionar atividades.</p>
        <button type="button" onClick={onCadastrarPrimeira}>
          Cadastrar primeira matéria
        </button>
      </section>
    );
  }

  return (
    <section className="professor-subjects">
      <div className="professor-summary">
        <div>
          <strong>{materias.length}</strong>
          <span>Matérias</span>
        </div>
        <div>
          <strong>{Object.values(atividadesPorMateria).flat().length}</strong>
          <span>Atividades</span>
        </div>
      </div>
      {materias.map((materia) => (
        <SubjectCard
          key={materia.id}
          materia={materia}
          atividades={atividadesPorMateria[materia.id] || []}
          aberta={materiaAberta === materia.id}
          formularioAberto={formularioAtividade === materia.id}
          novaAtividade={novaAtividade}
          salvando={salvandoAtividadeId === materia.id}
          onAlternar={() => onAlternarMateria(materia.id)}
          onAbrirFormulario={() => onAbrirFormulario(materia.id)}
          onAlterarAtividade={onAlterarAtividade}
          onSalvarAtividade={(event) => onSalvarAtividade(event, materia.id)}
          onCancelarAtividade={onCancelarAtividade}
        />
      ))}
    </section>
  );
}

export default ProfessorSubjects;
