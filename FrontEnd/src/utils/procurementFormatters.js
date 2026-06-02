export function formatProcurementNumber(procurement) {
    if (!procurement?.numero || !procurement?.ano) {
        return "Não informado"
    }

    return `${procurement.numero}/${procurement.ano}`
}

export function getProcurementOpeningDate(procurement) {
    return procurement?.abertura ?? "Não informado"
}

export function getProcurementObjeto(procurement) {
    return procurement?.objeto ?? "Não informado"
}

export function getProcurementStatus(procurement) {
    return procurement?.status ?? "Não informado"
}