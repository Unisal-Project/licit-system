function DonutChart({ data = [] }) {
    const size = 220
    const radius = 80
    const strokeWidth = 44
    const circumference = 2 * Math.PI * radius

    if (!data.length || data.every((item) => item.percent === 0)) {
        return <div className="donut-vazio">Sem dados</div>
    }

    let accumulatedDash = 0

    const slices = data.map((item) => {
        const dash = (item.percent / 100) * circumference

        const slice = {
            ...item,
            dash,
            offset: circumference - accumulatedDash,
        }

        accumulatedDash += dash

        return slice
    })

    return (
        <div className="donut-wrapper">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {slices.map((slice) => (
                    <circle
                        key={slice.label}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={slice.cor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${slice.dash} ${circumference - slice.dash}`}
                        strokeDashoffset={slice.offset}
                    />
                ))}
            </svg>

            <div className="donut-legenda">
                {data.map((item) => (
                    <div className="legenda-item" key={item.label}>
            <span
                className="legenda-dot"
                style={{ background: item.cor }}
            />
                        <span className="legenda-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DonutChart