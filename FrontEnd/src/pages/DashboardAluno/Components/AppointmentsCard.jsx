import { Link } from "react-router-dom";

function AppointmentsCard({
  proximosCompromissos,
  carregando,
  erro,
  nomesMeses,
  formatarHorario,
}) {
  return (
    <section className="dashboard-card side-card appointments-card">
      <div className="card-heading-row">
        <h2>
          <span>▣</span>
          Próximos compromissos
        </h2>
      </div>

      {erro && <p className="error-message">{erro}</p>}

      {!carregando && !erro && proximosCompromissos.length === 0 && (
        <p className="empty-state">Nenhum compromisso próximo.</p>
      )}

      <div className="appointment-list">
        {proximosCompromissos.map((atividade, index) => (
          <Link
            to="/atividades"
            className="appointment-item"
            key={atividade.id ?? `${atividade.titulo}-${index}`}
          >
            <div className="appointment-date">
              <strong>
                {String(atividade.dataFormatada.getDate()).padStart(2, "0")}
              </strong>

              <span>
                {nomesMeses[atividade.dataFormatada.getMonth()]
                  .slice(0, 3)
                  .toUpperCase()}
              </span>
            </div>

            <i className="appointment-dot" />

            <div className="appointment-details">
              <strong>{atividade.titulo}</strong>

              <span>
                {atividade.nome || "Atividade"} •{" "}
                {formatarHorario(atividade.dataFormatada)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default AppointmentsCard;
