import { Plus, Link2} from "lucide-react"
import { useNavigate} from "react-router-dom";
import { canManageProcurements, getCurrentUserRole } from "../../../utils/permissions";

function FooterBar() {
    const navigate = useNavigate();
    const canUseActions = canManageProcurements(getCurrentUserRole());

    if (!canUseActions) {
        return null;
    }

    return (
        <div className="footer-acoes">
          <span className="footer-acoes-titulo">
            Ações Rápidas
          </span>

            <div className="footer-acoes-botoes">
                <button className="btn-acao" onClick={() => navigate("/procurements/create")}>
                    <Plus size={20} />
                    Nova Licitação
                </button>

                <button className="btn-acao" onClick={() => navigate("/remote-access")}>
                    <Link2 size={20} />
                    Gerar Acesso
                </button>
            </div>
        </div>
    )
}

export default FooterBar
