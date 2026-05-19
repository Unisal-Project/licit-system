import { apiRequest } from "./api";
import {
  CLASSIFICATION_OPTIONS,
  PROCUREMENT_TYPES,
  SECRETARIAS,
  STATUS_OPTIONS,
  getOptionLabel,
  getOptionValue,
} from "../utils/procurementOptions";
import { mapApiAttachment } from "./attachmentService";

const DEFAULT_USER_ID = Number(import.meta.env.VITE_DEFAULT_USER_ID || 1);

export const PROCUREMENT_STATUS = {
  AGUARDANDO_ABERTURA: "aguardando_abertura",
  ABERTO: "aberto",
  EM_ANDAMENTO: "em_andamento",
  SUSPENSO: "suspenso",
  REVOGADO: "revogado",
  FINALIZADO: "finalizado",
};

export const PROCUREMENT_STATUS_LABELS = {
  [PROCUREMENT_STATUS.AGUARDANDO_ABERTURA]: "Aguardando Abertura",
  [PROCUREMENT_STATUS.ABERTO]: "Aberto",
  [PROCUREMENT_STATUS.EM_ANDAMENTO]: "Em Andamento",
  [PROCUREMENT_STATUS.SUSPENSO]: "Suspenso",
  [PROCUREMENT_STATUS.REVOGADO]: "Revogado",
  [PROCUREMENT_STATUS.FINALIZADO]: "Finalizado",
};

export const STATUS_COLORS = {
  [PROCUREMENT_STATUS.AGUARDANDO_ABERTURA]: "var(--aguardando)",
  [PROCUREMENT_STATUS.ABERTO]: "var(--success)",
  [PROCUREMENT_STATUS.EM_ANDAMENTO]: "var(--secondary)",
  [PROCUREMENT_STATUS.SUSPENSO]: "var(--danger)",
  [PROCUREMENT_STATUS.REVOGADO]: "var(--warning)",
  [PROCUREMENT_STATUS.FINALIZADO]: "var(--bg-dark)",
};

export const STATUS_BADGES = {
  [PROCUREMENT_STATUS.AGUARDANDO_ABERTURA]: "badge-aguardando",
  [PROCUREMENT_STATUS.ABERTO]: "badge-aberto",
  [PROCUREMENT_STATUS.EM_ANDAMENTO]: "badge-andamento",
  [PROCUREMENT_STATUS.SUSPENSO]: "badge-suspenso",
  [PROCUREMENT_STATUS.REVOGADO]: "badge-revogado",
  [PROCUREMENT_STATUS.FINALIZADO]: "badge-finalizado",
};

const API_STATUS_LABELS = {
  [PROCUREMENT_STATUS.AGUARDANDO_ABERTURA]: "Aguardando Abertura",
  [PROCUREMENT_STATUS.ABERTO]: "Aberto",
  [PROCUREMENT_STATUS.EM_ANDAMENTO]: "Em Andamento",
  [PROCUREMENT_STATUS.SUSPENSO]: "Suspenso",
  [PROCUREMENT_STATUS.REVOGADO]: "Revogado",
  [PROCUREMENT_STATUS.FINALIZADO]: "Finalizado",
};

function safeList(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeText(value) {
  return String(value || "")
    .replace(/_/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizeStatusValue(status) {
  const statusMap = {
    "aguardando abertura": PROCUREMENT_STATUS.AGUARDANDO_ABERTURA,
    aberto: PROCUREMENT_STATUS.ABERTO,
    "em andamento": PROCUREMENT_STATUS.EM_ANDAMENTO,
    suspenso: PROCUREMENT_STATUS.SUSPENSO,
    revogado: PROCUREMENT_STATUS.REVOGADO,
    finalizado: PROCUREMENT_STATUS.FINALIZADO,
  };

  return statusMap[normalizeText(status)] || status || PROCUREMENT_STATUS.ABERTO;
}

function toApiStatus(status) {
  return API_STATUS_LABELS[normalizeStatusValue(status)] || status || "Aguardando Abertura";
}

function parseDateOnly(date) {
  const apiDate = toApiDate(date);

  if (!apiDate) return null;

  const [year, month, day] = apiDate.split("-").map(Number);

  return new Date(year, month - 1, day, 12, 0, 0);
}

function getTodayDateOnly() {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
}

function getDateBasedStatus(status, openingDate) {
  const normalizedStatus = normalizeStatusValue(status);
  const isAutomaticStatus =
    normalizedStatus === PROCUREMENT_STATUS.AGUARDANDO_ABERTURA ||
    normalizedStatus === PROCUREMENT_STATUS.ABERTO ||
    !normalizedStatus;

  if (!isAutomaticStatus) {
    return normalizedStatus;
  }

  const parsedOpeningDate = parseDateOnly(openingDate);

  if (parsedOpeningDate && parsedOpeningDate > getTodayDateOnly()) {
    return PROCUREMENT_STATUS.AGUARDANDO_ABERTURA;
  }

  return PROCUREMENT_STATUS.ABERTO;
}

function toApiType(type) {
  return getOptionLabel(PROCUREMENT_TYPES, type) || type;
}

function toApiClassification(classification) {
  const label = getOptionLabel(CLASSIFICATION_OPTIONS, classification);

  if (label === "Por Item") return "Item";
  if (label === "Por Lote") return "Lote";

  return label || "Global";
}

function toBrazilianDate(date) {
  if (!date) return "";

  const value = String(date);

  if (value.includes("/")) return value;

  const [year, month, day] = value.slice(0, 10).split("-");

  if (!year || !month || !day) return "";

  return `${day}/${month}/${year}`;
}

function toApiDate(date) {
  if (!date) return null;

  const value = String(date);

  if (value.includes("-")) return value.slice(0, 10);

  const [day, month, year] = value.split("/");

  if (!day || !month || !year) return null;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function toInputDate(date) {
  return toApiDate(date) || "";
}

function toCurrency(value) {
  if (value === null || value === undefined || value === "") return "";

  const numericValue =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, ""));

  if (Number.isNaN(numericValue)) return String(value);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
}

function toDecimal(value) {
  if (value === null || value === undefined || value === "") return null;

  const normalized = String(value)
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numericValue = Number(normalized);

  return Number.isNaN(numericValue) ? null : numericValue;
}

function formatDateTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("pt-BR");
}

function getDepartmentOption(department) {
  return {
    id: department.id,
    value: department.sigla,
    label: department.nome,
  };
}

function getCategoryClassificationValue(category) {
  const type = normalizeText(category?.tipo || category?.nome);

  if (type === "item" || type === "por item") return "por_item";
  if (type === "lote" || type === "por lote") return "por_lote";

  return "global";
}

function findDepartmentId(formData, departments = []) {
  if (formData.department_id || formData.departmentId) {
    return Number(formData.department_id || formData.departmentId);
  }

  const departmentValue = formData.secretaria || formData.origem;
  const normalizedValue = normalizeText(departmentValue);

  const department = safeList(departments).find((item) => {
    return (
      normalizeText(item.sigla) === normalizedValue ||
      normalizeText(item.nome) === normalizedValue
    );
  });

  return department?.id ? Number(department.id) : null;
}

function findCategoryId(formData, categories = []) {
  if (formData.category_id || formData.categoryId) {
    return Number(formData.category_id || formData.categoryId);
  }

  const classification = toApiClassification(formData.classificacao);
  const normalizedClassification = normalizeText(classification);

  const category = safeList(categories).find((item) => {
    return (
      normalizeText(item.tipo) === normalizedClassification ||
      normalizeText(item.nome) === normalizedClassification
    );
  });

  return category?.id ? Number(category.id) : null;
}

function getCategoryPayload(formData) {
  const classification = toApiClassification(formData.classificacao);
  const categoryName = {
    Global: "Global",
    Item: "Por Item",
    Lote: "Por Lote",
  }[classification] || classification || "Global";

  return {
    nome: categoryName,
    tipo: classification || "Global",
  };
}

async function getOrCreateCategoryId(formData, categories = []) {
  const categoryId = findCategoryId(formData, categories);

  if (categoryId) {
    return categoryId;
  }

  const createdCategory = await createCategory(getCategoryPayload(formData));

  return Number(createdCategory?.id);
}

async function getBiddingDependencies() {
  const [departments, categories] = await Promise.all([
    getDepartments(),
    getCategories(),
  ]);

  return { departments, categories };
}

export function mapApiToView(bidding) {
  if (!bidding) return null;

  const tipo = getOptionValue(PROCUREMENT_TYPES, bidding.tipo);
  const status = normalizeStatusValue(bidding.status);
  const classificacao = getOptionValue(CLASSIFICATION_OPTIONS, bidding.classificacao);
  const origem = bidding.secretaria_sigla || bidding.origem || "";

  return {
    ...bidding,
    id: bidding.id,
    userId: bidding.usuario_id,
    departmentId: bidding.secretaria_id,
    categoryId: bidding.categoria_id,
    numero: bidding.numero,
    ano: bidding.ano,
    tipo,
    origem,
    publicacao: toBrazilianDate(bidding.data_publicacao),
    abertura: toBrazilianDate(bidding.data_abertura),
    status,
    objeto: bidding.objeto || "",
    descricao: bidding.descricao_objeto || "",
    classificacao,
    valorEstimado: toCurrency(bidding.valor_estimado),
    secretaria: bidding.secretaria || "",
    criadoEm: formatDateTime(bidding.criado_em),
    criadoEmISO: bidding.criado_em,
    atualizadoEm: formatDateTime(bidding.atualizado_em),
    atualizadoEmISO: bidding.atualizado_em,
    anexos: safeList(bidding.attachments || bidding.anexos).map(mapApiAttachment),
    dataPublicacao: toInputDate(bidding.data_publicacao),
    dataAbertura: toInputDate(bidding.data_abertura),
  };
}

export function mapApiToForm(bidding) {
  const view = mapApiToView(bidding);

  if (!view) return null;

  return {
    numero: view.numero || "",
    ano: view.ano || "",
    tipo: view.tipo || "",
    origem: view.origem || "",
    status: view.status || PROCUREMENT_STATUS.AGUARDANDO_ABERTURA,
    objeto: view.objeto || "",
    descricao: view.descricao || "",
    classificacao: view.classificacao || "global",
    valorEstimado: view.valorEstimado || "",
    dataPublicacao: view.dataPublicacao || "",
    dataAbertura: view.dataAbertura || "",
    secretaria: view.origem || "",
    departmentId: view.departmentId || "",
    categoryId: view.categoryId || "",
    criadoEm: view.criadoEm || "",
  };
}

export async function mapFormToApi(formData, { partial = false } = {}) {
  const { departments, categories } = await getBiddingDependencies();
  const departmentId = findDepartmentId(formData, departments);
  const categoryId = await getOrCreateCategoryId(formData, categories);

  if (!partial && !departmentId) {
    throw new Error("Selecione uma secretaria cadastrada na API.");
  }

  if (!partial && !categoryId) {
    throw new Error("Nenhuma categoria compatível foi encontrada na API.");
  }

  const openingDate = toApiDate(formData.dataAbertura || formData.abertura);
  const status = getDateBasedStatus(formData.status, openingDate);

  const payload = {
    department_id: departmentId,
    category_id: categoryId,
    number: formData.numero ? Number(formData.numero) : null,
    year: formData.ano ? Number(formData.ano) : null,
    bidding_type: toApiType(formData.tipo),
    status: toApiStatus(status),
    classification: toApiClassification(formData.classificacao),
    object_name: formData.objeto || "",
    object_description: formData.descricao || null,
    estimated_value: toDecimal(formData.valorEstimado),
    publication_date: toApiDate(formData.dataPublicacao || formData.publicacao),
    opening_date: openingDate,
  };

  if (!partial) {
    payload.user_id = DEFAULT_USER_ID;
  }

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      return partial ? value !== null && value !== undefined && value !== "" : value !== undefined;
    })
  );
}

export async function getDepartments() {
  return apiRequest("/departments/");
}

export async function getDepartmentOptions() {
  const departments = await getDepartments();
  const apiOptions = safeList(departments).map(getDepartmentOption);

  return apiOptions.length > 0 ? apiOptions : SECRETARIAS;
}

export async function getCategories() {
  return apiRequest("/categories/");
}

export async function createCategory(category) {
  return apiRequest("/categories/", {
    method: "POST",
    body: JSON.stringify(category),
  });
}

export async function getCategoryOptions() {
  const categories = await getCategories();

  return safeList(categories).map((category) => ({
    id: category.id,
    value: getCategoryClassificationValue(category),
    label: category.nome || category.tipo,
  }));
}

export async function getAllProcurements(params = {}) {
  const firstPage = await apiRequest(
    `/biddings/?${new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 100,
      ...params,
    })}`
  );

  const items = safeList(firstPage.items);
  const total = Number(firstPage.total || items.length);
  const limit = Number(firstPage.limit || 100);

  if (items.length >= total) {
    return items.map(mapApiToView);
  }

  const totalPages = Math.ceil(total / limit);
  const remainingPages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
  const remainingResponses = await Promise.all(
    remainingPages.map((page) =>
      apiRequest(
        `/biddings/?${new URLSearchParams({
          ...params,
          page,
          limit,
        })}`
      )
    )
  );

  return [
    ...items,
    ...remainingResponses.flatMap((response) => safeList(response.items)),
  ].map(mapApiToView);
}

export async function getProcurementById(id) {
  const response = await apiRequest(`/biddings/${id}`);

  return mapApiToView(response);
}

export async function createProcurement(formData) {
  const payload = await mapFormToApi(formData);

  return apiRequest("/biddings/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProcurement(id, formData) {
  const payload = await mapFormToApi(formData, { partial: true });

  const response = await apiRequest(`/biddings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return mapApiToView(response);
}

export async function updateProcurementStatus(id, status) {
  const response = await apiRequest(`/biddings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: toApiStatus(status) }),
  });

  return mapApiToView(response);
}

export async function deleteProcurement(id) {
  await apiRequest(`/biddings/${id}`, {
    method: "DELETE",
  });

  return true;
}

export function getLatestProcurements(procurements = [], limit = 5) {
  return [...safeList(procurements)]
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
  };

  return safeList(procurements).reduce((summary, procurement) => {
    switch (normalizeStatusValue(procurement?.status)) {
      case PROCUREMENT_STATUS.AGUARDANDO_ABERTURA:
        summary.aguardandoAbertura += 1;
        break;
      case PROCUREMENT_STATUS.ABERTO:
        summary.aberto += 1;
        break;
      case PROCUREMENT_STATUS.EM_ANDAMENTO:
        summary.emAndamento += 1;
        break;
      case PROCUREMENT_STATUS.SUSPENSO:
        summary.suspensas += 1;
        break;
      case PROCUREMENT_STATUS.REVOGADO:
        summary.revogadas += 1;
        break;
      case PROCUREMENT_STATUS.FINALIZADO:
        summary.finalizadas += 1;
        break;
      default:
        break;
    }

    return summary;
  }, initialSummary);
}

export function getTotalProcurements(procurements = []) {
  return safeList(procurements).length;
}

export function getProcurementsChartData(procurements = []) {
  const list = safeList(procurements);
  const total = getTotalProcurements(list);

  if (total === 0) {
    return [];
  }

  const statusCount = list.reduce((acc, procurement) => {
    const status = normalizeStatusValue(procurement?.status);

    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(statusCount).map(([status, quantity]) => ({
    label: PROCUREMENT_STATUS_LABELS[status] || status,
    percent: (quantity / total) * 100,
    cor: STATUS_COLORS[status] ?? "#64748b",
  }));
}

export async function updateOpeningStatuses(procurements = []) {
  return Promise.all(
    safeList(procurements).map(async (procurement) => {
      const currentStatus = normalizeStatusValue(procurement?.status);
      const dateBasedStatus = getDateBasedStatus(currentStatus, procurement?.abertura);

      if (dateBasedStatus === currentStatus) {
        return procurement;
      }

      try {
        return updateProcurementStatus(procurement.id, dateBasedStatus);
      } catch (error) {
        console.error("Erro ao atualizar status automático:", error);
        return procurement;
      }
    })
  );
}
