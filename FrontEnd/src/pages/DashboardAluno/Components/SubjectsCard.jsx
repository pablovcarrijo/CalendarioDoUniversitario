import { Link } from "react-router-dom";

function SubjectsCard({ materias, carregando }) {
  return (
    <section className="dashboard-card side-card">
      <div className="card-heading-row">
        <h2>
          <span>▤</span>
          Minhas matérias
        </h2>
      </div>

      {carregando ? (<p className="status-text">Carregando matérias...</p>) : materias.length > 0 ? (
        <div className="subject-list">
          {materias.map((materia, index) => (
            <Link
              className="subject-item"
              key={materia.materia_id ?? `${materia.materia_nome}-${index}`}
            >
              <span
                className={`subject-icon subject-color-${index % 4}`}
              >
                {materia.materia_nome?.charAt(0)?.toUpperCase()}
              </span>

              <span>
                <strong>{materia.materia_nome}</strong>

                <small>
                  {materia.professor_nome ||
                    "Professor não informado"}
                </small>
              </span>

            </Link>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          Você ainda não está cadastrado em matérias.
        </p>
      )}
    </section>
  );
}

export default SubjectsCard;