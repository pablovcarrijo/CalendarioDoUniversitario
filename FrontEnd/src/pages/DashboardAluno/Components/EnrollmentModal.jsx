import { useEffect, useRef } from "react";

function EnrollmentModal({
  materias,
  carregando,
  erro,
  matriculandoId,
  onMatricular,
  onFechar,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    function fecharComEscape(event) {
      if (event.key === "Escape" && !matriculandoId) onFechar();
    }

    document.addEventListener("keydown", fecharComEscape);
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", fecharComEscape);
  }, [matriculandoId, onFechar]);

  return (
    <div
      className="enrollment-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !matriculandoId) onFechar();
      }}
    >
      <section
        ref={modalRef}
        className="enrollment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enrollment-modal-title"
        tabIndex="-1"
      >
        <header className="enrollment-modal-header">
          <div>
            <span>Grade disponível</span>
            <h2 id="enrollment-modal-title">Escolha uma matéria</h2>
            <p>Veja as opções e clique em matricular.</p>
          </div>
          <button
            type="button"
            className="close-modal-button"
            onClick={onFechar}
            disabled={Boolean(matriculandoId)}
            aria-label="Fechar janela"
          >
            ×
          </button>
        </header>

        {carregando ? (
          <p className="status-text">Carregando matérias disponíveis...</p>
        ) : erro ? (
          <p className="error-message">{erro}</p>
        ) : materias.length === 0 ? (
          <p className="empty-state">
            Você já está matriculado em todas as matérias disponíveis.
          </p>
        ) : (
          <div className="enrollment-subject-list">
            {materias.map((materia) => (
              <article className="enrollment-subject" key={materia.id}>
                <div>
                  <h3>{materia.nome}</h3>
                  <p>{materia.descricao || "Sem descrição."}</p>
                  <small>
                    Professor: {materia.professor_nome || "Não informado"}
                  </small>
                </div>
                <button
                  type="button"
                  onClick={() => onMatricular(materia)}
                  disabled={Boolean(matriculandoId)}
                >
                  {matriculandoId === materia.id
                    ? "Matriculando..."
                    : "Matricular"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EnrollmentModal;
