import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, IdCard, Pencil, CalendarDays, FolderOpen, CircleDollarSign, Landmark, Printer } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { Card, InfoField, StatusBadge, Button, AttachmentModal } from "../../components/ui/main";
import { getDeadlineInfo, getCurrentProcurementStatus } from "../../components/shared/procurementDeadline";
import FormatProcurements from "../../components/shared/FormatProcurements";
import { procurements } from "../../database/procurements";
import "./DetailsProcurements.css";

function DetailsProcurements() {
  const { id } = useParams();
  const navigate = useNavigate()

  const procurement = procurements.find((item) => item.id === Number(id));

  if (!procurement) {
    return <p>Licitação não encontrada.</p>;
  }

  const tituloLicitacao = FormatProcurements(procurement);
  const anexos = procurement.anexos ?? [];

  const currentStatus = getCurrentProcurementStatus(procurement);
  const deadlineInfo = getDeadlineInfo(procurement);

  return (
    <div className="procurement-page">
      <Sidebar />

      <main className="procurement-main">
        <header className="page-header">
          <div className="page-title-group">
            <button type="button" className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={26} />
            </button>

            <div>
              <h1>Detalhes da Licitação</h1>
              <p>Visualize informações da licitação</p>
            </div>
          </div>

          <nav className="breadcrumb">
            <Home size={15} />
            <span>/ Licitações /</span>
            <strong>{tituloLicitacao}</strong>
          </nav>
        </header>

        <section className="details-container">
          <div className="details-top">
            <div>
              <h2>{tituloLicitacao}</h2>
              <p>Criada em {procurement.criadoEm}</p>
            </div>

            <div className="details-actions">
              <AttachmentModal anexos={anexos} />
              
              <Link to={`/procurements/edit/${id}`}>
                <Button variant="secondary" className="btn">
                  <Pencil size={24} className="btn-icon" />
                  Editar
                </Button>
              </Link>

              <Button variant="primary" className="btn">
                <Printer size={24} />
                Imprimir
              </Button>
            </div>
          </div>

          <div className="cards-grid">
            <Card title="Identificação" icon={IdCard} className="span-3">
              <div className="two-columns">
                <InfoField label="Número:" value={procurement.numero} plain />
                <InfoField label="Ano:" value={procurement.ano} plain />
              </div>

              <InfoField label="Tipo de Licitação:" value={procurement.tipo} />

              <StatusBadge status={currentStatus} />
            </Card>

            <Card title="Descrição" icon={Pencil} className="span-5">
              <InfoField label="Objeto:" value={procurement.objeto} />
              <InfoField
                label="Descrição do Objeto:"
                value={procurement.descricao}
              />
            </Card>

            <Card title="Datas" icon={CalendarDays} className="span-4">
              <InfoField
                label="Data de Publicação:"
                value={procurement.publicacao}
              />
              <InfoField
                label="Data de Abertura:"
                value={procurement.abertura}
              />
            </Card>

            <Card
              title="Classificação"
              icon={FolderOpen}
              className="span-3 compact-card"
            >
              <div className="compact-card-content">
                <InfoField
                  label="Classificação:"
                  value={procurement.classificacao}
                />
              </div>
            </Card>

            <Card
              title="Financeiro"
              icon={CircleDollarSign}
              className="span-3 compact-card"
            >
              <div className="compact-card-content">
                <InfoField
                  label="Valor Estimado:"
                  value={procurement.valorEstimado}
                />
              </div>
            </Card>

            <Card
              title="Origem"
              icon={Landmark}
              className="span-3 compact-card"
            >
              <div className="compact-card-content">
                <InfoField
                  label="Secretaria Responsável:"
                  value={procurement.secretaria}
                  muted
                />
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
                  <strong className="countdown-days">
                    {deadlineInfo.value}
                  </strong>

                  <span className="countdown-text">
                    {deadlineInfo.description}
                  </span>
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