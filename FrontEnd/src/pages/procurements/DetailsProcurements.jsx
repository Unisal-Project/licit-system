import React, { useEffect, useState }from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, IdCard, Pencil, CalendarDays, FolderOpen, CircleDollarSign, Landmark, Printer } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { Card, InfoField, StatusBadge, Button, AttachmentModal } from "../../components/ui/main";
import { getDeadlineInfo, getCurrentProcurementStatus } from "../../components/shared/procurementDeadline";
import { getProcurementById } from "../../services/procurementService";
import { PROCUREMENT_TYPES, getOptionLabel } from "../../utils/procurementOptions";
import { canManageProcurements, getCurrentUserRole } from "../../utils/permissions";
import "./DetailsProcurements.css";

function DetailsProcurements() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(location.state?.from || "/dashboard");
  };

  const [procurement, setProcurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProcurement() {
      try {
        setLoading(true);

        const data = await getProcurementById(id);

        setProcurement(data);
        setError("");
      } catch (error) {
        console.error("Erro ao buscar licitação:", error);
        setError("Licitação não encontrada.");
      } finally {
        setLoading(false);
      }
    }

    loadProcurement();
  }, [id]);

  if (loading) {
    return <p>Carregando licitação...</p>;
  }

  if (error || !procurement) {
    return <p>{error || "Licitação não encontrada."}</p>;
  }

  const tituloLicitacao = `${getOptionLabel(PROCUREMENT_TYPES, procurement.tipo)} nº ${procurement.numero}/${procurement.ano}`;

  const anexos = procurement.anexos ?? [];
  const currentStatus = getCurrentProcurementStatus(procurement);
  const deadlineInfo = getDeadlineInfo(procurement);
  const canEditProcurement = canManageProcurements(getCurrentUserRole());
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="procurement-page">
      <div className="screen-sidebar">
        <Sidebar />
      </div>

      <main className="procurement-main">
        <header className="page-header">
          <div className="page-title-group">
            <button
              type="button"
              className="back-button"
              onClick={handleBack}
            >
              <ArrowLeft size={26} />
            </button>

            <div>
              <h1>Detalhes da Licitação</h1>
              <p>Visualize informações da licitação</p>
            </div>
          </div>
        </header>

        <section className="details-container">
          <div className="details-top">
            <div>
              <h2>{tituloLicitacao}</h2>
              <p>Criada em {procurement.criadoEm}</p>
            </div>

            <div className="details-actions">
              <AttachmentModal anexos={anexos} />

              {canEditProcurement && (
                <Link to={`/procurements/edit/${id}`}
                      state={{from: location.state?.from || "/procurements"}}>
                  <Button variant="secondary" className="btn-action btn-edit">
                    <Pencil size={38} className="btn-icon" />
                  </Button>
                </Link>
              )}

              <Button
                variant="primary"
                className="btn-action btn-print"
                onClick={handlePrint}
              >
                <Printer size={38} />
              </Button>
            </div>
          </div>

          <div className="cards-grid">
            <Card title="Identificação" icon={IdCard} className="span-3">
              <div className="two-columns">
                <InfoField label="Número:" value={procurement.numero} plain />
                <InfoField label="Ano:" value={procurement.ano} plain />
              </div>

              <InfoField label="Tipo de Licitação:" value={getOptionLabel(PROCUREMENT_TYPES, procurement.tipo)} />
              <StatusBadge status={currentStatus} />
            </Card>

            <Card title="Descrição" icon={Pencil} className="span-5">
              <InfoField label="Objeto:" value={procurement.objeto} />
              <InfoField label="Descrição do Objeto:" value={procurement.descricao} />
            </Card>

            <Card title="Datas" icon={CalendarDays} className="span-4">
              <InfoField label="Data de Publicação:" value={procurement.publicacao} />
              <InfoField label="Data de Abertura:" value={procurement.abertura} />
            </Card>

            <Card title="Classificação" icon={FolderOpen} className="span-3 compact-card">
              <div className="compact-card-content">
                <InfoField label="Classificação:" value={procurement.classificacao} />
              </div>
            </Card>

            <Card title="Financeiro" icon={CircleDollarSign} className="span-3 compact-card">
              <div className="compact-card-content">
                <InfoField label="Valor Estimado:" value={procurement.valorEstimado} />
              </div>
            </Card>

            <Card title="Origem" icon={Landmark} className="span-3 compact-card">
              <div className="compact-card-content">
                <InfoField label="Secretaria Responsável:" value={procurement.secretaria} muted />
              </div>
            </Card>

            <Card
              title="Prazo"
              icon={CalendarDays}
              className={`span-3 compact-card deadline-card deadline-${deadlineInfo.type}`}
            >
              <div className="compact-card-content countdown-compact">
                <span className="countdown-label">{deadlineInfo.label}</span>

                <div className="countdown-line">
                  <strong className="countdown-days">{deadlineInfo.value}</strong>
                  <span className="countdown-text">{deadlineInfo.description}</span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DetailsProcurements;
