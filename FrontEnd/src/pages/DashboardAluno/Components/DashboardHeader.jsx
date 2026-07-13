function DashboardHeader({
  usuario,
  menuAberto,
  onAlternarMenu,
  onLogout,
}) {
  return (
    <header className="dashboard-header">
      <div className="dashboard-title-area">
        <div>
          <h1>Dashboard do Aluno</h1>
          <p>Organize sua rotina acadêmica</p>
        </div>
      </div>

      <div className="student-area">
        <div className="student-avatar">
          {usuario?.nome?.charAt(0)?.toUpperCase() || "A"}
        </div>

        <div className="student-info">
          <strong>{usuario?.nome || "Aluno"}</strong>
          <span>Aluno</span>
        </div>

        <button
          className="logout-button"
          type="button"
          onClick={onLogout}
        >
          <span>↪</span>
          Logout
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;