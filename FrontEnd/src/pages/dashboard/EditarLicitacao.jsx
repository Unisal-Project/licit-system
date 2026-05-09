import React, { useState } from 'react'
import { ArrowLeft, Home, Pencil, IdCard, CalendarDays, FolderOpen, CircleDollarSign, Landmark, Paperclip, Trash2, Save, X } from "lucide-react";
import './EditarLicitacao.css'

const EditarLicitacao = () => {
  return (
    <div className="wrapper">
      <main className="main">
        <EditarDetalhes />
      </main>
    </div>
  )
}
function PageHeader({ titulo }) {
  return (
    <div className="page-header">
      <div className="page-header-esquerda">
        <button className="btn-back">
          <ArrowLeft size={18} />
        </button>
        <div className="titulo">
          <h1>Editar Licitação</h1>
          <p>Altere informações da licitação</p>
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

function EditarDetalhes() {
  const [licitacao, setLicitacao] = useState({
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

  function handleChange(campo, valor) {
    setLicitacao({ ...licitacao, [campo]: valor })
  }

  return (
    <div className="detalhes-wrapper">
      <PageHeader titulo={`Pregão Eletrônico nº ${licitacao.numero}/${licitacao.ano}`} />
      <EditarCard licitacao={licitacao} handleChange={handleChange} />
    </div>
  )
}

function EditarCard({ licitacao, handleChange }) {
  return (
    <div className="licitacao-card">
      <div className="licitacao-card-header">
        <div className="licitacao-card-titulo">
          <h2>Pregão Eletrônico nº {licitacao.numero}/{licitacao.ano}</h2>
          <p>Criada em {licitacao.dataCriacao}</p>
        </div>
        <div className="licitacao-card-acoes">
          <button className="btn-excluir">
            <Trash2 size={16} />
            Excluir
          </button>
          <button className="btn-cancelar">
            <X size={16} />
            Cancelar
          </button>
          <button className="btn-salvar">
            <Save size={16} />
            Salvar
          </button>
        </div>
      </div>

      <div className="cards-linha">
        <CardIdentificacaoEditar licitacao={licitacao} handleChange={handleChange} />
        <CardDescricaoEditar licitacao={licitacao} handleChange={handleChange} />
        <CardDatasEditar licitacao={licitacao} handleChange={handleChange} />
      </div>

      <div className="cards-linha">
        <CardClassificacaoEditar licitacao={licitacao} handleChange={handleChange} />
        <CardFinanceiroEditar licitacao={licitacao} handleChange={handleChange} />
        <CardOrigemEditar licitacao={licitacao} handleChange={handleChange} />
        <CardAnexosEditar licitacao={licitacao} handleChange={handleChange} />
      </div>

    </div>
  )
}

function CardIdentificacaoEditar({ licitacao, handleChange }) {
  return (
    <div className="card">
      <div className="card-header">
        <IdCard size={18} />
        <h3>Identificação</h3>
      </div>
      <div className="card-body">
        <div className="card-linha">
          <div className="campo">
            <span className="card-label">Número</span>
            <input
              className="input"
              type="text"
              value={licitacao.numero}
              onChange={(e) => handleChange("numero", e.target.value)}
            />
          </div>
          <div className="campo">
            <span className="card-label">Ano</span>
            <input
              className="input"
              type="text"
              value={licitacao.ano}
              onChange={(e) => handleChange("ano", e.target.value)}
            />
          </div>
        </div>
        <div className="campo">
          <span className="card-label">Tipo de Licitação</span>
          <select
            className="input"
            value={licitacao.tipo}
            onChange={(e) => handleChange("tipo", e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Pregão Eletrônico">Pregão Eletrônico</option>
            <option value="Concorrência">Concorrência</option>
            <option value="Tomada de Preços">Tomada de Preços</option>
          </select>
        </div>
        <div className="campo">
          <span className="card-label">Status</span>
          <select
            className="input"
            value={licitacao.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Aberto">Aberto</option>
            <option value="Fechado">Fechado</option>
            <option value="Suspenso">Suspenso</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function CardDescricaoEditar({ licitacao, handleChange }) {
  return (
    <div className="card card-largo">
      <div className="card-header">
        <Pencil size={18} />
        <h3>Descrição</h3>
      </div>
      <div className="card-body">
        <div className="campo">
          <span className="card-label">Objeto</span>
          <textarea
            className="input input-textarea"
            value={licitacao.objeto}
            onChange={(e) => handleChange("objeto", e.target.value)}
          />
        </div>
        <div className="campo">
          <span className="card-label">Descrição do Objeto</span>
          <textarea
            className="input input-textarea"
            value={licitacao.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function CardDatasEditar({ licitacao, handleChange }) {
  return (
    <div className="card">
      <div className="card-header">
        <CalendarDays size={18} />
        <h3>Datas</h3>
      </div>
      <div className="card-body">
        <div className="campo">
          <span className="card-label">Data de Publicação</span>
          <input
            className="input"
            type="date"
            value={licitacao.dataPublicacao}
            onChange={(e) => handleChange("dataPublicacao", e.target.value)}
          />
        </div>
        <div className="campo">
          <span className="card-label">Data de Abertura</span>
          <input
            className="input"
            type="date"
            value={licitacao.dataAbertura}
            onChange={(e) => handleChange("dataAbertura", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function CardClassificacaoEditar({ licitacao, handleChange }) {
  return (
    <div className="card">
      <div className="card-header">
        <FolderOpen size={18} />
        <h3>Classificação</h3>
      </div>
      <div className="card-body">
        <div className="campo">
          <span className="card-label">Classificação</span>
          <select
            className="input"
            value={licitacao.classificacao}
            onChange={(e) => handleChange("classificacao", e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Global">Global</option>
            <option value="Por Item">Por Item</option>
            <option value="Por Lote">Por Lote</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function CardFinanceiroEditar({ licitacao, handleChange }) {
  return (
    <div className="card">
      <div className="card-header">
        <CircleDollarSign size={18} />
        <h3>Financeiro</h3>
      </div>
      <div className="card-body">
        <div className="campo">
          <span className="card-label">Valor Estimado</span>
          <input
            className="input"
            type="text"
            value={licitacao.valorEstimado}
            onChange={(e) => handleChange("valorEstimado", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function CardOrigemEditar({ licitacao, handleChange }) {
  return (
    <div className="card">
      <div className="card-header">
        <Landmark size={18} />
        <h3>Origem</h3>
      </div>
      <div className="card-body">
        <div className="campo">
          <span className="card-label">Secretaria Responsável</span>
          <select
            className="input"
            value={licitacao.secretaria}
            onChange={(e) => handleChange("secretaria", e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="Secretaria de Administração">Secretaria de Administração</option>
            <option value="Secretaria de Educação">Secretaria de Educação</option>
            <option value="Secretaria de Saúde">Secretaria de Saúde</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function CardAnexosEditar({ licitacao, handleChange }) {
  function handleRemoverAnexo(nome) {
    const novosAnexos = licitacao.anexos.filter((a) => a.nome !== nome)
    handleChange("anexos", novosAnexos)
  }

  return (
    <div className="card">
      <div className="card-header">
        <Paperclip size={18} />
        <h3>Anexos</h3>
        <button className="btn-excluir-todos">
          <X size={14} />
          Excluir todos
        </button>
      </div>
      <div className="card-body">
        {licitacao.anexos.map((anexo) => (
          <div className="anexo-item" key={anexo.nome}>
            <div className="anexo-info">
              <div>
                <p className="card-valor">{anexo.nome}</p>
                <span className="card-label">{anexo.tamanho}</span>
              </div>
            </div>
            <button
              className="btn-remover-anexo"
              onClick={() => handleRemoverAnexo(anexo.nome)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default EditarLicitacao