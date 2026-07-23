import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetch } from "../../api/api.js";
import NewSubjectForm from "./Components/NewSubjectForm.jsx";
import ProfessorHeader from "./Components/ProfessorHeader.jsx";
import ProfessorSubjects from "./Components/ProfessorSubjects.jsx";
import ProfessorTabs from "./Components/ProfessorTabs.jsx";
import "./dashboardProfessor.css";

function extrairLista(resposta) {
  if (Array.isArray(resposta)) return resposta;
  if (!resposta || typeof resposta !== "object") return [];
  return (
    [resposta.resultado, resposta.materias, resposta.data].find(
      Array.isArray,
    ) || []
  );
}

function DashboardProfessor() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("materias");
  const [materias, setMaterias] = useState([]);
  const [atividadesPorMateria, setAtividadesPorMateria] = useState({});
  const [materiaAberta, setMateriaAberta] = useState(null);
  const [formularioAtividade, setFormularioAtividade] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [salvandoMateria, setSalvandoMateria] = useState(false);
  const [salvandoAtividadeId, setSalvandoAtividadeId] = useState(null);
  const [novaMateria, setNovaMateria] = useState({ nome: "", descricao: "" });
  const [novaAtividade, setNovaAtividade] = useState({
    titulo: "",
    descricao: "",
    data_entrega: "",
  });

  const carregarDados = useCallback(async (professor) => {
    setCarregando(true);
    setErro("");
    try {
      const todasMaterias = extrairLista(await apiFetch("/materias"));
      const materiasDoProfessor = todasMaterias.filter(
        (materia) => String(materia.professor_id) === String(professor.id),
      );
      const respostasAtividades = await Promise.all(
        materiasDoProfessor.map(async (materia) => {
          const resposta = await apiFetch(`/atividades?materia=${materia.id}`);
          return [materia.id, extrairLista(resposta)];
        }),
      );
      setMaterias(materiasDoProfessor);
      setAtividadesPorMateria(Object.fromEntries(respostasAtividades));
    } catch (error) {
      setErro(error.message || "Não foi possível carregar o painel.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;
    async function iniciar() {
      try {
        const resposta = await apiFetch("/login/me");
        const professor = resposta?.usuario;
        const role = String(professor?.role || "")
          .trim()
          .toUpperCase();
        if (!professor || role !== "PROFESSOR") {
          navigate(role === "ALUNO" ? "/aluno" : "/", { replace: true });
          return;
        }
        if (ativo) {
          setUsuario(professor);
          await carregarDados(professor);
        }
      } catch {
        if (ativo) navigate("/", { replace: true });
      }
    }
    iniciar();
    return () => {
      ativo = false;
    };
  }, [carregarDados, navigate]);

  async function sair() {
    try {
      await apiFetch("/login/logout", { method: "POST" });
    } finally {
      navigate("/", { replace: true });
    }
  }

  async function cadastrarMateria(event) {
    event.preventDefault();
    setSalvandoMateria(true);
    setErro("");
    try {
      await apiFetch("/materias", {
        method: "POST",
        body: JSON.stringify(novaMateria),
      });
      setNovaMateria({ nome: "", descricao: "" });
      await carregarDados(usuario);
      setAbaAtiva("materias");
    } catch (error) {
      setErro(error.message || "Não foi possível cadastrar a matéria.");
    } finally {
      setSalvandoMateria(false);
    }
  }

  function abrirFormularioAtividade(materiaId) {
    setMateriaAberta(materiaId);
    setFormularioAtividade((atual) => (atual === materiaId ? null : materiaId));
    setNovaAtividade({ titulo: "", descricao: "", data_entrega: "" });
    setErro("");
  }

  async function cadastrarAtividade(event, materiaId) {
    event.preventDefault();
    setSalvandoAtividadeId(materiaId);
    setErro("");
    try {
      await apiFetch("/atividades", {
        method: "POST",
        body: JSON.stringify({ ...novaAtividade, materia_id: materiaId }),
      });
      const resposta = await apiFetch(`/atividades?materia=${materiaId}`);
      setAtividadesPorMateria((atuais) => ({
        ...atuais,
        [materiaId]: extrairLista(resposta),
      }));
      setNovaAtividade({ titulo: "", descricao: "", data_entrega: "" });
      setFormularioAtividade(null);
    } catch (error) {
      setErro(error.message || "Não foi possível cadastrar a atividade.");
    } finally {
      setSalvandoAtividadeId(null);
    }
  }

  if (!usuario) {
    return (
      <main className="professor-page">
        <p className="professor-loading">Verificando autenticação...</p>
      </main>
    );
  }

  return (
    <main className="professor-page">
      <ProfessorHeader usuario={usuario} onLogout={sair} />
      <section className="professor-shell">
        <ProfessorTabs abaAtiva={abaAtiva} onMudarAba={setAbaAtiva} />
        {erro && <p className="professor-error">{erro}</p>}
        {abaAtiva === "nova" ? (
          <NewSubjectForm
            dados={novaMateria}
            salvando={salvandoMateria}
            onAlterar={setNovaMateria}
            onSalvar={cadastrarMateria}
            onCancelar={() => setAbaAtiva("materias")}
          />
        ) : carregando ? (
          <p className="professor-loading">Carregando suas matérias...</p>
        ) : (
          <ProfessorSubjects
            materias={materias}
            atividadesPorMateria={atividadesPorMateria}
            materiaAberta={materiaAberta}
            formularioAtividade={formularioAtividade}
            novaAtividade={novaAtividade}
            salvandoAtividadeId={salvandoAtividadeId}
            onCadastrarPrimeira={() => setAbaAtiva("nova")}
            onAlternarMateria={(id) =>
              setMateriaAberta((atual) => (atual === id ? null : id))
            }
            onAbrirFormulario={abrirFormularioAtividade}
            onAlterarAtividade={setNovaAtividade}
            onSalvarAtividade={cadastrarAtividade}
            onCancelarAtividade={() => setFormularioAtividade(null)}
          />
        )}
      </section>
    </main>
  );
}

export default DashboardProfessor;
