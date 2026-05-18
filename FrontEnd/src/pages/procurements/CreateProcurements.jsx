<<<<<<< HEAD
import React, { useMemo, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { Button, Input } from "../../components/ui/main";
import { ArrowLeft, CalendarDays, FileText, Folder, Home, Landmark, Paperclip, Pencil, Save, Upload, UserRoundCog, X, CircleDollarSign } from "lucide-react"
import { createProcurement } from "../../services/procurementService";
import { customSelectStyles } from "../../components/shared/styleSelect";
import { PROCUREMENT_TYPES, STATUS_OPTIONS, CLASSIFICATION_OPTIONS, SECRETARIAS, getOptionLabel, getOptionValue } from "../../utils/procurementOptions";
import "./CreateProcurements.css"


const INITIAL_FORM_DATA = {
  numero: "",
  ano: "",
  tipo: "",
  origem: "",
  status: "aguardando_abertura",
  objeto: "",
  descricao: "",
  classificacao: "",
  valorEstimado: "",
  dataPublicacao: "",
  dataAbertura: "",
  secretaria: "",
};
=======
import { useState } from "react"
import Input from "../../components/ui/Input/Input"
import Button from "../../components/ui/Button/Button"
import Sidebar from "../../components/layout/Sidebar"
import { Home, ArrowLeft, Upload, X, FileText, Edit, Printer, Paperclip } from "lucide-react"
import "./CreateProcurements.css"
>>>>>>> 7e199fd45db4007b1cfcd3f47b3374dde7c6fd18

function PageHeader() {
  const navigate = useNavigate();
  
  return (
<<<<<<< HEAD
    <header className="page-header">
      <div className="page-header-left">
        <button
            type="button"
            className="back-button-create"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={26} />
          </button>

=======
    <div className="page-header">
      <div className="page-header-esquerda">
        <button className="btn-back">
          <ArrowLeft size={18} />
        </button>
>>>>>>> 7e199fd45db4007b1cfcd3f47b3374dde7c6fd18
        <div>
          <h1>Detalhes da Licitação</h1>
          <p>Visualize informações da licitação</p>
        </div>
      </div>

      <nav className="breadcrumb" aria-label="breadcrumb">
        <Home size={15} />
        <span>/</span>
        <span>Licitações</span>
        <span>/</span>
        <strong>Nova Licitação</strong>
      </nav>
    </header>
  );
}

<<<<<<< HEAD
function FormCard({ icon: Icon, title, subtitle, className = "", children }) {
  return (
    <section className={`form-card ${className}`}>
      <div className="form-card-header">
        <Icon size={34} strokeWidth={1.8} />
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="form-card-body">{children}</div>
    </section>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={`field ${className}`}>
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="edit-field">
      <span>{label}</span>

      <textarea
        value={value || ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder = "Selecione", className = "" }) {
  const formattedOptions = options.map((option) => {
    if (typeof option === "string") {
      return {
        value: option,
        label: option,
      };
    }

    return {
      value: option.value,
      label: option.label,
    };
  });

  const safeValue =
    typeof value === "object" && value !== null ? value.value : value;

  const selectedOption =
    formattedOptions.find((option) => option.value === safeValue) || null;

  return (
    <label className={`create-field ${className}`}>
      <span>{label}</span>

      <Select
        classNamePrefix="create-react-select"
        options={formattedOptions}
        placeholder={placeholder}
        value={selectedOption}
        onChange={(selectedOption) => {
          onChange(selectedOption ? selectedOption.value : "");
        }}
        styles={customSelectStyles}
        isSearchable
        noOptionsMessage={() => "Nenhuma opção encontrada"}
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </label>
  );
}

function DateField({ label, value, onChange }) {
  const inputRef = React.useRef(null);

  const openCalendar = () => {
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  return (
    <label className="edit-field">
      <span>{label}</span>

      <div className="date-input-container">
        <button
          type="button"
          className="date-icon-button"
          onClick={openCalendar}
        >
          <CalendarDays size={22} />
        </button>

        <input
          ref={inputRef}
          type="date"
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}

function CardIdentificacao({ formData, updateField }) {
  return (
    <FormCard icon={UserRoundCog} title="Identificação" subtitle="Informe os dados básicos da licitação" className="card-identificacao">
      <div className="field-row two-columns">
        <label className="edit-field">
          <span>Número:</span>

          <Input
            placeholder="Ex.: 123"
            value={formData.numero}
            icon={FileText}
            onChange={(event) => {
              const onlyNumber = String(event.target.value || "").replace(/\D/g, "");

              updateField("numero", onlyNumber);
            }}
          />
        </label>
        
        <label className="edit-field">
          <span>Ano:</span>

          <Input
            placeholder="2026"
            value={formData.ano}
            icon={CalendarDays}
            onChange={(event) => {
              const onlyNumber = String(event.target.value || "")
                .replace(/\D/g, "")
                .slice(0, 4);

              updateField("ano", onlyNumber);
            }}
          />
        </label>
      </div>

      <div className="field-row two-columns">
        <SelectField 
          className="tipo-licitacao-select"
          label="Tipo de Licitação:" 
          placeholder="Selecione" 
          value={formData.tipo} 
          onChange={(value) => updateField("tipo", value)} 
          options={PROCUREMENT_TYPES} 
        />
      </div>
    </FormCard>
  );
}

function CardDescricao({ formData, updateField }) {
  return (
    <FormCard icon={Pencil} title="Descrição" subtitle="Descreva o objeto da licitação" className="card-descricao">
      <label className="edit-field">
        <span>Objeto:</span>

        <Input
          placeholder="Digite o objeto da licitação"
          value={formData.objeto}
          icon={Pencil}
          onChange={(event) =>
            updateField("objeto", event.target.value)
          }
        />
      </label>

      <TextareaField
        label="Descrição do Objeto:"
        placeholder="Detalhe o objeto, especificações e informações complementares..."
        value={formData.descricao}
        onChange={(value) => updateField("descricao", value)}
      />
    </FormCard>
  );
}

function CardClassificacao({ formData, updateField }) {
  return (
    <FormCard icon={Folder} title="Classificação" subtitle="Defina a Classificação" className="card-classificacao">
      <SelectField label="Classificação:" placeholder="Defina a Classificação" value={formData.classificacao} onChange={(value) => updateField("classificacao", value)} options={CLASSIFICATION_OPTIONS} />
    </FormCard>
  );
}

function CardFinanceiro({ formData, updateField }) {

  const handleCurrencyChange = (value) => {

    const numericValue = value.replace(/\D/g, "")

    const formattedValue = new Intl.NumberFormat(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    ).format(numericValue / 100)

    updateField("valorEstimado", formattedValue)
  }

  return (
    <FormCard
      icon={CircleDollarSign}
      title="Financeiro"
      subtitle="Informe o valor estimado"
      className="card-financeiro"
    >
      <label className="edit-field">
        <span>Valor Estimado:</span>

        <Input
          placeholder="R$ 0,00"
          value={formData.valorEstimado}
          icon={CircleDollarSign}
          onChange={(event) =>
            handleCurrencyChange(event.target.value)
          }
        />
      </label>
    </FormCard>
  )
}

function CardDatas({ formData, updateField }) {
  return (
    <FormCard icon={CalendarDays} title="Datas" subtitle="Defina as datas importantes" className="card-datas">
      <div className="field-row two-columns">
        <DateField
          label="Data de Publicação:"
          value={formData.dataPublicacao}
          onChange={(value) => updateField("dataPublicacao", value)}
        />

        <DateField
          label="Data de Abertura:"
          value={formData.dataAbertura}
          onChange={(value) => updateField("dataAbertura", value)}
        />
      </div>
    </FormCard>
  );
}

function CardOrigem({ formData, updateField }) {
  return (
    <FormCard
      icon={Landmark}
      title="Origem"
      subtitle="Selecione a secretaria responsável"
      className="card-origem"
    >
      <SelectField
        label="Secretaria Responsável:"
        options={SECRETARIAS}
        placeholder="Procurar Secretaria"
        value={formData.secretaria}
        onChange={(value) => updateField("secretaria", value)}
      />
    </FormCard>
  );
}

function AttachmentItem({ attachment, onRemove }) {
  const sizeInKb = useMemo(() => `${Math.max(1, Math.round(attachment.size / 1024))} KB`, [attachment.size]);

  return (
    <div className="attachment-item">
      <div className="attachment-info">
        <FileText size={18} />
        <div>
          <p>{attachment.name}</p>
          <span>{sizeInKb}</span>
        </div>
      </div>

      <button type="button" className="remove-attachment" onClick={onRemove} aria-label={`Remover ${attachment.name}`}>
        <X size={17} />
      </button>
    </div>
  );
}

function CardAnexos({ attachments, addAttachments, removeAttachment }) {
  const handleDrop = (event) => {
    event.preventDefault()

    const files = event.dataTransfer.files

    if (files.length > 0) {
      addAttachments({
        target: {
          files,
        },
      })
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  return (
    <FormCard
      icon={Paperclip}
      title="Anexos"
      subtitle="Faça upload dos arquivos relacionados"
      className="card-anexos-wrapper"
    >
      <div className="attachments-layout">
        <label
          className="upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <Upload size={38} />
          <strong>
            Arraste os arquivos aqui ou <span>clique para selecionar</span>
          </strong>
          <small>PDF, DOCX, XLSX • Máximo 10MB por arquivo</small>

          <input type="file" multiple hidden onChange={addAttachments} />
        </label>

        <div className="attachments-list">
          <p>Arquivos adicionados ({attachments.length})</p>

          <div className="attachments-scroll">
            {attachments.length === 0 ? (
              <span className="empty-attachments">
                Nenhum arquivo adicionado
              </span>
            ) : (
              attachments.map((attachment, index) => (
                <AttachmentItem
                  key={`${attachment.name}-${attachment.size}-${index}`}
                  attachment={attachment}
                  onRemove={() => removeAttachment(index)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </FormCard>
  )
}

const formatDateToBrazilian = (date) => {
  if (!date) return ""

  const [year, month, day] = date.split("-")

  return `${day}/${month}/${year}`
}

const getSelectedSecretaria = (value) => {
  return SECRETARIAS.find(
    (secretaria) => secretaria.value === value
=======
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
            <option>Secretaria Municipal de Administração</option>
            <option>Gabinete</option>
            <option>Secretaria Municipal de Governo</option>
            <option>Secretaria Municipal de Assistência e Desenvolvimento Social</option>
            <option>Secretaria Municipal de Cultura</option>
            <option>Secretaria Municipal de Desenvolvimento Econômico e Turismo</option>
            <option>Secretaria Municipal de Assuntos Jurídicos</option>
            <option>Secretaria Municipal de Desenvolvimento Urbano e Rural</option>
            <option>Secretaria Municipal de Educação</option>
            <option>Secretaria Municipal de Esporte, Lazer e Juventude</option>
            <option>Secretaria Municipal de Finanças</option>
            <option>Secretaria  Municipal de Meio Ambiente</option>
            <option>Secretaria Municipal de Obras e Serviços Públicos</option>
            <option>Secretaria Municipal de Saúde</option>
            <option>Secretaria Municipal de Segurança Pública</option>
            <option>Secretaria Municipal da Pessoa com Deficiência</option>
            <option>Secretaria Municipal de Políticas Públicas</option>
            <option>Secretaria Municipal da Mulher e de Direitos Humanos</option>
            <option>Secretaria Municipal da Fazenda</option>
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
>>>>>>> 7e199fd45db4007b1cfcd3f47b3374dde7c6fd18
  )
}

function CreateProcurements() {
<<<<<<< HEAD
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [attachments, setAttachments] = useState([]);

  const updateField = (fieldName, value) => {
    setFormData((currentData) => ({ ...currentData, [fieldName]: value }));
  };

  const addAttachments = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setAttachments((currentAttachments) => [...currentAttachments, ...selectedFiles]);
    event.target.value = "";
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments((currentAttachments) =>
      currentAttachments.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSave = async () => {

    try {

      const selectedSecretaria =
        getSelectedSecretaria(formData.secretaria)

      const newProcurement = {

        numero: formData.numero,
        ano: formData.ano,
        tipo: formData.tipo,

        origem: selectedSecretaria?.value || "",

        publicacao: formatDateToBrazilian(
          formData.dataPublicacao
        ),

        abertura: formatDateToBrazilian(
          formData.dataAbertura
        ),

        status: formData.status,

        objeto: formData.objeto,
        descricao: formData.descricao,

        classificacao: formData.classificacao,

        valorEstimado: formData.valorEstimado,

        secretaria: selectedSecretaria?.label || "",

        criadoEm: new Date().toLocaleString("pt-BR"),
        criadoEmISO: new Date().toISOString(),
        atualizadoEm: new Date().toLocaleString("pt-BR"),
        atualizadoEmISO: new Date().toISOString(),

        anexos: attachments.map((file) => ({
          nome: file.name,

          tamanho: `${Math.max(
            1,
            Math.round(file.size / 1024)
          )} KB`,

          tipo: file.name
            .split(".")
            .pop(),
        })),
      }

      await createProcurement(newProcurement)

      toast.success("Licitação criada com sucesso!")

      setFormData(INITIAL_FORM_DATA)

      setAttachments([])

      navigate("/ProcurementList")

    } catch (error) {

      console.error(
        "Erro ao criar licitação:",
        error
      )

      toast.error("Erro ao criar licitação.")
    }
  }
  return (
    <div className="create-procurements-page">
=======
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
>>>>>>> 7e199fd45db4007b1cfcd3f47b3374dde7c6fd18
      <Sidebar />

      <main className="create-procurements-main">
        <PageHeader />

<<<<<<< HEAD
        <div className="procurement-grid">
          <CardIdentificacao formData={formData} updateField={updateField} />
          <CardDescricao formData={formData} updateField={updateField} />
          <CardClassificacao formData={formData} updateField={updateField} />
          <CardFinanceiro formData={formData} updateField={updateField} />
          <CardDatas formData={formData} updateField={updateField} />
          <CardOrigem formData={formData} updateField={updateField} />
          <CardAnexos attachments={attachments} addAttachments={addAttachments} removeAttachment={removeAttachment} />
        </div>

        <footer className="form-actions">
          <Button variant="primary" onClick={handleSave}>
            <Save size={22} />
            Salvar
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
        </footer>
=======
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
>>>>>>> 7e199fd45db4007b1cfcd3f47b3374dde7c6fd18
      </main>
    </div>
  );
}

<<<<<<< HEAD
export default CreateProcurements;
=======
export default CreateProcurements
>>>>>>> 7e199fd45db4007b1cfcd3f47b3374dde7c6fd18
