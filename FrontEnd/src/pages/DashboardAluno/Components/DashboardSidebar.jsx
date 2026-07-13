import QuickActionsCard from "./QuickActionsCard.jsx";
import SubjectsCard from "./SubjectsCard.jsx";
import AppointmentsCard from "./AppointmentsCard.jsx";

function DashboardSidebar({
  materias,
  proximosCompromissos,
  carregando,
  erro,
  nomesMeses,
  formatarHorario,
}) {
  return (
    <aside className="dashboard-sidebar">
      <QuickActionsCard />

      <SubjectsCard
        materias={materias}
        carregando={carregando}
      />

      <AppointmentsCard
        proximosCompromissos={proximosCompromissos}
        carregando={carregando}
        erro={erro}
        nomesMeses={nomesMeses}
        formatarHorario={formatarHorario}
      />
    </aside>
  );
}

export default DashboardSidebar;