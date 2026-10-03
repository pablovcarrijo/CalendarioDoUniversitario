# Calendário Universitário

Aplicação web para organizar disciplinas, atividades e prazos acadêmicos em um calendário. Professores gerenciam suas disciplinas e publicam atividades; alunos se inscrevem nas disciplinas e acompanham as datas de entrega em um único lugar.

O sistema conta com autenticação e perfis de acesso para alunos, professores e administradores.

## Sobre o projeto

O Calendário Universitário foi desenvolvido como projeto acadêmico para aplicar conhecimentos de desenvolvimento web, integração entre frontend e backend e persistência em banco de dados relacional.

A proposta é centralizar informações que costumam ficar espalhadas entre diferentes disciplinas, facilitando a consulta de atividades e a organização da rotina de estudos.

## Funcionalidades

- Cadastro e login de usuários.
- Controle de acesso por perfil: aluno, professor e administrador.
- Cadastro, edição e exclusão de disciplinas por professores.
- Gerenciamento de atividades associadas às disciplinas, com descrição e data de entrega.
- Inscrição de alunos em disciplinas.
- Visualização das atividades e dos prazos em calendário.

## Perfis de acesso

| Perfil | Participação no sistema |
| --- | --- |
| **Aluno** | Inscreve-se em disciplinas e consulta as atividades e os prazos no calendário. |
| **Professor** | Gerencia suas disciplinas e as atividades vinculadas a elas. |
| **Administrador** | Possui um perfil de acesso distinto, com permissões definidas nas regras de autorização da aplicação. |

## Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| **React** | Construção da interface e dos componentes do frontend. |
| **Node.js** | Execução do backend JavaScript. |
| **Express.js** | Definição das rotas HTTP e dos middlewares da API. |
| **Prisma** | Acesso e persistência dos dados por meio de ORM. |
| **MySQL** | Armazenamento dos dados em banco relacional. |
| **Docker** | Uso de containers no ambiente do projeto. |

## Como o sistema funciona

1. O usuário acessa a aplicação e realiza o login.
2. O professor cadastra uma disciplina e adiciona atividades com suas respectivas datas de entrega.
3. O aluno se inscreve nas disciplinas que deseja acompanhar.
4. As atividades dessas disciplinas ficam disponíveis para consulta no calendário do aluno.
5. As operações são autorizadas de acordo com o perfil do usuário e as regras de acesso da aplicação.

### Exemplo de uso

Um professor cadastra a disciplina **Sistemas Distribuídos** e publica a atividade **Trabalho sobre Kubernetes**, com entrega em uma data definida. Um aluno inscrito nessa disciplina consulta a atividade no calendário e utiliza essa informação para organizar seus estudos e entregas.

## Organização da aplicação

O projeto reúne três partes principais:

- **Frontend:** apresenta as telas, recebe as interações dos usuários e realiza requisições à API.
- **Backend:** processa as requisições, aplica as regras de negócio e verifica autenticação e permissões.
- **Banco de dados:** armazena usuários, disciplinas, inscrições e atividades, acessados pelo backend com Prisma.

### Principais entidades

| Entidade | Responsabilidade |
| --- | --- |
| **Usuário** | Representa uma pessoa cadastrada e seu perfil de acesso. |
| **Disciplina** | Agrupa informações de uma matéria e sua associação com o professor responsável. |
| **Inscrição** | Relaciona um aluno às disciplinas que acompanha. |
| **Atividade** | Representa uma tarefa vinculada a uma disciplina, com descrição e data de entrega. |

Um professor pode ser responsável por várias disciplinas. Um aluno pode se inscrever em várias disciplinas, e cada disciplina pode reunir vários alunos e atividades.

## Execução local

> Os diretórios, as versões, as variáveis de ambiente e os comandos de inicialização devem seguir a configuração presente no repositório. O roteiro abaixo descreve as etapas gerais, sem presumir nomes de pastas ou scripts.

### Pré-requisitos

- Git para obter o código.
- Node.js e o gerenciador de pacotes adotado pelo projeto, nas versões compatíveis com suas dependências.
- MySQL acessível pela aplicação, instalado localmente ou executado em container.
- Docker, caso a execução utilize os serviços configurados em containers.

### Preparação

1. Clone o repositório e abra o projeto no editor de sua preferência.
2. Consulte os arquivos `package.json` e o arquivo de lock para identificar o gerenciador de pacotes e os scripts disponíveis.
3. Instale as dependências do frontend e do backend. Em projetos que utilizam npm, execute na pasta de cada pacote:

   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente esperadas pela aplicação. Se houver um arquivo de exemplo, utilize-o como referência, preenchendo a conexão com o banco e as demais configurações necessárias. Não publique credenciais no repositório.
5. Disponibilize o MySQL e prepare o banco de acordo com o schema e o fluxo de migrations do Prisma adotados no projeto.
6. Consulte os scripts disponíveis. Com npm, o comando abaixo lista as opções do pacote atual:

   ```bash
   npm run
   ```

7. Execute os scripts de inicialização do backend e do frontend definidos nos respectivos `package.json`.
8. Acesse o endereço informado pelo frontend no terminal e confirme a comunicação com a API e o banco de dados.

Se o repositório incluir uma configuração do Docker Compose, confira quais serviços ela inicia e quais variáveis exige antes de utilizá-la. Os passos executados pelos containers não precisam ser repetidos manualmente no computador.

## Conceitos aplicados

- Desenvolvimento de interfaces com React.
- Integração entre frontend e API HTTP.
- Autenticação e autorização por perfil.
- Operações de cadastro, consulta, edição e exclusão de dados.
- Modelagem de relacionamentos em banco de dados relacional.
- Persistência com Prisma e MySQL.
- Organização de atividades por data e disciplina.
- Uso de containers no ambiente de desenvolvimento.

## Possíveis evoluções

As sugestões abaixo representam oportunidades de evolução, e não funcionalidades declaradas como implementadas:

- Filtros no calendário por disciplina e tipo de atividade.
- Lembretes de prazos e notificações.
- Marcação pessoal de atividades concluídas.
- Exportação de eventos para outros aplicativos de calendário.
- Ampliação dos testes automatizados e da documentação da API.

## Autor

**Pablo Vinicius Carrijo**

[GitHub](https://github.com/pablovcarrijo)
