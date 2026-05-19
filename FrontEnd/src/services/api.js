export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const REQUEST_TIMEOUT = 30000; // 30 segundos

function formatErrorMessage(errorData, fallback) {
  const detail = errorData?.detail || errorData?.message;

  if (!detail) {
    return fallback;
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.message || JSON.stringify(item))
      .join(" ");
  }

  return detail?.msg || detail?.message || JSON.stringify(detail);
}

export async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  // Criar AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      let message = "Erro na requisição.";

      try {
        const errorData = await response.json();
        message = formatErrorMessage(errorData, message);
      } catch {
        message = response.statusText || message;
      }

      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Requisição expirou. Tente novamente.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
