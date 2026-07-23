import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api.js";

function Materias() {
  const [materias, setMaterias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarMaterias() {
      try {
        const resposta = await apiFetch("/materias");
        if (ativo) setMaterias(Array.isArray(resposta) ? resposta : []);
      } catch (error) {
        if (ativo) setErro(error.message || "Não foi possível carregar as matérias.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarMaterias();
    return () => { ativo = false; };
  }, []);

  return (
    <main>
      <h1>Matérias</h1>
      {carregando && <p>Carregando matérias...</p>}
      {erro && <p>{erro}</p>}
      {!carregando && !erro && materias.length === 0 && <p>Nenhuma matéria cadastrada.</p>}
      <ul>
        {materias.map((materia) => (
          <li key={materia.id}>
            <strong>{materia.nome}</strong><br />
            {materia.descricao || "Sem descrição"}<br />
            Professor: {materia.professor_nome || "Não informado"}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Materias;
