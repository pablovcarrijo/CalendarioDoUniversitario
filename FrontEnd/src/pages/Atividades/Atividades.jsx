import { useEffect, useState } from "react";
import { apiFetch } from "../../api/api.js";

function Atividades() {
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarAtividades() {
      try {
        const resposta = await apiFetch("/atividades");
        const lista = Array.isArray(resposta) ? resposta : resposta?.resultado || [];
        if (ativo) setAtividades(lista);
      } catch (error) {
        if (ativo) setErro(error.message || "Não foi possível carregar as atividades.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarAtividades();
    return () => { ativo = false; };
  }, []);

  return (
    <main>
      <h1>Atividades</h1>
      {carregando && <p>Carregando atividades...</p>}
      {erro && <p>{erro}</p>}
      {!carregando && !erro && atividades.length === 0 && <p>Nenhuma atividade cadastrada.</p>}
      <ul>
        {atividades.map((atividade) => (
          <li key={atividade.id}>
            <strong>{atividade.titulo}</strong><br />
            {atividade.descricao || "Sem descrição"}<br />
            Matéria: {atividade.nome || "Não informada"}<br />
            Entrega: {atividade.data_entrega ? new Date(atividade.data_entrega).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "Não informada"}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Atividades;
