function ProfessorHeader({ usuario, onLogout }) {
  return (
    <header className="professor-header">
      <div>
        <span className="professor-eyebrow">Painel do professor</span>
        <h1>Olá, {usuario.nome}</h1>
        <p>Gerencie suas matérias e atividades em um só lugar.</p>
      </div>
      <button type="button" className="professor-logout" onClick={onLogout}>Sair</button>
    </header>
  );
}

export default ProfessorHeader;
