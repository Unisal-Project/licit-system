export const USER_ROLES = {
  SUPPORT: "suporte",
  ADMIN: "admin",
  EDITOR: "editor",
  VISITOR: "visitante",
};

export const ROLE_OPTIONS = [
  {
    value: USER_ROLES.SUPPORT,
    label: "Suporte",
    description: "Acesso tecnico total, incluindo informacoes de outros usuarios.",
  },
  {
    value: USER_ROLES.ADMIN,
    label: "ADM",
    description: "Gerencia o sistema e usuarios, sem acesso tecnico a dados privados.",
  },
  {
    value: USER_ROLES.EDITOR,
    label: "Editor",
    description: "Cria, edita e exclui licitacoes, sem gerenciar acessos ou usuarios.",
  },
  {
    value: USER_ROLES.VISITOR,
    label: "Visitante",
    description: "Pode apenas visualizar dashboard, lista e detalhes.",
  },
];


const CURRENT_ROLE_KEY = "licit-system-current-role";
const SYSTEM_USERS_KEY = "licit-system-users";

const LEGACY_ROLE_MAP = {
  suporte: USER_ROLES.SUPPORT,
  ADM: USER_ROLES.ADMIN,
  Admin: USER_ROLES.ADMIN,
  admin: USER_ROLES.ADMIN,
  Editor: USER_ROLES.EDITOR,
  editor: USER_ROLES.EDITOR,
  Visualizador: USER_ROLES.VISITOR,
  visualizacao: USER_ROLES.VISITOR,
  fornecedor: USER_ROLES.VISITOR,
  visitante: USER_ROLES.VISITOR,
};

const canUseLocalStorage = () =>
  typeof window !== "undefined" && Boolean(window.localStorage);

export function getCurrentUserRole() {
  if (!canUseLocalStorage()) {
    return USER_ROLES.VISITOR;
  }

  try {
    const currentUser = JSON.parse(window.localStorage.getItem("user"));
    const userRole = currentUser?.perfil || currentUser?.role;

    if (userRole) {
      return LEGACY_ROLE_MAP[userRole] || userRole;
    }
  } catch {
    // Ignora dados locais corrompidos e cai para o papel salvo abaixo.
  }

  return USER_ROLES.VISITOR;
}

export function setCurrentUserRole(role) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(CURRENT_ROLE_KEY, role);
  window.dispatchEvent(new Event("licit-role-change"));
}

export function getStoredUsers() {
  return [];
}

export function saveStoredUsers(users) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(SYSTEM_USERS_KEY, JSON.stringify(users));
}

export function isAdmin(role = getCurrentUserRole()) {
  return role === USER_ROLES.SUPPORT || role === USER_ROLES.ADMIN;
}

export function isSupport(role = getCurrentUserRole()) {
  return role === USER_ROLES.SUPPORT;
}

export function canManageProcurements(role = getCurrentUserRole()) {
  return (
    role === USER_ROLES.SUPPORT ||
    role === USER_ROLES.ADMIN ||
    role === USER_ROLES.EDITOR
  );
}

export function canManageRemoteAccess(role = getCurrentUserRole()) {
  return isAdmin(role);
}

export function canManageUsers(role = getCurrentUserRole()) {
  return isAdmin(role);
}

export function canAccessSettings(role = getCurrentUserRole()) {
  return role !== USER_ROLES.VISITOR;
}

export function canViewUserPrivateInfo(role = getCurrentUserRole()) {
  return isSupport(role);
}

export function useRoleChangeListener(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("licit-role-change", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("licit-role-change", callback);
    window.removeEventListener("storage", callback);
  };
}
