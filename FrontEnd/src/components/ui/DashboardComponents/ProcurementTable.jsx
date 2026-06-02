import { useNavigate } from "react-router-dom"
import { STATUS_BADGES } from "../../../services/procurementService"
import { formatProcurementNumber, getProcurementOpeningDate, getProcurementObjeto, getProcurementStatus } from "../../../utils/procurementFormatters"

function ProcurementTable({ procurements = [], loading }) {
    const navigate = useNavigate()
    const visibleProcurements = procurements.slice(0, 4)
    const hasProcurements = visibleProcurements.length > 0

    return (
        <div className="card tabela-card">
            <h3 className="tabela-titulo">Últimas Modificações</h3>

            <table className="tabela">
                <thead>
                <tr>
                    <th>Nº do Processo</th>
                    <th>Objeto</th>
                    <th>Status</th>
                    <th>Data de Abertura</th>
                </tr>
                </thead>

                <tbody>
                {loading && (
                    <tr>
                        <td colSpan={4} className="tabela-empty">
                            Carregando...
                        </td>
                    </tr>
                )}

                {!loading && !hasProcurements && (
                    <tr>
                        <td colSpan={4} className="tabela-empty">
                            Nenhuma licitação encontrada
                        </td>
                    </tr>
                )}

                {!loading &&
                    visibleProcurements.map((procurement) => {
                        const status = getProcurementStatus(procurement)

                        return (
                            <tr
                                key={procurement.id}
                                className="linha-dados linha-clicavel"
                                onClick={() => navigate(`/procurements/${procurement.id}`,{state: { from: "/dashboard"},})}
                            >
                                <td>{formatProcurementNumber(procurement)}</td>
                                <td>{getProcurementObjeto(procurement)}</td>
                                <td>
                    <span
                        className={`status-dot ${
                            STATUS_BADGES[status] ?? "badge-finalizado"
                        }`}
                        title={status}
                    />
                                </td>
                                <td>{getProcurementOpeningDate(procurement)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="tabela-rodape">
                <button
                    type="button"
                    className="btn-ver-todas"
                    onClick={() => navigate("/procurements")}
                >
                    Ver todas
                </button>
            </div>
        </div>
    )
}

export default ProcurementTable
