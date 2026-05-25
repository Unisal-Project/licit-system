import { Home, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

function PageHeader() {
    return (
        <div className="page-header">
            <div className="page-header-esquerda">
                <Link to="/ProcurementList" className="back-button">
                    <ArrowLeft size={26} />
                </Link>

                <div>
                    <h1>Painel de Controle</h1>
                    <p>Visão geral das licitações</p>
                </div>
            </div>

            <div className="breadcrumb">
                <Home size={14} />
                <span>/</span>
                <span>Licitações</span>
                <span>/</span>
                <span className="breadcrumb-ativo">Dashboard</span>
            </div>
        </div>
    )
}

export default PageHeader