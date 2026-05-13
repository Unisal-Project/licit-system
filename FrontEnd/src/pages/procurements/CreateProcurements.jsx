import { useState } from "react"
import Input from "../../components/ui/Input/Input"
import Button from "../../components/ui/Button/Button"
import Sidebar from "../../components/layout/Sidebar"
import { Home, ArrowLeft, Upload, X, FileText, Edit, Printer, Paperclip } from "lucide-react"
import "./CreateProcurements.css"

function PageHeader() {
  return (
    <div className="page-header">
      <div className="page-header-esquerda">
        <button className="btn-back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1>Detalhes da Licitação</h1>
          <p>Visualize informações da licitação</p>
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

function SubHeader({ dados, onAnexo, onSalvar }) {
  const titulo = dados.tipo && dados.numero && dados.ano
    ? `${dados.tipo} nº ${dados.numero}/${dados.ano}`
    : "Nova Licitação"

  const agora = new Date()
  const criacao = agora.toLocaleDateString("pt-BR") + " às " +
    agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="subheader">
      <div className="subheader-esquerda">
        <h2>{titulo}</h2>
        <span className="subheader-criacao">Criada em {criacao}</span>
      </div>
      <div className="subheader-acoes">
        <button className="btn-anexo" onClick={onAnexo} title="Anexos">
          <Paperclip size={20} />
        </button>
        <Button variant="segundary" onClick={() => {}}>
          <Edit size={15} />
          Editar
        </Button>
        <Button variant="primary" onClick={onSalvar}>
          <Printer size={15} />
          Imprimir
        </Button>
      </div>
    </div>
  )
}

function Card({ icon, titulo, children }) {
  return (
    <div className="card">
      <div className="card-titulo">
        <i className={`bi ${icon}`}></i>
        <h3>{titulo}</h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

function CardIdentificacao({ dados, onChange }) {
  return (
    <Card icon="bi-person-badge" titulo="Identificação">
      <div className="campo-linha">
        <div className="campo">
          <label>Número:</label>
          <Input
            placeholder="Ex.: 021"
            value={dados.numero}
            onChange={(e) => onChange("numero", e.target.value)}
          />
        </div>
        <div className="campo campo-pequeno">
          <label>Ano:</label>
          <Input
            placeholder="2026"
            value={dados.ano}
            onChange={(e) => onChange("ano", e.target.value)}
          />
        </div>
      </div>
      <div className="campo">
        <label>Tipo de Licitação:</label>
        <div className="select-wrapper">
          <select value={dados.tipo} onChange={(e) => onChange("tipo", e.target.value)}>
            <option value="" disabled>Selecione</option>
            <option>Pregao Eletronico</option>
            <option>Concorrência</option>
            <option>Tomada de Preços</option>
            <option>Convite</option>
          </select>
        </div>
      </div>
      <div className="campo">
        <label>Status:</label>
        <div className="status-display">
          <span className="status-texto">
            {dados.status || ""}
          </span>
        </div>
      </div>
    </Card>
  )
}

function CardDescricao({ dados, onChange }) {
  return (
    <Card icon="bi-pencil" titulo="Descrição">
      <div className="campo">
        <label>Objeto:</label>
        <Input
          placeholder="Aquisição de equipamentos de informática..."
          value={dados.objeto}
          onChange={(e) => onChange("objeto", e.target.value)}
        />
      </div>
      <div className="campo">
        <label>Descrição do Objeto:</label>
        <textarea
          className="textarea"
          placeholder="Aquisição de computadores, notebooks e impressoras para atender às demandas..."
          value={dados.descricao}
          onChange={(e) => onChange("descricao", e.target.value)}
        />
      </div>
    </Card>
  )
}

function CardDatas({ dados, onChange }) {
  return (
    <Card icon="bi-calendar" titulo="Datas">
      <div className="campo">
        <label>Data de Publicação:</label>
        <input
          className="input-date"
          type="date"
          value={dados.dataPublicacao}
          onChange={(e) => onChange("dataPublicacao", e.target.value)}
        />
      </div>
      <div className="campo">
        <label>Data de Abertura:</label>
        <input
          className="input-date"
          type="date"
          value={dados.dataAbertura}
          onChange={(e) => onChange("dataAbertura", e.target.value)}
        />
      </div>
    </Card>
  )
}

function CardClassificacao({ dados, onChange }) {
  return (
    <Card icon="bi-folder" titulo="Classificação">
      <div className="campo">
        <label>Classificação:</label>
        <div className="select-wrapper">
          <select value={dados.classificacao} onChange={(e) => onChange("classificacao", e.target.value)}>
            <option value="" disabled>Selecione</option>
            <option>Tecnologia</option>
            <option>Global</option>
            <option>Por Item</option>
            <option>Por Lote</option>
          </select>
        </div>
      </div>
    </Card>
  )
}

function CardFinanceiro({ dados, onChange }) {
  return (
    <Card icon="bi-currency-dollar" titulo="Financeiro">
      <div className="campo">
        <label>Valor Estimado:</label>
        <Input
          placeholder="R$ 00,00"
          value={dados.valorEstimado}
          onChange={(e) => onChange("valorEstimado", e.target.value)}
        />
      </div>
    </Card>
  )
}

function CardOrigem({ dados, onChange }) {
  return (
    <Card icon="bi-bank" titulo="Origem">
      <div className="campo">
        <label>Secretaria Responsável:</label>
        <div className="select-wrapper">
          <i className="bi bi-search select-search-icon"></i>
          <select value={dados.secretaria} onChange={(e) => onChange("secretaria", e.target.value)}>
            <option value="" disabled>Procurar Secretaria</option>
            <option>Secretaria de Administração</option>
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
    </Card>
  )
}

function CardAnexos({ anexos, onAdd, onRemove }) {
  return (
    <Card icon="bi-paperclip" titulo="Anexos">
      <div className="card-anexos">
        <label className="upload-area">
          <Upload size={28} className="upload-icon" />
          <p>Arraste ou <span className="upload-link">clique para selecionar</span></p>
          <p className="upload-info">PDF, DOCX, XLSX</p>
          <input type="file" multiple hidden onChange={onAdd} />
        </label>
        {anexos.length > 0 && (
          <div className="anexos-lista">
            <p className="anexos-titulo">Arquivos ({anexos.length})</p>
            {anexos.map((anexo, index) => (
              <div className="anexo-item" key={index}>
                <div className="anexo-info">
                  <FileText size={15} />
                  <div>
                    <p>{anexo.name}</p>
                    <span>{(anexo.size / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
                <button className="btn-remover" onClick={() => onRemove(index)}>
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
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
  const [mostrarAnexos, setMostrarAnexos] = useState(false)

  const handleChange = (campo, valor) => {
    setDados((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleAddAnexo = (e) => {
    const files = Array.from(e.target.files)
    setAnexos((prev) => [...prev, ...files])
  }

  const handleRemoveAnexo = (index) => {
    setAnexos((prev) => prev.filter((_, i) => i !== index))
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

        <div className="conteudo-box">
          <SubHeader
            dados={dados}
            onAnexo={() => setMostrarAnexos((v) => !v)}
            onSalvar={handleSalvar}
          />
          
          <div className="grid-linha-1">
            <CardIdentificacao dados={dados} onChange={handleChange} />
            <CardDescricao dados={dados} onChange={handleChange} />
            <CardDatas dados={dados} onChange={handleChange} />
          </div>

          <div className="grid-linha-2">
            <CardClassificacao dados={dados} onChange={handleChange} />
            <CardFinanceiro dados={dados} onChange={handleChange} />
            <CardOrigem dados={dados} onChange={handleChange} />
          </div>

          {mostrarAnexos && (
            <CardAnexos
              anexos={anexos}
              onAdd={handleAddAnexo}
              onRemove={handleRemoveAnexo}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default CreateProcurements
