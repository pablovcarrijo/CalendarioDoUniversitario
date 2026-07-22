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
  onAbrirMatriculas,
  removendoMateriaId,
  erroDesmatricula,
  onDesmatricular,
}) {
  return (
    <aside className="dashboard-sidebar">
      <QuickActionsCard onAbrirMatriculas={onAbrirMatriculas} />

      <SubjectsCard
        materias={materias}
        carregando={carregando}
        removendoId={removendoMateriaId}
        erro={erroDesmatricula}
        onDesmatricular={onDesmatricular}
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
