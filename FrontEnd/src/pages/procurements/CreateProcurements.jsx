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

function PageHeader() {
  const navigate = useNavigate();
  
  return (
    <header className="page-header">
      <div className="page-header-left">
        <button
            type="button"
            className="back-button-create"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={26} />
          </button>

        <div>
          <h1>Nova Licitação</h1>
          <p>Preencha os dados para criar uma nova licitação</p>
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
  )
}

function CreateProcurements() {
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
      <Sidebar />

      <main className="create-procurements-main">
        <PageHeader />

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
      </main>
    </div>
  );
}

export default CreateProcurements;