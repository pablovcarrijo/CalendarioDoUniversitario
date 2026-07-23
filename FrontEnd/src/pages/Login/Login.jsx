import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/api.js";

function Login() {
  const [modoCadastro, setModoCadastro] = useState(false);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [roleUsuario, setRoleUsuario] = useState("aluno");

  const [mensagem, setMensagem] = useState("");
  const [usuario, setUsuario] = useState(null);

  const navigate = useNavigate();

  async function fazerLogin(event) {
    event.preventDefault();

    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      console.log("Resposta do login:", data);

      const role = data?.usuario?.role?.trim().toUpperCase();

      if (!role) {
        throw new Error("O backend não retornou o role do usuário.");
      }

      setEmail("");
      setSenha("");

      if (role === "ALUNO") {
        navigate("/aluno", { replace: true });
        return;
      }

      if (role === "PROFESSOR") {
        navigate("/professor", { replace: true });
        return;
      }

      if (role === "ADMINISTRADOR") {
        navigate("/administrador", { replace: true });
        return;
      }

      throw new Error(`Role não reconhecida: ${role}`);
    } catch (error) {
      console.error(error);
      setMensagem(error.message);
    }
  }
  async function fazerCadastro(event) {
    event.preventDefault();

    try {
      const rotaCadastro =
        roleUsuario === "aluno" ? "/register/aluno" : "/register/professor";

      const data = await apiFetch(rotaCadastro, {
        method: "POST",
        body: JSON.stringify({
          nome,
          email,
          matricula,
          senha,
        }),
      });

      setMensagem(data.mensagem);
      setModoCadastro(false);

      setNome("");
      setEmail("");
      setMatricula("");
      setSenha("");
    } catch (error) {
      setMensagem(error.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-left">
          <h1>Bem-vindo</h1>

          <p>
            Organize suas matérias, acompanhe atividades e mantenha seu
            calendário acadêmico em dia.
          </p>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setModoCadastro(!modoCadastro);
              setMensagem("");
              setUsuario(null);
            }}
          >
            {modoCadastro ? "Fazer login" : "Criar conta"}
          </button>
        </div>

        <div className="auth-right">
          {!modoCadastro ? (
            <>
              <h2>Faça login</h2>

              <form onSubmit={fazerLogin} className="auth-form">
                <div className="input-group">
                  <span>✉</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="input-group">
                  <span>🔒</span>
                  <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                  />
                </div>

                <button type="submit" className="primary-button">
                  Entrar
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Criar conta</h2>

              <form onSubmit={fazerCadastro} className="auth-form">
                <div className="input-group">
                  <span>👤</span>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                  />
                </div>

                <div className="input-group">
                  <span>✉</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>

                <div className="input-group">
                  <span>🎓</span>
                  <input
                    type="text"
                    placeholder="Matrícula"
                    value={matricula}
                    onChange={(event) => setMatricula(event.target.value)}
                  />
                </div>

                <div className="input-group">
                  <span>🔒</span>
                  <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                  />
                </div>

                <div className="select-group">
                  <label>Role de usuário</label>

                  <select
                    value={roleUsuario}
                    onChange={(event) => setRoleUsuario(event.target.value)}
                  >
                    <option value="aluno">Aluno</option>
                    <option value="professor">Professor</option>
                  </select>
                </div>

                <button type="submit" className="primary-button">
                  Cadastrar
                </button>
              </form>
            </>
          )}
          {mensagem && <p className="message">{mensagem}</p>}
        </div>
      </section>
    </main>
  );
}

export default Login;
