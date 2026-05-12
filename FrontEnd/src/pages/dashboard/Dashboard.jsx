import { useEffect, useState } from "react"
import Sidebar from "../../components/layout/Sidebar"
import { getLatestProcurements, getProcurementsChartData, getTotalProcurements, countProcurementsByStatus } from "../../services/procurementService"
import PageHeader from "../../components/ui/DashboardComponents/PageHeader"
import CardStats from "../../components/ui/DashboardComponents/CardStats"
import ProcurementTable from "../../components/ui/DashboardComponents/ProcurementTable"
import ChartCard from "../../components/ui/DashboardComponents/ChartCard"
import FooterBar from "../../components/ui/DashboardComponents/FooterBar"
import InfoCard from "../../components/ui/DashboardComponents/InfoCard";
import { FolderOpen, ClockAlert } from "lucide-react"
import "./Dashboard.css"

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({})
  const [latestProcurements, setLatestProcurements] = useState([])
  const [chartData, setChartData] = useState([])
  const [totalProcurements, setTotalProcurements] = useState(0)

  useEffect(() => {
    try {
      setSummary(countProcurementsByStatus())
      setTotalProcurements(getTotalProcurements())
      setChartData(getProcurementsChartData())
      setLatestProcurements(getLatestProcurements(5))
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)

      setSummary({})
      setTotalProcurements(0)
      setChartData([])
      setLatestProcurements([])
    } finally {
      setLoading(false)
    }
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

          <FooterBar/>
        </main>
      </div>
  )
}

export default Dashboard