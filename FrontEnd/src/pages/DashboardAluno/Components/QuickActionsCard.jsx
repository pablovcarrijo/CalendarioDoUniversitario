function QuickActionsCard({ onAbrirMatriculas }) {
  return (
    <section className="dashboard-card side-card">
      <h2>
        <span>⚡</span>
        Ações rápidas
      </h2>

      <div className="quick-actions">
        <button type="button" className="quick-action" onClick={onAbrirMatriculas}>
          <span className="action-icon blue-icon">🎓</span>
          <strong>Cadastrar em matéria</strong>
          <span>›</span>
        </button>
      </div>
    </section>
  );
}

export default QuickActionsCard;
