import { parseBrazilianDate, getTodayAtMidday} from "../../utils/dateUtils.js"

const WAITING_STATUS = "AGUARDANDO ABERTURA";

function normalizeStatus(status) {
  return String(status || "")
    .replace(/_/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

function calculateDaysUntil(openingDateString) {
  const openingDate = parseBrazilianDate(openingDateString);

  if (!openingDate) return null;

  const today = getTodayAtMidday();
  const differenceInMs = openingDate.getTime() - today.getTime();

  return Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
}

function formatDays(days) {
  const absoluteDays = Math.abs(days);

  return absoluteDays === 1 ? "1 dia" : `${absoluteDays} dias`;
}

export function getCurrentProcurementStatus(procurement) {
  const status = normalizeStatus(procurement.status);
  const daysUntilOpening = calculateDaysUntil(procurement.abertura);

  if (status === WAITING_STATUS && daysUntilOpening <= 0) {
    return "ABERTO";
  }

  return status;
}

export function getDeadlineInfo(procurement) {
  const status = getCurrentProcurementStatus(procurement);
  const daysUntilOpening = calculateDaysUntil(procurement.abertura);

  if (daysUntilOpening === null) {
    return {
      type: "neutral",
      label: "Prazo indisponível",
      value: "data_inválida",
      description: "Verifique a data de abertura",
    };
  }

  const isOpeningToday = daysUntilOpening === 0;
  const isBeforeOpening = daysUntilOpening > 0;
  const isAfterOpening = daysUntilOpening < 0;

  if (status === WAITING_STATUS) {
    return {
      type: "positive",
      label: "Aguardando abertura",
      value: formatDays(daysUntilOpening),
      description: "para abrir automaticamente",
    };
  }

  if (status === "ABERTO") {
    if (isBeforeOpening) {
      return {
        type: "positive",
        label: "Processo aberto",
        value: formatDays(daysUntilOpening),
        description: "para a abertura",
      };
    }

    if (isOpeningToday) {
      return {
        type: "positive",
        label: "Processo aberto",
        value: "Hoje",
        description: "é o dia da abertura",
      };
    }

    return {
      type: "positive",
      label: "Processo em aberto",
      value: formatDays(daysUntilOpening),
      description: "após a data de abertura",
    };
  }

  if (status === "EM ANDAMENTO") {
    return {
      type: "positive",
      label: "Processo em andamento",
      value: isAfterOpening
        ? formatDays(daysUntilOpening)
        : formatDays(Math.max(daysUntilOpening, 0)),
      description: isAfterOpening ? "desde a abertura" : "para a abertura",
    };
  }

  if (status === "SUSPENSO") {
    return {
      type: "neutral",
      label: "Processo suspenso",
      value: "Cronograma pausado",
      description: "aguardando retomada",
    };
  }

  if (status === "REVOGADO") {
    return {
      type: "negative",
      label: "Processo revogado",
      value: "Sem prazo ativo",
      description: "cronograma encerrado",
    };
  }

  if (status === "FINALIZADO") {
    return {
      type: "neutral",
      label: "Processo finalizado",
      value: "Encerrado",
      description: "processo concluído",
    };
  }

  return {
    type: "neutral",
    label: "Status desconhecido",
    value: "Prazo indisponível",
    description: status,
  };
}