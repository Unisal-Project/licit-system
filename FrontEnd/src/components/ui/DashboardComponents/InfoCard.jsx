import AnimatedNumber from "./AnimatedNumber.jsx"

function InfoCard({ label, value, loading, icon: Icon, iconClass = "", valueClass = "" }) {
    return (
        <div className="card-total">
            <div className="card-total-esquerda">
                <span className="card-label">{label}</span>

                <span className={`card-valor ${valueClass}`}>
          {loading ? "..." : <AnimatedNumber value={value} />}
        </span>
            </div>

            <div className={`card-total-icon ${iconClass}`}>
                <Icon size={22} />
            </div>
        </div>
    )
}

export default InfoCard
