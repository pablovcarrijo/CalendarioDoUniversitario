function AdminOverview({ usuarios, materias, atividades, onMudar }) {
  const alunos = usuarios.filter((user) => user.role === "ALUNO").length;
  const professores = usuarios.filter(
    (user) => user.role === "PROFESSOR",
  ).length;
  const cards = [
    ["Alunos", alunos, "usuarios"],
    ["Professores", professores, "usuarios"],
    ["Matérias", materias.length, "materias"],
    ["Atividades", atividades.length, "atividades"],
  ];
  return (
    <section className="admin-overview">
      <div className="admin-welcome">
        <h2>Visão geral</h2>
        <p>Acompanhe e acesse rapidamente os cadastros do sistema.</p>
      </div>
      <div className="admin-metrics">
        {cards.map(([nome, total, aba]) => (
          <button type="button" key={nome} onClick={() => onMudar(aba)}>
            <strong>{total}</strong>
            <span>{nome}</span>
            <small>Gerenciar →</small>
          </button>
        ))}
      </div>
    </section>
  );
}
export default AdminOverview;
