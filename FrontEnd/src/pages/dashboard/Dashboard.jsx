import { useEffect, useState } from "react"
import Sidebar from "../../components/layout/Sidebar"
import { PageHeader, CardStats, ProcurementTable, ChartCard, InfoCard, FooterBar } from "../../components/ui/main"
import { FolderOpen, ClockAlert } from "lucide-react"
import { getAllProcurements, getLatestProcurements, getProcurementsChartData, getTotalProcurements, countProcurementsByStatus, updateOpeningStatuses } from "../../services/procurementService"
import "./Dashboard.css"

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({})
  const [latestProcurements, setLatestProcurements] = useState([])
  const [chartData, setChartData] = useState([])
  const [totalProcurements, setTotalProcurements] = useState(0)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)

        const procurements = await getAllProcurements()
        const updatedProcurements = await updateOpeningStatuses(procurements)

        setSummary(countProcurementsByStatus(updatedProcurements))
        setTotalProcurements(getTotalProcurements(updatedProcurements))
        setChartData(getProcurementsChartData(updatedProcurements))
        setLatestProcurements(getLatestProcurements(updatedProcurements, 5))
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error)

        setSummary({})
        setTotalProcurements(0)
        setChartData([])
        setLatestProcurements([])
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="wrapper">
      <Sidebar />

      <main className="main">
        <PageHeader />

        <CardStats summary={summary} loading={loading} />

        <div className="meio-row">
          <ProcurementTable
            procurements={latestProcurements}
            loading={loading}
          />

          <div className="dashboard-lateral">
            <ChartCard chartData={chartData} loading={loading} />

            <div className="cards-total-row">
              <InfoCard
                label="Total de Licitações"
                value={totalProcurements}
                loading={loading}
                icon={FolderOpen}
              />

              <InfoCard
                label="Aguardando Abertura"
                value={summary?.aguardandoAbertura ?? 0}
                loading={loading}
                icon={ClockAlert}
                iconClass="card-aguardando-icon"
                valueClass="card-aguardando-valor"
              />
            </div>
          </div>
        </div>

        <FooterBar />
      </main>
    </div>
  )
}

export default Dashboard
