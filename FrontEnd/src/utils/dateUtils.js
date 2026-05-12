export function parseBrazilianDate(dateString) {
    if (!dateString) return null

    const [day, month, year] = dateString.split("/").map(Number)

    if (!day || !month || !year) return null

    return new Date(year, month - 1, day, 12, 0, 0)
}

export function parseBrazilianDateTime(dateTimeString) {
    if (!dateTimeString) return null

    const normalizedDate = dateTimeString
        .replace("às", "")
        .trim()

    const [datePart, timePart = "00:00"] = normalizedDate.split(/\s+/)

    const date = parseBrazilianDate(datePart)

    if (!date) return null

    const [hours = 0, minutes = 0] = timePart.split(":").map(Number)

    date.setHours(hours, minutes, 0, 0)

    return date
}

export function getTodayAtMidday() {
    const today = new Date()

    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        12,
        0,
        0
    )
}