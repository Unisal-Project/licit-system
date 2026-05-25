import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, ChevronDown, Home, Trash2, Save, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../components/layout/Sidebar";
import {
  getCurrentUserRole,
  ROLE_OPTIONS,
  USER_ROLES,
} from "../../utils/permissions";
import {
  deleteUser,
  listUsers,
  updateUserRole as updateUserRoleRequest,
} from "../../services/userService";
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
    [USER_ROLES.SUPPORT]: "role-support",
    [USER_ROLES.ADMIN]: "role-admin",
    [USER_ROLES.EDITOR]: "role-editor",
    [USER_ROLES.VISITOR]: "role-viewer",
  }[role];

  return <span className={`role-badge ${roleClass}`}>{role}</span>;
}

function DeleteUserModal({ user, onCancel, onConfirm, isDeleting }) {
  if (!user) {
    return null;
  }

  return (
    <div className="users-modal-overlay" role="presentation">
      <section
        className="users-delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="users-delete-title"
      >
        <div className="users-delete-modal-icon">
          <AlertTriangle size={26} />
        </div>

        <div className="users-delete-modal-content">
          <h2 id="users-delete-title">Excluir usuário?</h2>
          <p>
            Esta ação remove o acesso de <strong>{user.name}</strong> ao sistema e não pode ser desfeita.
          </p>
        </div>

        <div className="users-delete-modal-actions">
          <button type="button" className="users-modal-cancel" onClick={onCancel} disabled={isDeleting}>
            Cancelar
          </button>
          <button type="button" className="users-modal-confirm" onClick={onConfirm} disabled={isDeleting}>
            <Trash2 size={17} />
            {isDeleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </section>
    </div>
  );
}

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [userPendingDelete, setUserPendingDelete] = useState(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);
  const currentRole = getCurrentUserRole();
  const canSeeSupportUsers = currentRole === USER_ROLES.SUPPORT;
  const visibleRoleOptions = useMemo(
    () =>
      canSeeSupportUsers
        ? ROLE_OPTIONS
        : ROLE_OPTIONS.filter((roleOption) => roleOption.value !== USER_ROLES.SUPPORT),
    [canSeeSupportUsers]
  );
  const visibleUsers = useMemo(
    () =>
      canSeeSupportUsers
        ? users
        : users.filter((user) => user.role !== USER_ROLES.SUPPORT),
    [canSeeSupportUsers, users]
  );
  const activeUsers = useMemo(
    () => visibleUsers.filter((user) => user.status === "Ativo"),
    [visibleUsers]
  );
  const inactiveUsers = useMemo(
    () => visibleUsers.filter((user) => user.status !== "Ativo"),
    [visibleUsers]
  );

  const roleSummary = useMemo(
    () =>
      visibleRoleOptions.map((roleOption) => ({
        ...roleOption,
        total: activeUsers.filter((user) => user.role === roleOption.value).length,
      })),
    [visibleRoleOptions, activeUsers]
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        setIsLoading(true);
        const data = await listUsers();

        if (!isMounted) return;

        setUsers(
          data.map((user) => ({
            id: user.id,
            name: user.nome,
            email: user.email,
            role: user.perfil,
            status: user.ativo ? "Ativo" : "Inativo",
          }))
        );
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage(error.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateUserRole = async (userId, role) => {
    try {
      const updatedUser = await updateUserRoleRequest(userId, role);

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: updatedUser.perfil,
              }
            : user
        )
      );
      toast.success("Permissão atualizada com sucesso.");
    } catch (error) {
      toast.error("Erro ao atualizar permissão: " + error.message);
    }
  };

  const openDeleteModal = (user) => {
    setUserPendingDelete(user);
  };

  const closeDeleteModal = () => {
    if (isDeletingUser) {
      return;
    }

    setUserPendingDelete(null);
  };

  const confirmDeleteUser = async () => {
    if (!userPendingDelete) {
      return;
    }

    try {
      setIsDeletingUser(true);
      const response = await deleteUser(userPendingDelete.id);

      if (response?.action === "deactivated") {
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === userPendingDelete.id
              ? { ...user, status: "Inativo" }
              : user
          )
        );
        toast.success(response.message || "Usuário desativado com sucesso.");
      } else {
        setUsers((currentUsers) =>
          currentUsers.filter((user) => user.id !== userPendingDelete.id)
        );
        toast.success(response?.message || "Usuário excluído com sucesso.");
      }

      setUserPendingDelete(null);
    } catch (error) {
      toast.error("Erro ao excluir usuário: " + error.message);
    } finally {
      setIsDeletingUser(false);
    }
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

        <div className="users-layout">
          <section className="users-card users-table-card">
            <div className="users-card-header">
              <Users size={26} />
              <div>
                <h2>Usuários cadastrados</h2>
                <p>Defina se cada usuário será Suporte, ADM, Editor ou Visitante</p>
              </div>
            </div>

            <div className="users-table-wrap">
              {isLoading && <p className="users-table-message">Carregando usuários...</p>}
              {!isLoading && errorMessage && (
                <p className="users-table-message">{errorMessage}</p>
              )}
              {!isLoading && !errorMessage && activeUsers.length === 0 && (
                <p className="users-table-message">Nenhum usuário ativo encontrado.</p>
              )}

              <table className="users-table">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Status</th>
                    <th>Permissão</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {!isLoading && !errorMessage && activeUsers.map((user) => (
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
                            {visibleRoleOptions.map((roleOption) => (
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
                          <button
                            type="button"
                            className="users-delete-action"
                            title="Excluir usuário"
                            onClick={() => openDeleteModal(user)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {!isLoading && !errorMessage && inactiveUsers.length > 0 && (
            <section className="users-card users-inactive-card">
              <button
                type="button"
                className="users-inactive-toggle"
                onClick={() => setShowInactiveUsers((currentValue) => !currentValue)}
                aria-expanded={showInactiveUsers}
              >
                <div>
                  <strong>Usuários inativos</strong>
                  <span>{inactiveUsers.length} fora dos totais de permissão</span>
                </div>
                <ChevronDown
                  size={20}
                  className={showInactiveUsers ? "users-inactive-chevron open" : "users-inactive-chevron"}
                />
              </button>

              {showInactiveUsers && (
                <div className="users-inactive-list">
                  {inactiveUsers.map((user) => (
                    <div className="users-inactive-item" key={user.id}>
                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                      <span className="users-inactive-status">Inativo</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <DeleteUserModal
        user={userPendingDelete}
        onCancel={closeDeleteModal}
        onConfirm={confirmDeleteUser}
        isDeleting={isDeletingUser}
      />
    </div>
  );
}

export default UsersManagement;
