import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api.js";

function Atividades() {
  const [atividades, setAtividades] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAtividades() {
      try {
        const data = await apiFetch("/atividades");
        setAtividades(data.resultado);
      } catch (error) {
        setErro(error.message);
      }
    }

    carregarAtividades();
  }, []);

  return (
    <main>
      <h1>Atividades</h1>

      {erro && <p>{erro}</p>}

      <ul>
        {atividades.map((atividade) => (
          <li key={atividade.id}>
            <strong>{atividade.titulo}</strong>
            <br />
            {atividade.descricao}
            <br />
            Entrega: {atividade.data_entrega}
            <br />
            Matéria: {atividade.nome}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Atividades;