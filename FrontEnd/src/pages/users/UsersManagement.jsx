import { useMemo, useState } from "react";
import { ArrowLeft, Home, Save, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import {
  getCurrentUserRole,
  getStoredUsers,
  ROLE_OPTIONS,
  saveStoredUsers,
  setCurrentUserRole,
  USER_ROLES,
} from "../../utils/permissions";
import "./UsersManagement.css";

function UsersHeader() {
  const navigate = useNavigate();

  return (
    <header className="users-header">
      <div className="users-header-left">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={24} />
        </button>

        <div>
          <h1>Usuários</h1>
          <p>Gerencie acessos e permissões do sistema</p>
        </div>
      </div>

      <nav className="users-breadcrumb" aria-label="breadcrumb">
        <Home size={15} />
        <span>/</span>
        <strong>Usuários</strong>
      </nav>
    </header>
  );
}

function RoleBadge({ role }) {
  const roleClass = {
    [USER_ROLES.ADMIN]: "role-admin",
    [USER_ROLES.EDITOR]: "role-editor",
    [USER_ROLES.VIEWER]: "role-viewer",
  }[role];

  return <span className={`role-badge ${roleClass}`}>{role}</span>;
}

function UsersManagement() {
  const [users, setUsers] = useState(getStoredUsers);
  const [currentRole, setCurrentRoleState] = useState(getCurrentUserRole);

  const roleSummary = useMemo(
    () =>
      ROLE_OPTIONS.map((roleOption) => ({
        ...roleOption,
        total: users.filter((user) => user.role === roleOption.value).length,
      })),
    [users]
  );

  const updateUsers = (nextUsers) => {
    setUsers(nextUsers);
    saveStoredUsers(nextUsers);
  };

  const updateUserRole = (userId, role) => {
    updateUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              role,
            }
          : user
      )
    );
  };

  const changeCurrentRole = (role) => {
    setCurrentUserRole(role);
    setCurrentRoleState(role);
  };

  return (
    <div className="users-page">
      <Sidebar />

      <main className="users-main">
        <UsersHeader />

        <section className="users-summary">
          {roleSummary.map((roleOption) => (
            <article className="users-summary-card" key={roleOption.value}>
              <div className="summary-icon">
                <ShieldCheck size={24} />
              </div>
              <div>
                <span>{roleOption.label}</span>
                <strong>{roleOption.total}</strong>
              </div>
            </article>
          ))}
        </section>

        <section className="users-session-card">
          <div>
            <h2>Perfil em uso nesta sessão</h2>
            <p>Controle visual para testar as permissões enquanto o backend de autenticação não está conectado.</p>
          </div>

          <div className="session-role-options">
            {ROLE_OPTIONS.map((roleOption) => (
              <button
                type="button"
                key={roleOption.value}
                className={currentRole === roleOption.value ? "active" : ""}
                onClick={() => changeCurrentRole(roleOption.value)}
              >
                {roleOption.label}
              </button>
            ))}
          </div>
        </section>

        <div className="users-layout">
          <section className="users-card users-table-card">
            <div className="users-card-header">
              <Users size={26} />
              <div>
                <h2>Usuários cadastrados</h2>
                <p>Defina se cada usuário será ADM, Editor ou Visualizador</p>
              </div>
            </div>

            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Status</th>
                    <th>Permissão</th>
                    <th>Salvamento</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </td>
                      <td>{user.status}</td>
                      <td>
                        <div className="user-role-cell">
                          <RoleBadge role={user.role} />
                          <select
                            value={user.role}
                            onChange={(event) =>
                              updateUserRole(user.id, event.target.value)
                            }
                          >
                            {ROLE_OPTIONS.map((roleOption) => (
                              <option value={roleOption.value} key={roleOption.value}>
                                {roleOption.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <div className="users-row-actions">
                          <button
                            type="button"
                            className="users-save-action"
                            title="Permissão salva automaticamente"
                          >
                            <Save size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default UsersManagement;
