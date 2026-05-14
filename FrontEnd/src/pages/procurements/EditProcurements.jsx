import React, { useState } from "react";
import { ArrowLeft, Home, Pencil, IdCard, CalendarDays, FolderOpen, CircleDollarSign, Landmark, Paperclip, Trash2, Save, X } from "lucide-react";
import "./EditProcurements.css";

const initialLicitacao = {
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
  anexos: [],
};

const tiposLicitacao = ["Pregão Eletrônico", "Concorrência", "Tomada de Preços"];
const statusLicitacao = ["Aberto", "Em Andamento", "Suspenso", "Revogado", "Finalizado"];
const classificacoes = ["Global", "Por Item", "Por Lote"];
const secretarias = ["Secretaria Municipal de Administração", "Gabinete", "Secretaria Municipal de Governo", "Secretaria Municipal de Assistência e Desenvolvimento Social", "Secretaria Municipal de Cultura", "Secretaria Municipal de Desenvolvimento Econômico e Turismo", "Secretaria Municipal de Assuntos Jurídicos", "Secretaria Municipal de Desenvolvimento Urbano e Rural", "Secretaria Municipal de Educação", "Secretaria Municipal de Esporte, Lazer e Juventude", "Secretaria Municipal de Finanças", "Secretaria Municipal de Meio Ambiente", "Secretaria Municipal de Obras e Serviços Públicos", "Secretaria Municipal de Saúde", "Secretaria Municipal de Segurança Pública", "Secretaria Municipal da Pessoa com Deficiência", "Secretaria Municipal de Políticas Públicas", "Secretaria Municipal da Mulher e de Direitos Humanos", "Secretaria Municipal da Fazenda"];

export default function EditarLicitacao() {
  const [licitacao, setLicitacao] = useState(initialLicitacao);

  function handleChange(campo, valor) {
    setLicitacao((prev) => ({ ...prev, [campo]: valor }));
  }

  return (
    <div className="wrapper">
      <main className="main">
        <div className="detalhes-wrapper">
          <PageHeader licitacao={licitacao} />
          <EditarCard licitacao={licitacao} onChange={handleChange} />
        </div>
      </main>
    </div>
  );
}

function PageHeader({ licitacao }) {
  const titulo = `Pregão Eletrônico nº ${licitacao.numero || "---"}/${licitacao.ano || "----"}`;

  return (
    <div className="page-header">
      <div className="page-header-esquerda">
        <button className="btn-back" type="button">
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
  );
}

function EditarCard({ licitacao, onChange }) {
  const titulo = `${licitacao.tipo || "Licitação"} nº ${licitacao.numero || "---"}/${licitacao.ano || "----"}`;

  return (
    <div className="licitacao-card">
      <div className="licitacao-card-header">
        <div className="licitacao-card-titulo">
          <h2>{titulo}</h2>
          <p>Criada em {licitacao.dataCriacao || "Data não informada"}</p>
        </div>
        <div className="licitacao-card-acoes">
          <ButtonAction className="btn-excluir" icon={Trash2}>Excluir</ButtonAction>
          <ButtonAction className="btn-cancelar" icon={X}>Cancelar</ButtonAction>
          <ButtonAction className="btn-salvar" icon={Save}>Salvar</ButtonAction>
        </div>
      </div>

      <div className="cards-linha-1">
        <CardIdentificacao licitacao={licitacao} onChange={onChange} />
        <CardDescricao licitacao={licitacao} onChange={onChange} />
        <CardDatas licitacao={licitacao} onChange={onChange} />
      </div>

      <div className="cards-linha-2">
        <CardClassificacao licitacao={licitacao} onChange={onChange} />
        <CardFinanceiro licitacao={licitacao} onChange={onChange} />
        <CardOrigem licitacao={licitacao} onChange={onChange} />
        <CardAnexos licitacao={licitacao} onChange={onChange} />
      </div>
    </div>
  );
}

function CardIdentificacao({ licitacao, onChange }) {
  return (
    <CardSection icon={IdCard} title="Identificação">
      <div className="card-linha">
        <FormInput label="Número" value={licitacao.numero} onChange={(valor) => onChange("numero", valor)} />
        <FormInput label="Ano" value={licitacao.ano} onChange={(valor) => onChange("ano", valor)} />
      </div>
      <FormSelect label="Tipo de Licitação" value={licitacao.tipo} options={tiposLicitacao} onChange={(valor) => onChange("tipo", valor)} />
      <FormSelect label="Status" value={licitacao.status} options={statusLicitacao} onChange={(valor) => onChange("status", valor)} />
    </CardSection>
  );
}

function CardDescricao({ licitacao, onChange }) {
  return (
    <CardSection icon={Pencil} title="Descrição">
      <FormTextarea label="Objeto" value={licitacao.objeto} onChange={(valor) => onChange("objeto", valor)} />
      <FormTextarea label="Descrição do Objeto" value={licitacao.descricao} onChange={(valor) => onChange("descricao", valor)} />
    </CardSection>
  );
}

function CardDatas({ licitacao, onChange }) {
  return (
    <CardSection icon={CalendarDays} title="Datas">
      <FormInput label="Data de Publicação" type="date" value={licitacao.dataPublicacao} onChange={(valor) => onChange("dataPublicacao", valor)} />
      <FormInput label="Data de Abertura" type="date" value={licitacao.dataAbertura} onChange={(valor) => onChange("dataAbertura", valor)} />
    </CardSection>
  );
}

function CardClassificacao({ licitacao, onChange }) {
  return (
    <CardSection icon={FolderOpen} title="Classificação">
      <FormSelect label="Classificação" value={licitacao.classificacao} options={classificacoes} onChange={(valor) => onChange("classificacao", valor)} />
    </CardSection>
  );
}

function CardFinanceiro({ licitacao, onChange }) {
  return (
    <CardSection icon={CircleDollarSign} title="Financeiro">
      <FormInput label="Valor Estimado" value={licitacao.valorEstimado} onChange={(valor) => onChange("valorEstimado", valor)} />
    </CardSection>
  );
}

function CardOrigem({ licitacao, onChange }) {
  return (
    <CardSection icon={Landmark} title="Origem">
      <FormSelect label="Secretaria Responsável" value={licitacao.secretaria} options={secretarias} onChange={(valor) => onChange("secretaria", valor)} />
    </CardSection>
  );
}

function CardAnexos({ licitacao, onChange }) {
  function handleAdd(e) {
    const novos = Array.from(e.target.files)
    onChange("anexos", [...licitacao.anexos, ...novos])
  }

  function handleRemove(index) {
    onChange("anexos", licitacao.anexos.filter((_, i) => i !== index))
  }

  function removerTodos() {
    onChange("anexos", [])
  }

  return (
    <CardSection
      icon={Paperclip}
      title="Anexos"
      action={
        <button className="btn-excluir-todos" type="button" onClick={removerTodos}>
          <X size={14} />
          Excluir todos
        </button>
      }
    >
      <div className="card-anexos">
        <label className="upload-area">
          <Paperclip size={28} className="upload-icon" />
          <p>Arraste ou <span className="upload-link">clique para selecionar</span></p>
          <p className="upload-info">PDF, DOCX, XLSX</p>
          <input type="file" multiple hidden onChange={handleAdd} />
        </label>
        {licitacao.anexos.length > 0 && (
          <div className="anexos-lista">
            <p className="anexos-titulo">Arquivos ({licitacao.anexos.length})</p>
            {licitacao.anexos.map((anexo, index) => (
              <div className="anexo-item" key={index}>
                <div className="anexo-info">
                  <div>
                    <p className="card-valor">{anexo.name ?? anexo.nome}</p>
                    <span className="card-label">
                      {anexo.size ? `${(anexo.size / 1024).toFixed(0)} KB` : anexo.tamanho}
                    </span>
                  </div>
                </div>
                <button className="btn-remover-anexo" type="button" onClick={() => handleRemove(index)}>
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardSection>
  )
}

function CardSection({ icon: Icon, title, children, action, className = "" }) {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <Icon size={18} />
        <h3>{title}</h3>
        {action}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="campo">
      <span className="card-label">{label}</span>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function FormTextarea({ label, value, onChange }) {
  return (
    <label className="campo">
      <span className="card-label">{label}</span>
      <textarea className="input input-textarea" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function FormSelect({ label, value, options, onChange }) {
  return (
    <label className="campo">
      <span className="card-label">{label}</span>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>Selecione</option>
        {options.map((option) => (
          <option value={option} key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ButtonAction({ children, icon: Icon, className }) {
  return (
    <button className={className} type="button">
      <Icon size={16} />
      {children}
    </button>
  );
}