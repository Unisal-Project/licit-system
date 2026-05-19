import { SECRETARIAS } from "../../utils/procurementOptions";

export const statusOptions = [
    { label: "Aguardando Abertura", value: "aguardando_abertura", dotClass: "gray", extraClass: "large-status" },
    { label: "Aberto", value: "aberto", dotClass: "green" },
    { label: "Em Andamento", value: "em_andamento", dotClass: "blue", extraClass: "large-status" },
    { label: "Suspenso", value: "suspenso", dotClass: "red" },
    { label: "Revogado", value: "revogado", dotClass: "orange" },
    { label: "Finalizado", value: "finalizado", dotClass: "dark" },
];

export const tipoOptions = [
    { label: "Pregão Eletrônico", value: "pregao_eletronico" },
    { label: "Concorrência Pública", value: "concorrencia_publica" },
];

export const origemOptions = SECRETARIAS;

export function filterProcurements(procurements, filters) {
    const { status, tipo, origem } = filters;

    return procurements.filter((item) => {
        const matchesStatus = status ? item.status === status : true;
        const matchesTipo = tipo ? item.tipo === tipo : true;
        const matchesOrigem = origem ? item.origem === origem : true;

        return matchesStatus && matchesTipo && matchesOrigem;
    });
}

export function paginateItems(items, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(items.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return {
        totalPages,
        currentItems: items.slice(indexOfFirstItem, indexOfLastItem),
    };
}

export function getStatusColor(status) {
    const normalizedStatus = String(status || "")
        .replace(/_/g, " ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();

    const colors = {
        "AGUARDANDO ABERTURA": "var(--text-secondary)",
        "ABERTO": "var(--success)",
        "EM ANDAMENTO": "var(--secondary)",
        "SUSPENSO": "var(--danger)",
        "REVOGADO": "var(--warning)",
        "FINALIZADO": "var(--bg-dark)",
    };

    return colors[normalizedStatus] || "var(--bg-dark)";
}
