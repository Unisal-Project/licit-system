import { parseBrazilianDateTime } from "../utils/dateUtils.js"

const API_URL = "http://localhost:3000/procurements"

export const PROCUREMENT_STATUS = {
  AGUARDANDO_ABERTURA: "aguardando_abertura",
  ABERTO: "aberto",
  EM_ANDAMENTO: "em_andamento",
  SUSPENSO: "suspenso",
  REVOGADO: "revogado",
  FINALIZADO: "finalizado",
}

export const PROCUREMENT_STATUS_LABELS = {
  [PROCUREMENT_STATUS.AGUARDANDO_ABERTURA]: "Aguardando Abertura",
  [PROCUREMENT_STATUS.ABERTO]: "Aberto",
  [PROCUREMENT_STATUS.EM_ANDAMENTO]: "Em Andamento",
  [PROCUREMENT_STATUS.SUSPENSO]: "Suspenso",
  [PROCUREMENT_STATUS.REVOGADO]: "Revogado",
  [PROCUREMENT_STATUS.FINALIZADO]: "Finalizado",
}

export const STATUS_COLORS = {
  [PROCUREMENT_STATUS.AGUARDANDO_ABERTURA]: "var(--aguardando)",
  [PROCUREMENT_STATUS.ABERTO]: "var(--success)",
  [PROCUREMENT_STATUS.EM_ANDAMENTO]: "var(--secondary)",
  [PROCUREMENT_STATUS.SUSPENSO]: "var(--danger)",
  [PROCUREMENT_STATUS.REVOGADO]: "var(--warning)",
  [PROCUREMENT_STATUS.FINALIZADO]: "var(--bg-dark)",
}

export const STATUS_BADGES = {
  [PROCUREMENT_STATUS.AGUARDANDO_ABERTURA]: "badge-aguardando",
  [PROCUREMENT_STATUS.ABERTO]: "badge-aberto",
  [PROCUREMENT_STATUS.EM_ANDAMENTO]: "badge-andamento",
  [PROCUREMENT_STATUS.SUSPENSO]: "badge-suspenso",
  [PROCUREMENT_STATUS.REVOGADO]: "badge-revogado",
  [PROCUREMENT_STATUS.FINALIZADO]: "badge-finalizado",
}

function normalizeStatusValue(status) {
  const normalized = String(status || "")
    .replace(/_/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const statusMap = {
    "aguardando abertura": PROCUREMENT_STATUS.AGUARDANDO_ABERTURA,
    "aberto": PROCUREMENT_STATUS.ABERTO,
    "em andamento": PROCUREMENT_STATUS.EM_ANDAMENTO,
    "suspenso": PROCUREMENT_STATUS.SUSPENSO,
    "revogado": PROCUREMENT_STATUS.REVOGADO,
    "finalizado": PROCUREMENT_STATUS.FINALIZADO,
  };

  return statusMap[normalized] || status;
}

async function request(endpoint = "", options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error("Erro na requisição de licitações")
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function safeProcurements(procurements = []) {
  return Array.isArray(procurements) ? procurements : []
}

export function normalizeProcurement(procurement) {
  return {
    ...procurement,
    status: normalizeStatusValue(
      procurement.status || PROCUREMENT_STATUS.AGUARDANDO_ABERTURA
    ),
  };
}

export async function getAllProcurements() {
  const procurements = await request()
  return safeProcurements(procurements).map(normalizeProcurement)
}

export async function getProcurementById(id) {
  return request(`/${id}`)
}

export async function createProcurement(procurement) {
  return request("", {
    method: "POST",
    body: JSON.stringify(normalizeProcurement(procurement)),
  })
}

export async function updateProcurement(id, procurementData) {
  const response = await fetch(`http://localhost:3000/procurements/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(procurementData),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar licitação.");
  }

  return response.json();
}

export async function updateProcurementStatus(id, status) {
  return request(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

export async function deleteProcurement(id) {
  const response = await fetch(
    `http://localhost:3000/procurements/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao excluir licitação.");
  }

  return true;
}

export function getLatestProcurements(procurements = [], limit = 5) {
  return safeProcurements(procurements)
    .sort((a, b) => {
      const dateA = new Date(a?.atualizadoEmISO || a?.criadoEmISO || 0);
      const dateB = new Date(b?.atualizadoEmISO || b?.criadoEmISO || 0);

      return dateB - dateA;
    })
    .slice(0, limit);
}

export function countProcurementsByStatus(procurements = []) {
  const initialSummary = {
    aguardandoAbertura: 0,
    aberto: 0,
    emAndamento: 0,
    suspensas: 0,
    revogadas: 0,
    finalizadas: 0,
  }

  return safeProcurements(procurements).reduce((summary, procurement) => {
    switch (procurement?.status) {
      case PROCUREMENT_STATUS.AGUARDANDO_ABERTURA:
        summary.aguardandoAbertura += 1
        break
      case PROCUREMENT_STATUS.ABERTO:
        summary.aberto += 1
        break
      case PROCUREMENT_STATUS.EM_ANDAMENTO:
        summary.emAndamento += 1
        break
      case PROCUREMENT_STATUS.SUSPENSO:
        summary.suspensas += 1
        break
      case PROCUREMENT_STATUS.REVOGADO:
        summary.revogadas += 1
        break
      case PROCUREMENT_STATUS.FINALIZADO:
        summary.finalizadas += 1
        break
      default:
        break
    }

    return summary
  }, initialSummary)
}

export function getTotalProcurements(procurements = []) {
  return safeProcurements(procurements).length
}

export function getProcurementsChartData(procurements = []) {
  const safeList = safeProcurements(procurements)
  const total = getTotalProcurements(safeList)

  if (total === 0) {
    return []
  }

  const statusCount = safeList.reduce((acc, procurement) => {
    const status = procurement?.status

    if (!status) {
      return acc
    }

    acc[status] = (acc[status] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(statusCount).map(([status, quantity]) => ({
    label: PROCUREMENT_STATUS_LABELS[status] || status,
    percent: ((quantity / total) * 100),
    cor: STATUS_COLORS[status] ?? "#64748b",
  }))
}

function parseBrazilianDate(dateString) {
  if (!dateString) return null

  const [day, month, year] = dateString.split("/")
  return new Date(year, month - 1, day)
}

export async function updateOpeningStatuses(procurements = []) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const updatedProcurements = await Promise.all(
    safeProcurements(procurements).map(async (procurement) => {
      const openingDate = parseBrazilianDate(procurement.abertura)

      if (!openingDate) {
        return procurement
      }

      openingDate.setHours(0, 0, 0, 0)

      const shouldBeOpen = openingDate <= today
      const shouldBeWaiting = openingDate > today
      const currentStatus = normalizeStatusValue(procurement.status);

      const isAutomaticStatus =
        currentStatus === PROCUREMENT_STATUS.AGUARDANDO_ABERTURA ||
        currentStatus === PROCUREMENT_STATUS.ABERTO;

      if (!isAutomaticStatus) {
        return procurement
      }

      if (
        shouldBeOpen &&
        currentStatus !== PROCUREMENT_STATUS.ABERTO
      ) {
        return updateProcurementStatus(
          procurement.id,
          PROCUREMENT_STATUS.ABERTO
        )
      }

      if (
        shouldBeWaiting &&
        currentStatus !== PROCUREMENT_STATUS.AGUARDANDO_ABERTURA
      ) {
        return updateProcurementStatus(
          procurement.id,
          PROCUREMENT_STATUS.AGUARDANDO_ABERTURA
        )
      }

      return procurement
    })
  )

  return updatedProcurements
}