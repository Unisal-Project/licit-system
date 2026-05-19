export const USER_ROLES = {
  ADMIN: "ADM",
  EDITOR: "Editor",
  VIEWER: "Visualizador",
};

export const ROLE_OPTIONS = [
  {
    value: USER_ROLES.ADMIN,
    label: "ADM",
    description: "Acesso total, incluindo gerenciamento de usuarios.",
  },
  {
    value: USER_ROLES.EDITOR,
    label: "Editor",
    description: "Pode criar, editar, excluir licitacoes e gerar acesso remoto.",
  },
  {
    value: USER_ROLES.VIEWER,
    label: "Visualizador",
    description: "Pode apenas visualizar dashboard, lista e detalhes.",
  },
];

export const MOCK_SYSTEM_USERS = [
  {
    id: 1,
    name: "Pedro Administrador",
    email: "pedro@licit.local",
    role: USER_ROLES.ADMIN,
    status: "Ativo",
  },
  {
    id: 2,
    name: "Maria Silva",
    email: "maria@licit.local",
    role: USER_ROLES.VIEWER,
    status: "Cadastrado",
  },
  {
    id: 3,
    name: "Joao Santos",
    email: "joao@licit.local",
    role: USER_ROLES.VIEWER,
    status: "Cadastrado",
  },
];

const CURRENT_ROLE_KEY = "licit-system-current-role";
const SYSTEM_USERS_KEY = "licit-system-users";

const canUseLocalStorage = () =>
  typeof window !== "undefined" && Boolean(window.localStorage);

export function getCurrentUserRole() {
  if (!canUseLocalStorage()) {
    return USER_ROLES.ADMIN;
  }

  return window.localStorage.getItem(CURRENT_ROLE_KEY) || USER_ROLES.ADMIN;
}

export function setCurrentUserRole(role) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(CURRENT_ROLE_KEY, role);
  window.dispatchEvent(new Event("licit-role-change"));
}

export function getStoredUsers() {
  if (!canUseLocalStorage()) {
    return MOCK_SYSTEM_USERS;
  }

  const storedUsers = window.localStorage.getItem(SYSTEM_USERS_KEY);

  if (!storedUsers) {
    window.localStorage.setItem(
      SYSTEM_USERS_KEY,
      JSON.stringify(MOCK_SYSTEM_USERS)
    );

    return MOCK_SYSTEM_USERS;
  }

  try {
    return JSON.parse(storedUsers);
  } catch {
    window.localStorage.setItem(
      SYSTEM_USERS_KEY,
      JSON.stringify(MOCK_SYSTEM_USERS)
    );

    return MOCK_SYSTEM_USERS;
  }
}

export function saveStoredUsers(users) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(SYSTEM_USERS_KEY, JSON.stringify(users));
}

export function isAdmin(role = getCurrentUserRole()) {
  return role === USER_ROLES.ADMIN;
}

export function canManageProcurements(role = getCurrentUserRole()) {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.EDITOR;
}

export function canManageRemoteAccess(role = getCurrentUserRole()) {
  return canManageProcurements(role);
}

export function canManageUsers(role = getCurrentUserRole()) {
  return isAdmin(role);
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
