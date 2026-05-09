import React, { useState } from 'react'
import { FileText, ArrowLeft, Pencil, Printer, Home, IdCard, CalendarDays, FolderOpen, PlusCircle, CircleDollarSign, Landmark, Paperclip, Download } from "lucide-react";
import './Dashboard.css'
import Sidebar from '../../components/Sidebar/Sidebar'


function PageHeader({ titulo }) {
  return (
    <div className="page-header">
      <div className="page-header-esquerda">
        <button className="btn-back">
          <ArrowLeft size={18} />
        </button>
        <div className="titulo">
          <h1>Detalhes da Licitação</h1>
          <p>Visualize informações da licitação</p>
        </div>
      </div>
      <div className="page-header-direita">
        <div className="breadcrumb">
          <Home size={14} />
          <span>/</span>
          <span>Licitações</span>
          <span>/</span>
          <span className="breadcrumb-ativo">{titulo}</span>
        </div>
      </div>
    </div>
  )
}

function CardIdentificacao({ licitacao }) {
  return (
    <div className="card">
      <div className="card-header">
        <IdCard size={18} />
        <h3>Identificação</h3>
      </div>
      <div className="card-body">
        <div className="card-linha">
          <div>
            <span className="card-label">Número</span>
            <p className="card-valor">{licitacao.numero}</p>
          </div>
          <div>
            <span className="card-label">Ano</span>
            <p className="card-valor">{licitacao.ano}</p>
          </div>
        </div>
        <div>
          <span className="card-label">Tipo de Licitação</span>
          <p className="card-valor">{licitacao.tipo}</p>
        </div>
        <div>
          <span className="card-label">Status</span>
          <span className="badge-aberto">{licitacao.status}</span>
        </div>
      </div>
    </div>
  )
}

function CardDescricao({ licitacao }) {
  return (
    <div className="card card-largo">
      <div className="card-header">
        <Pencil size={18} />
        <h3>Descrição</h3>
      </div>
      <div className="card-body">
        <div>
          <span className="card-label">Objeto</span>
          <p className="card-valor">{licitacao.objeto}</p>
        </div>
        <div>
          <span className="card-label">Descrição do Objeto</span>
          <p className="card-valor">{licitacao.descricao}</p>
        </div>
      </div>
    </div>
  )
}

function CardDatas({ licitacao }) {
  return (
    <div className="card">
      <div className="card-header">
        <CalendarDays size={18} />
        <h3>Datas</h3>
      </div>
      <div className="card-body">
        <div>
          <span className="card-label">Data de Publicação</span>
          <p className="card-valor">{licitacao.dataPublicacao}</p>
        </div>
        <div>
          <span className="card-label">Data de Abertura</span>
          <p className="card-valor">{licitacao.dataAbertura}</p>
        </div>
      </div>
    </div>
  )
}

function CardClassificacao({ licitacao }) {
  return (
    <div className="card">
      <div className="card-header">
        <FolderOpen size={18} />
        <h3>Classificação</h3>
      </div>
      <div className="card-body">
        <div>
          <span className="card-label">Classificação</span>
          <p className="card-valor">{licitacao.classificacao}</p>
        </div>
        <button className="btn-lotes">
          <PlusCircle size={16} />
          Ver Lotes / Itens (3)
        </button>
      </div>
    </div>
  )
}

function CardFinanceiro({ licitacao }) {
  return (
    <div className="card">
      <div className="card-header">
        <CircleDollarSign size={18} />
        <h3>Financeiro</h3>
      </div>
      <div className="card-body">
        <div>
          <span className="card-label">Valor Estimado</span>
          <p className="card-valor">{licitacao.valorEstimado}</p>
        </div>
      </div>
    </div>
  )
}

function CardOrigem({ licitacao }) {
  return (
    <div className="card">
      <div className="card-header">
        <Landmark size={18} />
        <h3>Origem</h3>
      </div>
      <div className="card-body">
        <div>
          <span className="card-label">Secretaria Responsável</span>
          <p className="card-valor">{licitacao.secretaria}</p>
        </div>
      </div>
    </div>
  )
}

function CardAnexos({ licitacao }) {
  return (
    <div className="card">
      <div className="card-header">
        <Paperclip size={18} />
        <h3>Anexos</h3>
        <button className="btn-baixar-todos">
          <Download size={14} />
          Baixar todos
        </button>
      </div>
      <div className="card-body">
        {licitacao.anexos.map((anexo) => (
          <div className="anexo-item" key={anexo.nome}>
            <div className="anexo-info">
              <FileText size={16} />
              <div>
                <p className="card-valor">{anexo.nome}</p>
                <span className="card-label">{anexo.tamanho}</span>
              </div>
            </div>
            <button className="btn-download">
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function LicitacaoCard({ licitacao }) {
  return (
    <div className="licitacao-card">
      <div className="licitacao-card-header">
        <div className="licitacao-card-titulo">
          <h2>Pregão Eletrônico nº {licitacao.numero}/{licitacao.ano}</h2>
          <p>Criada em {licitacao.dataCriacao}</p>
        </div>
        <div className="licitacao-card-acoes">
          <button className="btn-editar">
            <Pencil size={16} />
            Editar
          </button>
          <button className="btn-imprimir">
            <Printer size={16} />
            Imprimir
          </button>
        </div>
      </div>
      <div className="cards-linha">
        <CardIdentificacao licitacao={licitacao} />
        <CardDescricao licitacao={licitacao} />
        <CardDatas licitacao={licitacao} />
      </div>
      <div className="cards-linha">
        <CardClassificacao licitacao={licitacao} />
        <CardFinanceiro licitacao={licitacao} />
        <CardOrigem licitacao={licitacao} />
        <CardAnexos licitacao={licitacao} />
      </div>
    </div>
  )
}

function DetalhesLicitacao() {
  const [licitacao] = useState({
    numero: "",
    ano: "",
    tipo: "",
    status: "",
    objeto: "",
    descricao: "",
    dataPublicacao: "",
    dataAbertura: "",
    dataCriacao: "",
    classificacao: "",
    valorEstimado: "",
    secretaria: "",
    anexos: []
  })
    
  return (
    <div className="detalhes-wrapper">
      <PageHeader titulo={`Pregão Eletrônico nº ${licitacao.numero}/${licitacao.ano}`} />
      <LicitacaoCard licitacao={licitacao} />
    </div>
  )
}

const Dashboard = () => {
  return (
    <div className="wrapper">
        <Sidebar />
      <main className="main">
        <DetalhesLicitacao />
      </main>
    </div>
  )
}

export default Dashboard