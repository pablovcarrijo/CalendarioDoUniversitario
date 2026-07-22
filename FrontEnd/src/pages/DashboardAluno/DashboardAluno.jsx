import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "./Components/DashboardHeader.jsx";
import CalendarCard from "./Components/CalendarCard.jsx";
import DashboardSidebar from "./Components/DashboardSidebar.jsx";
import { apiFetch } from "../../api/api.js";

import "./dashboardAluno.css";

const nomesMeses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

function extrairLista(resposta) {
  if (Array.isArray(resposta)) {
    return resposta;
  }

  if (!resposta || typeof resposta !== "object") {
    return [];
  }

  const possiveisListas = [
    resposta.materias,
    resposta.atividades,
    resposta.data,
    resposta.dados,
    resposta.resultado,
    resposta.resultados,
  ];

  const listaEncontrada = possiveisListas.find(Array.isArray);

  if (listaEncontrada) {
    return listaEncontrada;
  }

  if (resposta.data && typeof resposta.data === "object") {
    const listaInterna = [
      resposta.data.materias,
      resposta.data.atividades,
      resposta.data.dados,
      resposta.data.resultados,
    ].find(Array.isArray);

    return listaInterna || [];
  }

  return [];
}

// Converte uma data recebida do backend para um objeto Date.
function normalizarData(valor) {
  if (!valor) {
    return null;
  }

  if (valor instanceof Date) {
    if (Number.isNaN(valor.getTime())) {
      return null;
    }

    return new Date(valor);
  }

  if (typeof valor !== "string") {
    const dataConvertida = new Date(valor);

    return Number.isNaN(dataConvertida.getTime()) ? null : dataConvertida;
  }

  const valorLimpo = valor.trim();

  const formatoBanco = valorLimpo.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/,
  );

  if (formatoBanco) {
    const ano = Number(formatoBanco[1]);
    const mes = Number(formatoBanco[2]) - 1;
    const dia = Number(formatoBanco[3]);
    const hora = Number(formatoBanco[4] || 0);
    const minuto = Number(formatoBanco[5] || 0);
    const segundo = Number(formatoBanco[6] || 0);

    const data = new Date(ano, mes, dia, hora, minuto, segundo);

    return Number.isNaN(data.getTime()) ? null : data;
  }

  const formatoBrasileiro = valorLimpo.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s(\d{2}):(\d{2}))?$/,
  );

  if (formatoBrasileiro) {
    const dia = Number(formatoBrasileiro[1]);
    const mes = Number(formatoBrasileiro[2]) - 1;
    const ano = Number(formatoBrasileiro[3]);
    const hora = Number(formatoBrasileiro[4] || 0);
    const minuto = Number(formatoBrasileiro[5] || 0);

    const data = new Date(ano, mes, dia, hora, minuto);

    return Number.isNaN(data.getTime()) ? null : data;
  }

  const dataConvertida = new Date(valorLimpo);

  return Number.isNaN(dataConvertida.getTime()) ? null : dataConvertida;
}

// Verifica se dois objetos Date representam o mesmo dia.
function mesmaData(dataA, dataB) {
  if (!(dataA instanceof Date) || !(dataB instanceof Date)) {
    return false;
  }

  return (
    dataA.getFullYear() === dataB.getFullYear() &&
    dataA.getMonth() === dataB.getMonth() &&
    dataA.getDate() === dataB.getDate()
  );
}

/*
  Cria as 42 posições do calendário.

  São seis semanas com sete dias cada.
  Também inclui dias do mês anterior e do próximo mês.
*/
function criarDiasDoCalendario(ano, mes) {
  const primeiroDiaDoMes = new Date(ano, mes, 1);

  const diaDaSemanaInicial = primeiroDiaDoMes.getDay();

  const primeiroDiaDoCalendario = new Date(ano, mes, 1 - diaDaSemanaInicial);

  return Array.from({ length: 42 }, (_, index) => {
    return new Date(
      primeiroDiaDoCalendario.getFullYear(),
      primeiroDiaDoCalendario.getMonth(),
      primeiroDiaDoCalendario.getDate() + index,
    );
  });
}

// Exibe a hora no formato pt-BR
function formatarHorario(data) {
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
    return "Horário não informado";
  }

  return data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DashboardAluno() {
  const navigate = useNavigate();

  // Estados relacionados ao usuário.
  const [usuario, setUsuario] = useState(null);

  const [carregandoUsuario, setCarregandoUsuario] = useState(true);

  //Dados do dashboard.
  const [materias, setMaterias] = useState([]);

  const [atividades, setAtividades] = useState([]);

  const [carregandoDashboard, setCarregandoDashboard] = useState(true);

  const [erro, setErro] = useState("");

  //Guarda o dia atual.
  const hoje = useMemo(() => {
    return new Date();
  }, []);

  //Cria a data de hoje com horário 00:00:00.
  const inicioHoje = useMemo(() => {
    return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  }, [hoje]);

  //O calendário começa exibindo o mês atual.
  const [dataExibida, setDataExibida] = useState(() => {
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  // Verifica o cookie e carrega o usuário autenticado.
  useEffect(() => {
    let componenteAtivo = true;

    async function carregarUsuario() {
      try {
        setCarregandoUsuario(true);
        setErro("");

        const resposta = await apiFetch("/login/me");

        const usuarioRecebido = resposta?.usuario;

        if (!usuarioRecebido) {
          throw new Error("O backend não retornou o usuário autenticado.");
        }

        const role = String(usuarioRecebido.role ?? "")
          .trim()
          .toUpperCase();

        if (role !== "ALUNO") {
          if (role === "PROFESSOR") {
            navigate("/professor", {
              replace: true,
            });
          } else {
            navigate("/", {
              replace: true,
            });
          }

          return;
        }

        if (componenteAtivo) {
          setUsuario(usuarioRecebido);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);

        if (componenteAtivo) {
          setUsuario(null);
        }

        navigate("/", {
          replace: true,
        });
      } finally {
        if (componenteAtivo) {
          setCarregandoUsuario(false);
        }
      }
    }

    carregarUsuario();

    /*
      Evita atualizar estados depois que o componente
      tiver sido desmontado.
    */
    return () => {
      componenteAtivo = false;
    };
  }, [navigate]);

  /*
    Carrega matérias e atividades somente depois
    que o usuário estiver autenticado.
  */
  useEffect(() => {
    let componenteAtivo = true;

    async function carregarDashboard() {
      try {
        setCarregandoDashboard(true);
        setErro("");
        const [respostaMaterias, respostaAtividades] = await Promise.all([
          apiFetch("/aluno_materia/minhas"),
          apiFetch("/atividades"),
        ]);

        if (!componenteAtivo) {
          return;
        }

        const listaMaterias = extrairLista(respostaMaterias);

        const listaAtividades = extrairLista(respostaAtividades);

        setMaterias(listaMaterias);
        setAtividades(listaAtividades);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);

        if (componenteAtivo) {
          setErro(error.message || "Não foi possível carregar o dashboard.");
        }
      } finally {
        if (componenteAtivo) {
          setCarregandoDashboard(false);
        }
      }
    }

    if (usuario) {
      carregarDashboard();
    }

    return () => {
      componenteAtivo = false;
    };
  }, [usuario]);

  /*
    Gera os 42 dias mostrados no calendário.
  */
  const diasCalendario = useMemo(() => {
    return criarDiasDoCalendario(
      dataExibida.getFullYear(),
      dataExibida.getMonth(),
    );
  }, [dataExibida]);

  /*
    Adiciona uma versão convertida da data em cada atividade.
  */
  const atividadesComData = useMemo(() => {
    return atividades
      .map((atividade) => {
        return {
          ...atividade,

          dataFormatada: normalizarData(atividade.data_entrega),
        };
      })
      .filter((atividade) => {
        return atividade.dataFormatada !== null;
      });
  }, [atividades]);

  /*
    Seleciona somente os três compromissos futuros
    mais próximos.
  */
  const proximosCompromissos = useMemo(() => {
    return atividadesComData
      .filter((atividade) => {
        return atividade.dataFormatada >= inicioHoje;
      })
      .sort((atividadeA, atividadeB) => {
        return atividadeA.dataFormatada - atividadeB.dataFormatada;
      })
      .slice(0, 3);
  }, [atividadesComData, inicioHoje]);

  /*
    Avança ou volta o mês do calendário.

    valor = -1: mês anterior
    valor = 1: próximo mês
  */
  function mudarMes(valor) {
    setDataExibida((dataAtual) => {
      return new Date(dataAtual.getFullYear(), dataAtual.getMonth() + valor, 1);
    });
  }

  /*
    Retorna para o mês atual.
  */
  function voltarParaHoje() {
    setDataExibida(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  }

  /*
    Retorna as atividades relacionadas a determinado dia.
  */
  function atividadesDoDia(dia) {
    return atividadesComData.filter((atividade) => {
      return mesmaData(atividade.dataFormatada, dia);
    });
  }

  /*
    Faz logout no backend e volta para a página inicial.
  */
  async function sair() {
    try {
      await apiFetch("/login/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Erro ao realizar logout:", error);
    } finally {
      setUsuario(null);
      setMaterias([]);
      setAtividades([]);

      navigate("/", {
        replace: true,
      });
    }
  }

  /*
    Tela exibida enquanto a autenticação é verificada.
  */
  if (carregandoUsuario) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-content">
          <section className="dashboard-card side-card">
            <p className="status-text">Verificando autenticação...</p>
          </section>
        </section>
      </main>
    );
  }

  /*
    Impede que o dashboard apareça rapidamente
    enquanto o redirecionamento é realizado.
  */
  if (!usuario) {
    return null;
  }

  return (
    <main className="dashboard-page">
      <DashboardHeader usuario={usuario} onLogout={sair} />

      <section className="dashboard-content">
        <CalendarCard
          dataExibida={dataExibida}
          diasCalendario={diasCalendario}
          hoje={hoje}
          nomesMeses={nomesMeses}
          diasSemana={diasSemana}
          atividadesDoDia={atividadesDoDia}
          mesmaData={mesmaData}
          onMudarMes={mudarMes}
          onVoltarParaHoje={voltarParaHoje}
        />

        <DashboardSidebar
          materias={materias}
          proximosCompromissos={proximosCompromissos}
          carregando={carregandoDashboard}
          erro={erro}
          nomesMeses={nomesMeses}
          formatarHorario={formatarHorario}
        />
      </section>
    </main>
  );
}

export default DashboardAluno;
