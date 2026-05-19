function DonutChart({ data = [] }) {
  const size = 220;
  const radius = 80;
  const strokeWidth = 44;
  const circumference = 2 * Math.PI * radius;

  if (!data.length || data.every((item) => item.percent === 0)) {
    return <div className="donut-vazio">Sem dados</div>;
  }

  const slices = data.map((item, index) => {
    const dash = (item.percent / 100) * circumference;
    const previousDash = data
      .slice(0, index)
      .reduce((total, previousItem) => {
        return total + (previousItem.percent / 100) * circumference;
      }, 0);

    return {
      ...item,
      dash,
      offset: -previousDash,
    };
  });

  return (
    <div className="donut-wrapper">
      <svg
        className="donut-chart"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {slices.map((slice) => (
          <circle
            key={slice.label}
            className="donut-slice"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={slice.cor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${slice.dash} ${circumference - slice.dash}`}
            strokeDashoffset={slice.offset}
            strokeLinecap="butt"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              "--slice-dash": slice.dash,
              "--slice-gap": circumference - slice.dash,
              "--slice-offset": slice.offset,
              "--donut-circumference": circumference,
            }}
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
  );
}

export default DonutChart;
