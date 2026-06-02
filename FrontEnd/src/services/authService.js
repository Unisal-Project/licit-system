import { apiRequest } from "./api";

export async function login(email, password, rememberMe = false) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, remember_me: rememberMe }),
  });
}

export async function register({ nome, email, senha }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha }),
  });
}

export async function requestPasswordReset(email) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token, novaSenha) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, nova_senha: novaSenha }),
  });
}

export async function generateRemoteAccess(payload) {
  return apiRequest("/auth/remote-access", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function saveAuth(data) {
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.removeItem("licit-system-current-role");
  sessionStorage.removeItem("licitSysSidebarActivePath");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("user"));
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("licit-system-current-role");
  sessionStorage.removeItem("licitSysSidebarActivePath");

  apiRequest("/auth/logout", {
    method: "POST",
  }).catch(() => {
    // O estado local já foi limpo; falhas de rede não devem prender o usuário na sessão visual.
  });
}
