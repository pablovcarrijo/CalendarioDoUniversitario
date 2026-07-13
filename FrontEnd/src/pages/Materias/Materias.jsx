import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api.js";

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarMaterias() {
      try {
        const data = await apiFetch("/materias");
        setMaterias(data);
      } catch (error) {
        setErro(error.message);
      }
    }

    carregarMaterias();
  }, []);

  return (
    <main>
      <h1>Matérias</h1>

      {erro && <p>{erro}</p>}

      <ul>
        {materias.map((materia) => (
          <li key={materia.id}>
            <strong>{materia.nome}</strong>
            <br />
            {materia.descricao}
            <br />
            Professor: {materia.professor_nome}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Materias;