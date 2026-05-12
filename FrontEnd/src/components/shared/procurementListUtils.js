export const statusOptions = [
    { label: "Aguardando Abertura", dotClass: "gray", extraClass: "large-status" },
    { label: "Aberto", dotClass: "green" },
    { label: "Em Andamento", dotClass: "blue", extraClass: "large-status" },
    { label: "Suspenso", dotClass: "red" },
    { label: "Revogado", dotClass: "orange" },
    { label: "Finalizado", dotClass: "dark" },
];

export const tipoOptions = [
    { label: "Pregão Eletrônico", value: "Pregao Eletronico" },
    { label: "Concorrência Pública", value: "Concorrencia Publica" },
];

export const origemOptions = [
    "SEGOV", "SEFAZ", "SEAD", "SEFI", "SEMEC", "SEMUS", "SEESP",
    "SMSP", "SEAS", "SEPCD", "SEMDH", "SEC", "SEPP", "SEOS",
    "SEMA", "SEDU", "SEDET", "SEAJ",
];

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
    const normalizedStatus = status?.toUpperCase();

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