const abas = [
  ["visao", "Visão geral"],
  ["usuarios", "Usuários"],
  ["materias", "Matérias"],
  ["atividades", "Atividades"],
];
function AdminNav({ abaAtiva, onMudar }) {
  return (
    <nav className="admin-nav">
      {abas.map(([id, nome]) => (
        <button
          type="button"
          key={id}
          className={abaAtiva === id ? "active" : ""}
          onClick={() => onMudar(id)}
        >
          {nome}
        </button>
      ))}
    </nav>
  );
}
export default AdminNav;
