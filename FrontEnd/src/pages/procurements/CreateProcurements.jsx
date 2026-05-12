import React, { useState } from "react"
import Input  from "../../components/ui/Input/Input"
import Button from "../../components/ui/Button/Button"
import Sidebar from "../../components/layout/Sidebar"
import {Home, Upload, X, FileText, ArrowLeft} from "lucide-react"
import "./CreateProcurements.css"
import {Link} from "react-router-dom";

function PageHeader() {
  return (
    <div className="page-header">
      <div className="page-header-esquerda">
        <Link to="/ProcurementList" className="back-button">
          <ArrowLeft size={26} />
        </Link>
        <div>
          <h1>Nova Licitação</h1>
          <p>Preencha os dados para criar uma nova licitação</p>
        </div>
      </div>
      <div className="breadcrumb">
        <Home size={14} />
        <span>/</span>
        <span>Licitações</span>
        <span>/</span>
        <span className="breadcrumb-ativo">Nova Licitação</span>
      </div>
    </div>
  )
}

function CardIdentificacao({ dados, onChange }) {
  return (
    <div className="card">
      <div className="card-titulo">
        <i className="bi bi-person-badge"></i>
        <div>
          <h3>Identificação</h3>
          <p>Informe os dados básicos da licitação</p>
        </div>
      </div>
      <div className="card-body">
        <div className="campo-linha">
          <div className="campo">
            <label>Numero:</label>
            <Input
              placeholder="Ex.: 123"
              value={dados.numero}
              onChange={(e) => onChange('numero', e.target.value)}
            />
          </div>
          <div className="campo campo-pequeno">
            <label>Ano:</label>
            <Input
              placeholder="2026"
              value={dados.ano}
              onChange={(e) => onChange('ano', e.target.value)}
            />
          </div>
        </div>
        <div className="campo-linha">
          <div className="campo">
            <label>Tipo de Licitação:</label>
            <div className="select-wrapper">
              <select
                value={dados.tipo}
                onChange={(e) => onChange('tipo', e.target.value)}
              >
                <option value=""disabled>Selecione</option>
                <option>Pregão Eletrônico</option>
                <option>Concorrência</option>
                <option>Tomada de Preços</option>
                <option>Convite</option>
              </select>
            </div>
          </div>
          <div className="campo">
            <label>Status:</label>
            <div className="select-wrapper">
              <select
                value={dados.status}
                onChange={(e) => onChange('status', e.target.value)}
              >
                <option value=""disabled>Selecione</option>
                <option>Aberto</option>
                <option>Fechado</option>
                <option>Cancelado</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardDescricao({ dados, onChange }) {
  return (
    <div className="card">
      <div className="card-titulo">
        <i className="bi bi-pencil"></i>
        <div>
          <h3>Descrição</h3>
          <p>Descreva o objeto da licitação</p>
        </div>
      </div>
      <div className="card-body">
        <div className="campo">
          <label>Objeto:</label>
          <Input
            placeholder="Digite o objeto da licitação"
            value={dados.objeto}
            onChange={(e) => onChange('objeto', e.target.value)}
          />
        </div>
        <div className="campo">
          <label>Descrição do Objeto:</label>
          <textarea
            className="textarea"
            placeholder="Detalhe o objeto, especificações e informações complementares..."
            value={dados.descricao}
            onChange={(e) => onChange('descricao', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function CardClassificacao({ dados, onChange }) {
  return (
    <div className="card">
      <div className="card-titulo">
        <i className="bi bi-folder"></i>
        <div>
          <h3>Classificação</h3>
          <p>Defina a Classificação</p>
        </div>
      </div>
      <div className="card-body">
        <div className="campo">
          <label>Classificação:</label>
          <div className="select-wrapper">
            <select
              value={dados.classificacao}
              onChange={(e) => onChange('classificacao', e.target.value)}
            >
             <option value="" disabled>Defina a Classificação</option>
              <option>Global</option>
              <option>Por Item</option>
              <option>Por Lote</option>
            </select>
          </div>
        </div>
        <Button variant="segundary">
          <Upload size={16}/>
          Panilha Excel (.xlsx)
        </Button>
      </div>
    </div>
  )
}

function CardFinanceiro({ dados, onChange }) {
  return (
    <div className="card">
      <div className="card-titulo">
        <i className="bi bi-currency-dollar"></i>
        <div>
          <h3>Financeiro</h3>
          <p>Informe o valor estimado</p>
        </div>
      </div>
      <div className="card-body">
        <div className="campo">
          <label>Valor Estimado:</label>
          <Input
            placeholder="R$ 00,00"
            value={dados.valorEstimado}
            onChange={(e) => onChange('valorEstimado', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function CardDatas({ dados, onChange }) {
  return (
    <div className="card">
      <div className="card-titulo">
        <i className="bi bi-calendar"></i>
        <div>
          <h3>Datas</h3>
          <p>Defina as datas importantes</p>
        </div>
      </div>
      <div className="card-body">
        <div className="campo">
          <label>Data de Publicação:</label>
          <input
            className="input-date"
            type="date"
            value={dados.dataPublicacao}
            onChange={(e) => onChange('dataPublicacao', e.target.value)}
          />
        </div>
        <div className="campo">
          <label>Data de Abertura:</label>
          <input
            className="input-date"
            type="date"
            value={dados.dataAbertura}
            onChange={(e) => onChange('dataAbertura', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

function CardOrigem({ dados, onChange }) {
  return (
    <div className="card">
      <div className="card-titulo">
        <i className="bi bi-bank"></i>
        <div>
          <h3>Origem</h3>
          <p>Selecione a secretaria responsável</p>
        </div>
      </div>
      <div className="card-body">
        <div className="campo">
          <div className="select-wrapper">
            <i className="bi bi-search select-search-icon"></i>
           <select
  value={dados.secretaria}
  onChange={(e) => onChange('secretaria', e.target.value)}
>
  <option value="" disabled>Procurar Secretaria</option>
  <option>SEGOV</option>
  <option>SEFAZ</option>
  <option>SEAD</option>
  <option>SEFI</option>
  <option>SEMEC</option>
  <option>SEMUS</option>
  <option>SEESP</option>
  <option>SMSP</option>
  <option>SEAS</option>
  <option>SEPCD</option>
  <option>SEMDH</option>
  <option>SEC</option>
  <option>SEPP</option>
  <option>SEOS</option>
  <option>SEMA</option>
  <option>SEDU</option>
  <option>SEDET</option>
  <option>SEAJ</option>
</select>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardAnexos({ anexos, onAdd, onRemove }) {
  return (
    <div className="card">
      <div className="card-titulo">
        <i className="bi bi-paperclip"></i>
        <div>
          <h3>Anexos</h3>
          <p>Faça upload dos arquivos relacionados</p>
        </div>
      </div>
      <div className="card-body card-anexos">
        <label className="upload-area">
          <Upload size={32} className="upload-icon"/>
          <p>Arraste os arquivos aqui ou <span className="upload-link">clique para selecionar</span></p>
          <p className="upload-info">PDF, DOCX, XLSX </p>
          <input type="file" multiple hidden onChange={onAdd}/>
        </label>
        {anexos.length > 0 && (
          <div className="anexos-lista">
            <p className="anexos-titulo">Arquivos adicionados ({anexos.length})</p>
            {anexos.map((anexo, index) => (
              <div className="anexo-item" key={index}>
                <div className="anexo-info">
                  <FileText size={16}/>
                  <div>
                    <p>{anexo.name}</p>
                    <span>{(anexo.size / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
                <button className="btn-remover" onClick={() => onRemove(index)}>
                  <X size={16}/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CreateProcurements() {
  const [dados, setDados] = useState({
    numero: "",
    ano: "",
    tipo: "",
    status: "",
    objeto: "",
    descricao: "",
    classificacao: "",
    valorEstimado: "",
    dataPublicacao: "",
    dataAbertura: "",
    secretaria: "",
  })
  const [anexos, setAnexos] = useState([])

  const handleChange = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }))
  }

  const handleAddAnexo = (e) => {
    const files = Array.from(e.target.files)
    setAnexos(prev => [...prev, ...files])
  }

  const handleRemoveAnexo = (index) => {
    setAnexos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSalvar = () => {
    console.log("Dados:", dados)
    console.log("Anexos:", anexos)
  }


   return (
    <div className="wrapper">
      <Sidebar />
      <main className="main">
        <PageHeader />
        <div className="cards-grid">
            
          <div className="cards-linha">
            <CardIdentificacao dados={dados} onChange={handleChange} />
            <CardDescricao dados={dados} onChange={handleChange} />
          </div>

          <div className="cards-linha">
            <CardClassificacao dados={dados} onChange={handleChange} />
            <CardFinanceiro dados={dados} onChange={handleChange} />
            <CardDatas dados={dados} onChange={handleChange} />
          </div>

          <div className="cards-linha">
            <CardOrigem dados={dados} onChange={handleChange} />
            <CardAnexos
              anexos={anexos}
              onAdd={handleAddAnexo}
              onRemove={handleRemoveAnexo}
            />
          </div>

        </div>
        <div className="rodape">
          <Button variant="primary" onClick={handleSalvar}>
            <i className="bi bi-floppy"></i>
            Salvar
          </Button>
          <Button variant="segundary">
            Cancelar
          </Button>
        </div>
      </main>
    </div>
  )
}

export default CreateProcurements