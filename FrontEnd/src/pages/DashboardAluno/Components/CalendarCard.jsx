import { useEffect, useState } from "react";

function CalendarCard({
  dataExibida,
  diasCalendario,
  hoje,
  nomesMeses,
  diasSemana,
  atividadesDoDia,
  mesmaData,
  onMudarMes,
  onVoltarParaHoje,
}) {
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [eventosSelecionados, setEventosSelecionados] = useState([]);

  function abrirDetalhesDoDia(dia, eventos) {
    setDiaSelecionado(dia);
    setEventosSelecionados(eventos);
  }

  function fecharDetalhesDoDia() {
    setDiaSelecionado(null);
    setEventosSelecionados([]);
  }

  function obterNomeMateria(atividade) {
    return (
      atividade.materia_nome ||
      atividade.materia?.nome ||
      atividade.nome ||
      "Matéria não informada"
    );
  }

  /*
    Fecha a janela quando o usuário aperta ESC.
  */
  useEffect(() => {
    function fecharComEscape(evento) {
      if (evento.key === "Escape") {
        fecharDetalhesDoDia();
      }
    }

    window.addEventListener("keydown", fecharComEscape);

    return () => {
      window.removeEventListener("keydown", fecharComEscape);
    };
  }, []);

  return (
    <section className="calendar-card dashboard-card">
      <div className="calendar-toolbar">
        <div className="month-navigation">
          <button
            type="button"
            aria-label="Mês anterior"
            onClick={() => onMudarMes(-1)}
          >
            ‹
          </button>

          <h2>
            {nomesMeses[dataExibida.getMonth()]} {dataExibida.getFullYear()}
          </h2>
        </div>

        <div className="calendar-actions">
          <button type="button" onClick={onVoltarParaHoje}>
            Hoje
          </button>

          <button
            type="button"
            aria-label="Próximo mês"
            onClick={() => onMudarMes(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="week-header">
        {diasSemana.map((dia) => (
          <span key={dia}>{dia}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {diasCalendario.map((dia) => {
          const eventos = atividadesDoDia(dia);

          const pertenceAoMes = dia.getMonth() === dataExibida.getMonth();

          const ehHoje = mesmaData(dia, hoje);

          const classes = [
            "calendar-day",
            !pertenceAoMes ? "outside-month" : "",
            ehHoje ? "today" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              type="button"
              className={classes}
              key={dia.toISOString()}
              onClick={() => abrirDetalhesDoDia(dia, eventos)}
              aria-label={`Abrir compromissos do dia ${dia.toLocaleDateString(
                "pt-BR",
              )}`}
            >
              <span className="day-number">{dia.getDate()}</span>

              <span className="day-events">
                {eventos.slice(0, 2).map((atividade, index) => (
                  <span
                    className="calendar-event-preview"
                    key={atividade.id ?? `${atividade.titulo}-${index}`}
                  >
                    <strong>{atividade.titulo}</strong>

                    <small>{obterNomeMateria(atividade)}</small>
                  </span>
                ))}

                {eventos.length > 2 && (
                  <span className="more-events">
                    +{eventos.length - 2} evento(s)
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {diaSelecionado && (
        <div
          className="day-modal-overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              fecharDetalhesDoDia();
            }
          }}
        >
          <section
            className="day-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="day-modal-title"
          >
            <header className="day-modal-header">
              <div>
                <span>Compromissos</span>

                <h2 id="day-modal-title">
                  {diaSelecionado.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
              </div>

              <button
                type="button"
                className="close-modal-button"
                aria-label="Fechar janela"
                onClick={fecharDetalhesDoDia}
              >
                ×
              </button>
            </header>

            {eventosSelecionados.length === 0 ? (
              <p className="empty-state">Nenhum compromisso nesse dia.</p>
            ) : (
              <div className="day-modal-events">
                {eventosSelecionados.map((atividade, index) => (
                  <article
                    className="day-modal-event"
                    key={atividade.id ?? `${atividade.titulo}-${index}`}
                  >
                    <span className="event-subject">
                      {obterNomeMateria(atividade)}
                    </span>

                    <h3>{atividade.titulo}</h3>

                    <p>
                      {atividade.descricao ||
                        "Essa atividade não possui descrição."}
                    </p>

                    {atividade.tipo && <small>Tipo: {atividade.tipo}</small>}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

export default CalendarCard;
