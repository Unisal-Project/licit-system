import { procurements } from "../database/procurements"
import { parseBrazilianDateTime } from "../utils/dateUtils.js"

export const PROCUREMENT_STATUS = {
    AGUARDANDO_ABERTURA: "Aguardando Abertura",
    ABERTO: "Aberto",
    EM_ANDAMENTO: "Em Andamento",
    SUSPENSO: "Suspenso",
    REVOGADO: "Revogado",
    FINALIZADO: "Finalizado",
}

export const STATUS_COLORS = {
    [PROCUREMENT_STATUS.AGUARDANDO_ABERTURA]: "var(--text-secondary)",
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

function getSafeProcurements() {
    return Array.isArray(procurements) ? procurements : []
}

export function getAllProcurements() {
    return getSafeProcurements()
}

export function getLatestProcurements(limit = 5) {
    return [...getSafeProcurements()]
        .sort((a, b) => {
            const dateA = parseBrazilianDateTime(a?.criadoEm)
            const dateB = parseBrazilianDateTime(b?.criadoEm)

            return dateB - dateA
        })
        .slice(0, limit)
}

export function countProcurementsByStatus() {
    const initialSummary = {
        aguardandoAbertura: 0,
        aberto: 0,
        emAndamento: 0,
        suspensas: 0,
        revogadas: 0,
        finalizadas: 0,
    }

    return getSafeProcurements().reduce((summary, procurement) => {
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

export function getTotalProcurements() {
    return getSafeProcurements().length
}

export function getProcurementsChartData() {
    const total = getTotalProcurements()

    if (total === 0) {
        return []
    }

    const statusCount = getSafeProcurements().reduce((acc, procurement) => {
        const status = procurement?.status

        if (!status) {
            return acc
        }

        acc[status] = (acc[status] ?? 0) + 1
        return acc
    }, {})

    return Object.entries(statusCount).map(([status, quantity]) => ({
        label: status,
        percent: Math.round((quantity / total) * 100),
        cor: STATUS_COLORS[status] ?? "#64748b",
    }))
}