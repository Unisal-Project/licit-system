import DonutChart from "./DonutCard.jsx"

function ChartCard({ chartData = [], loading }) {
    return (
        <div className="card grafico-card">
            <h3 className="tabela-titulo">Licitações por Status</h3>

            {loading ? (
                <div className="donut-vazio">Carregando...</div>
            ) : (
                <DonutChart data={chartData} />
            )}
        </div>
    )
}

export default ChartCard