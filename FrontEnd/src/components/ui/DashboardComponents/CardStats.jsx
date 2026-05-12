import { FileText, Clock, XCircle, PauseCircle, CheckSquare } from "lucide-react"

const STAT_CONFIG = [
    {
        label: "Aberto",
        key: "aberto",
        colorClass: "stat-verde",
        icon: FileText,
    },
    {
        label: "Em Andamento",
        key: "emAndamento",
        colorClass: "stat-azul",
        icon: Clock,
    },
    {
        label: "Suspensas",
        key: "suspensas",
        colorClass: "stat-vermelho",
        icon: XCircle,
    },
    {
        label: "Revogadas",
        key: "revogadas",
        colorClass: "stat-laranja",
        icon: PauseCircle,
    },
    {
        label: "Finalizadas",
        key: "finalizadas",
        colorClass: "stat-preto",
        icon: CheckSquare,
    },
]

function CardStats({ summary = {}, loading }) {
    return (
        <div className="stats-row">
            {STAT_CONFIG.map((stat) => {
                const Icon = stat.icon

                return (
                    <div className="stat-card" key={stat.key}>
                        <div className="stat-top">
                            <span className="stat-label">{stat.label}</span>

                            <div className={`stat-icon-box ${stat.colorClass}-icon`}>
                                <Icon size={20} />
                            </div>
                        </div>

                        <span className={`stat-valor ${stat.colorClass}`}>
              {loading ? "..." : summary[stat.key] ?? 0}
            </span>
                    </div>
                )
            })}
        </div>
    )
}

export default CardStats