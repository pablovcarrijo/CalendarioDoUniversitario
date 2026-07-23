function AdminHeader({ usuario, onLogout }) {
  return <header className="admin-header"><div><span>Central administrativa</span><h1>Olá, {usuario.nome}</h1><p>Gerencie os dados acadêmicos da plataforma.</p></div><button type="button" onClick={onLogout}>Sair</button></header>;
}
export default AdminHeader;
