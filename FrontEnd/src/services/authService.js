import { apiRequest } from "./api";

export async function login(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
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
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.removeItem("licit-system-current-role");
  sessionStorage.removeItem("licitSysSidebarActivePath");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("licit-system-current-role");
  sessionStorage.removeItem("licitSysSidebarActivePath");
}
