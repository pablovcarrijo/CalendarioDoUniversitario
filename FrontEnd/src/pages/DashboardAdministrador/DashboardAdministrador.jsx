import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/api.js";
import ActivitiesPanel from "./Components/ActivitiesPanel.jsx";
import AdminHeader from "./Components/AdminHeader.jsx";
import AdminNav from "./Components/AdminNav.jsx";
import AdminOverview from "./Components/AdminOverview.jsx";
import SubjectsPanel from "./Components/SubjectsPanel.jsx";
import UsersPanel from "./Components/UsersPanel.jsx";
import "./dashboardAdministrador.css";

function lista(resposta) {
  if (Array.isArray(resposta)) return resposta;
  return resposta?.resultado || resposta?.data || [];
}

function DashboardAdministrador() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("visao");
  const [usuarios, setUsuarios] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const [respostaUsuarios, respostaMaterias, respostaAtividades] = await Promise.all([
        apiFetch("/users"), apiFetch("/materias"), apiFetch("/atividades"),
      ]);
      setUsuarios(lista(respostaUsuarios));
      setMaterias(lista(respostaMaterias));
      setAtividades(lista(respostaAtividades));
    } catch (error) {
      setErro(error.message || "Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    async function iniciar() {
      try {
        const resposta = await apiFetch("/login/me");
        const autenticado = resposta?.usuario;
        const role = String(autenticado?.role || "").trim().toUpperCase();
        if (role !== "ADMINISTRADOR") {
          const destino = role === "ALUNO" ? "/aluno" : role === "PROFESSOR" ? "/professor" : "/";
          navigate(destino, { replace: true });
          return;
        }
        setUsuario(autenticado);
        await carregarDados();
      } catch {
        navigate("/", { replace: true });
      }
    }
    iniciar();
  }, [carregarDados, navigate]);

  function iniciarOperacao() { setSalvando(true); setErro(""); setSucesso(""); }
  function finalizarOperacao() { setSalvando(false); }

  async function criarUsuario(dados) {
    iniciarOperacao();
    try {
      const rota = dados.role === "ALUNO" ? "/register/aluno" : "/register/professor";
      const { role: _, ...corpo } = dados;
      await apiFetch(rota, { method: "POST", body: JSON.stringify(corpo) });
      await carregarDados(); setSucesso(`${dados.role === "ALUNO" ? "Aluno" : "Professor"} cadastrado com sucesso.`); return true;
    } catch (error) { setErro(error.message); return false; } finally { finalizarOperacao(); }
  }

  async function excluirUsuario(user) {
    if (user.id === usuario.id) { setErro("Você não pode excluir sua própria conta por este painel."); return; }
    if (!window.confirm(`Excluir ${user.nome}? Esta ação não pode ser desfeita.`)) return;
    iniciarOperacao();
    try { await apiFetch(`/users/${encodeURIComponent(user.matricula)}`, { method: "DELETE" }); await carregarDados(); setSucesso("Usuário excluído com sucesso."); }
    catch (error) { setErro(error.message); } finally { finalizarOperacao(); }
  }

  async function criarMateria(dados) {
    iniciarOperacao();
    try { await apiFetch("/materias", { method: "POST", body: JSON.stringify(dados) }); await carregarDados(); setSucesso("Matéria cadastrada com sucesso."); return true; }
    catch (error) { setErro(error.message); return false; } finally { finalizarOperacao(); }
  }

  async function excluirMateria(materia) {
    if (!window.confirm(`Excluir a matéria ${materia.nome}? As relações vinculadas podem ser afetadas.`)) return;
    iniciarOperacao();
    try { await apiFetch(`/materias/${materia.id}`, { method: "DELETE" }); await carregarDados(); setSucesso("Matéria excluída com sucesso."); }
    catch (error) { setErro(error.message); } finally { finalizarOperacao(); }
  }

  async function criarAtividade(dados) {
    iniciarOperacao();
    try { await apiFetch("/atividades", { method: "POST", body: JSON.stringify(dados) }); await carregarDados(); setSucesso("Atividade cadastrada com sucesso."); return true; }
    catch (error) { setErro(error.message); return false; } finally { finalizarOperacao(); }
  }

  async function excluirAtividade(atividade) {
    if (!window.confirm(`Excluir a atividade ${atividade.titulo}?`)) return;
    iniciarOperacao();
    try { await apiFetch(`/atividades/${atividade.id}`, { method: "DELETE" }); await carregarDados(); setSucesso("Atividade excluída com sucesso."); }
    catch (error) { setErro(error.message); } finally { finalizarOperacao(); }
  }

  async function sair() {
    try { await apiFetch("/login/logout", { method: "POST" }); }
    finally { navigate("/", { replace: true }); }
  }

  if (!usuario || carregando) return <main className="admin-page"><p className="admin-loading">Carregando painel administrativo...</p></main>;

  return <main className="admin-page">
    <AdminHeader usuario={usuario} onLogout={sair} />
    <section className="admin-shell">
      <AdminNav abaAtiva={abaAtiva} onMudar={(aba) => { setAbaAtiva(aba); setErro(""); setSucesso(""); }} />
      {erro && <p className="admin-message error">{erro}</p>}{sucesso && <p className="admin-message success">{sucesso}</p>}
      {abaAtiva === "visao" && <AdminOverview usuarios={usuarios} materias={materias} atividades={atividades} onMudar={setAbaAtiva} />}
      {abaAtiva === "usuarios" && <UsersPanel usuarios={usuarios} salvando={salvando} onCriar={criarUsuario} onExcluir={excluirUsuario} />}
      {abaAtiva === "materias" && <SubjectsPanel materias={materias} salvando={salvando} onCriar={criarMateria} onExcluir={excluirMateria} />}
      {abaAtiva === "atividades" && <ActivitiesPanel atividades={atividades} materias={materias} salvando={salvando} onCriar={criarAtividade} onExcluir={excluirAtividade} />}
    </section>
  </main>;
}
export default DashboardAdministrador;
