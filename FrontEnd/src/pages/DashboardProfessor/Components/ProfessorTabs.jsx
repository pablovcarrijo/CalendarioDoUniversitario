function ProfessorTabs({ abaAtiva, onMudarAba }) {
  return (
    <nav className="professor-tabs" aria-label="Seções do painel">
      <button
        type="button"
        className={abaAtiva === "materias" ? "active" : ""}
        onClick={() => onMudarAba("materias")}
      >
        Minhas matérias
      </button>
      <button
        type="button"
        className={abaAtiva === "nova" ? "active" : ""}
        onClick={() => onMudarAba("nova")}
      >
        ＋ Nova matéria
      </button>
    </nav>
  );
}

export default ProfessorTabs;
