import { Link } from "react-router-dom";

function QuickActionsCard() {
  return (
    <section className="dashboard-card side-card">
      <h2>
        <span>⚡</span>
        Ações rápidas
      </h2>

      <div className="quick-actions">
        <Link to="/materias" className="quick-action">
          <span className="action-icon blue-icon">🎓</span>
          <strong>Cadastrar em matéria</strong>
          <span>›</span>
        </Link>
      </div>
    </section>
  );
}

export default QuickActionsCard;