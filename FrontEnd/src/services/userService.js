import { apiRequest } from "./api";

export async function listUsers() {
  return apiRequest("/users/");
}

export async function getCurrentUserProfile() {
  return apiRequest("/users/me");
}

export async function updateUserRole(userId, perfil) {
  return apiRequest(`/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ perfil }),
  });
}

export async function updateCurrentUserPassword({ senhaAtual, novaSenha }) {
  return apiRequest("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify({
      senha_atual: senhaAtual,
      nova_senha: novaSenha,
    }),
  });
}

export async function deleteUser(userId) {
  return apiRequest(`/users/${userId}`, {
    method: "DELETE",
  });
}
