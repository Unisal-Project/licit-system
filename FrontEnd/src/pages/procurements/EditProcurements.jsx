<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Home, IdCard, Pencil, CalendarDays, FolderOpen, CircleDollarSign, Landmark, Paperclip, Save, FileText, Upload, X, Trash2 } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { Card, Button, EditAttachmentsModal } from "../../components/ui/main";
import FormatProcurements from "../../components/shared/FormatProcurements";
import { getProcurementById, updateProcurement, deleteProcurement } from "../../services/procurementService";
import { customSelectStyles } from "../../components/shared/styleSelect";
import { PROCUREMENT_TYPES, STATUS_OPTIONS, CLASSIFICATION_OPTIONS, SECRETARIAS, getOptionLabel, getOptionValue } from "../../utils/procurementOptions";
import "./DetailsProcurements.css";
=======
import React, { useState } from "react";
import { ArrowLeft, Home, Pencil, IdCard, CalendarDays, FolderOpen, CircleDollarSign, Landmark, Paperclip, Trash2, Save, X } from "lucide-react";
>>>>>>> 7e199fd45db4007b1cfcd3f47b3374dde7c6fd18
import "./EditProcurements.css";

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
  criadoEm: "",
};

<<<<<<< HEAD
const formatDateToBrazilian = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const formatDateToInput = (date) => {
  if (!date) return "";

  if (date.includes("-")) return date;
=======
const tiposLicitacao = ["Pregão Eletrônico", "Concorrência", "Tomada de Preços"];
const statusLicitacao = ["Aberto", "Em Andamento", "Suspenso", "Revogado", "Finalizado"];
const classificacoes = ["Global", "Por Item", "Por Lote"];
const secretarias = ["Secretaria Municipal de Administração", "Gabinete", "Secretaria Municipal de Governo", "Secretaria Municipal de Assistência e Desenvolvimento Social", "Secretaria Municipal de Cultura", "Secretaria Municipal de Desenvolvimento Econômico e Turismo", "Secretaria Municipal de Assuntos Jurídicos", "Secretaria Municipal de Desenvolvimento Urbano e Rural", "Secretaria Municipal de Educação", "Secretaria Municipal de Esporte, Lazer e Juventude", "Secretaria Municipal de Finanças", "Secretaria Municipal de Meio Ambiente", "Secretaria Municipal de Obras e Serviços Públicos", "Secretaria Municipal de Saúde", "Secretaria Municipal de Segurança Pública", "Secretaria Municipal da Pessoa com Deficiência", "Secretaria Municipal de Políticas Públicas", "Secretaria Municipal da Mulher e de Direitos Humanos", "Secretaria Municipal da Fazenda"];
>>>>>>> 7e199fd45db4007b1cfcd3f47b3374dde7c6fd18

  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

<<<<<<< HEAD
const getSelectedSecretaria = (value) => {
  return SECRETARIAS.find(
    (secretaria) => secretaria.value === value || secretaria.label === value
  );
};

function InputField({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="edit-field">
      <span>{label}</span>

      <input
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
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

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione",
}) {
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

  const hasCurrentValue = formattedOptions.some(
    (option) => option.value === value
  );

  const finalOptions =
    value && !hasCurrentValue
      ? [{ value, label: value }, ...formattedOptions]
      : formattedOptions;

  const selectedOption =
    finalOptions.find((option) => option.value === value) || null;
=======
  function handleChange(campo, valor) {
    setLicitacao((prev) => ({ ...prev, [campo]: valor }));
  }
>>>>>>> 7e199fd45db4007b1cfcd3f47b3374dde7c6fd18

  return (
    <label className="edit-field">
      <span>{label}</span>

      <Select
        classNamePrefix="edit-react-select"
        options={finalOptions}
        placeholder={placeholder}
        value={selectedOption}
        onChange={(selectedOption) => onChange(selectedOption?.value || "")}
        isSearchable
        noOptionsMessage={() => "Nenhuma opção encontrada"}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={customSelectStyles}
      />
    </label>
  );
}

function SecretariaSelect({ value, onChange }) {
  const selectedSecretaria = getSelectedSecretaria(value);

  return (
    <label className="edit-field">
      <span>Secretaria Responsável:</span>

      <Select
        classNamePrefix="edit-secretaria-select"
        options={SECRETARIAS}
        placeholder="Procurar Secretaria"
        isSearchable
        value={selectedSecretaria || null}
        onChange={(selectedOption) =>
          onChange(selectedOption?.value || "")
        }
        noOptionsMessage={() => "Nenhuma secretaria encontrada"}
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </label>
  );
}

function AttachmentItem({ attachment, onRemove }) {
  const fileName = attachment.name || attachment.nome;

  const fileSize =
    attachment.tamanho ||
    `${Math.max(1, Math.round((attachment.size || 0) / 1024))} KB`;

  return (
    <div className="edit-attachment-item">
      <div className="edit-attachment-info">
        <FileText size={18} />

        <div>
          <p>{fileName}</p>
          <span>{fileSize}</span>
        </div>
      </div>

      <button
        type="button"
        className="edit-remove-attachment"
        onClick={onRemove}
        aria-label={`Remover ${fileName}`}
      >
        <X size={16} />
      </button>
    </div>
  );
}

function AttachmentsEditor({ attachments, addAttachments, removeAttachment }) {
  const handleDrop = (event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    if (files.length > 0) {
      addAttachments({
        target: {
          files,
          value: "",
        },
      });
    }
  };

  return (
    <div className="edit-attachments">
      <label
        className="edit-upload-area"
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <Upload size={30} />

        <strong>
          Arraste ou <span>selecione</span>
        </strong>

        <small>PDF, DOCX, XLSX</small>

        <input type="file" multiple hidden onChange={addAttachments} />
      </label>

      <div className="edit-attachments-list">
        {attachments.length === 0 ? (
          <span className="edit-empty-attachments">Nenhum arquivo adicionado</span>
        ) : (
          attachments.map((attachment, index) => (
            <AttachmentItem
              key={`${attachment.name || attachment.nome}-${index}`}
              attachment={attachment}
              onRemove={() => removeAttachment(index)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EditProcurement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => { navigate(location.state?.from || "/dashboard");}

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProcurement() {
      try {
        setLoading(true);

        const procurement = await getProcurementById(id);

        const selectedSecretaria = getSelectedSecretaria(
          procurement.origem || procurement.secretaria
        );

        setFormData({
          numero: procurement.numero || "",
          ano: procurement.ano || "",
          tipo: getOptionValue(PROCUREMENT_TYPES, procurement.tipo),
          origem: procurement.origem || "",
          status: getOptionValue(STATUS_OPTIONS, procurement.status),
          objeto: procurement.objeto || "",
          descricao: procurement.descricao || "",
          classificacao: getOptionValue(CLASSIFICATION_OPTIONS, procurement.classificacao),
          valorEstimado: procurement.valorEstimado || "",
          dataPublicacao: formatDateToInput(procurement.publicacao),
          dataAbertura: formatDateToInput(procurement.abertura),
          secretaria:
            selectedSecretaria?.value ||
            procurement.origem ||
            procurement.secretaria ||
            "",
          criadoEm: procurement.criadoEm || "",
        });

        setAttachments(procurement.anexos || []);
      } catch (error) {
        console.error("Erro ao carregar licitação:", error);
        toast.error("Erro ao carregar licitação.");
      } finally {
        setLoading(false);
      }
    }

    loadProcurement();
  }, [id]);

  const updateField = (fieldName, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [fieldName]: value,
    }));
  };

  const handleCurrencyChange = (value) => {
    const numericValue = value.replace(/\D/g, "");

    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue / 100);

    updateField("valorEstimado", formattedValue);
  };

  const addAttachments = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    setAttachments((currentAttachments) => [
      ...currentAttachments,
      ...selectedFiles,
    ]);

    event.target.value = "";
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments((currentAttachments) =>
      currentAttachments.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSave = async () => {
    try {
      const selectedSecretaria = getSelectedSecretaria(formData.secretaria);

      const editedProcurement = {
        numero: formData.numero,
        ano: formData.ano,
        tipo: formData.tipo,

        origem: selectedSecretaria?.value || "",

        publicacao: formatDateToBrazilian(formData.dataPublicacao),
        abertura: formatDateToBrazilian(formData.dataAbertura),

        status: formData.status,

        objeto: formData.objeto,
        descricao: formData.descricao,

        classificacao: formData.classificacao,

        valorEstimado: formData.valorEstimado,

        secretaria: selectedSecretaria?.label || "",

        criadoEm: formData.criadoEm,
        atualizadoEm: new Date().toLocaleString("pt-BR"),
        atualizadoEmISO: new Date().toISOString(),
        
        anexos: attachments.map((file) => {
          if (file.nome) {
            return file;
          }

          return {
            nome: file.name,
            tamanho: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            tipo: file.name.split(".").pop(),
          };
        }),
      };

      await updateProcurement(id, editedProcurement);

      toast.success("Licitação editada com sucesso!");

      navigate(`/procurements/${id}`, {
        state: { from: location.state?.from || "/procurem" },
      });
    } catch (error) {
      console.error("Erro ao editar licitação:", error);
      toast.error("Erro ao editar licitação.");
    }
  };

  const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Deseja realmente excluir esta licitação?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteProcurement(id);

    toast.success("Licitação excluída com sucesso!");

    navigate("/procurements");
  } catch (error) {
    console.error("Erro ao excluir licitação:", error);

    toast.error("Erro ao excluir licitação.");
  }
};

  if (loading) {
    return <p>Carregando licitação...</p>;
  }

  const getOptionLabel = (options, value) => {
    return options.find((option) => option.value === value)?.label || value;
  };

  const tituloLicitacao = `${getOptionLabel(PROCUREMENT_TYPES, formData.tipo)} nº ${formData.numero}/${formData.ano}`;

  return (
    <div className="procurement-page">
      <Sidebar />

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
              <h1>Editar Licitação</h1>
              <p>Altere as informações da licitação</p>
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
              <p>Criada em {formData.criadoEm}</p>
            </div>

            <div className="details-actions">
              <EditAttachmentsModal
                attachments={attachments}
                addAttachments={addAttachments}
                removeAttachment={removeAttachment}
              />

              <Button className="btn-action btn-delete" onClick={handleDelete}>
                <Trash2 size={24} />
              </Button>

              <Button variant="secondary" className="btn-action btn-cancel" onClick={() => navigate(-1)}>
                <X size={24} />
              </Button>

              <Button className="btn-action btn-save" onClick={handleSave}>
                <Save size={24} />
              </Button>
            </div>
          </div>

          <div className="cards-grid">
            <Card title="Identificação" icon={IdCard} className="span-3">
              <div className="two-columns">
                <InputField
                  label="Número:"
                  placeholder="Ex.: 123"
                  value={formData.numero}
                  onChange={(value) => {
                    const onlyNumber = String(value || "").replace(/\D/g, "");
                    updateField("numero", onlyNumber);
                  }}
                />

                <InputField
                  label="Ano:"
                  placeholder="2026"
                  value={formData.ano}
                  onChange={(value) => {
                    const onlyNumber = String(value || "")
                      .replace(/\D/g, "")
                      .slice(0, 4);

                    updateField("ano", onlyNumber);
                  }}
                />
              </div>

              <SelectField
                label="Tipo de Licitação:"
                value={formData.tipo}
                onChange={(value) => updateField("tipo", value)}
                options={PROCUREMENT_TYPES}
              />

              <SelectField
                label="Status:"
                value={formData.status}
                onChange={(value) => updateField("status", value)}
                options={STATUS_OPTIONS}
              />
            </Card>

            <Card title="Descrição" icon={Pencil} className="span-5">
              <InputField
                label="Objeto:"
                placeholder="Digite o objeto da licitação"
                value={formData.objeto}
                onChange={(value) => updateField("objeto", value)}
              />

              <TextareaField
                label="Descrição do Objeto:"
                placeholder="Detalhe o objeto da licitação"
                value={formData.descricao}
                onChange={(value) => updateField("descricao", value)}
              />
            </Card>

            <Card title="Datas" icon={CalendarDays} className="span-4">
              <InputField
                label="Data de Publicação:"
                type="date"
                value={formData.dataPublicacao}
                onChange={(value) => updateField("dataPublicacao", value)}
              />

              <InputField
                label="Data de Abertura:"
                type="date"
                value={formData.dataAbertura}
                onChange={(value) => updateField("dataAbertura", value)}
              />
            </Card>

            <Card title="Classificação" icon={FolderOpen} className="span-3 compact-card">
              <div className="compact-card-content">
                <SelectField
                  label="Classificação:"
                  value={formData.classificacao}
                  onChange={(value) => updateField("classificacao", value)}
                  options={CLASSIFICATION_OPTIONS}
                />
              </div>
            </Card>

            <Card title="Financeiro" icon={CircleDollarSign} className="span-3 compact-card">
              <div className="compact-card-content">
                <InputField
                  label="Valor Estimado:"
                  placeholder="R$ 0,00"
                  value={formData.valorEstimado}
                  onChange={handleCurrencyChange}
                />
              </div>
            </Card>

            <Card title="Origem" icon={Landmark} className="span-3 compact-card origin-card">
              <div className="compact-card-content">
                <SecretariaSelect
                  value={formData.secretaria}
                  onChange={(value) => updateField("secretaria", value)}
                />
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

<<<<<<< HEAD
export default EditProcurement;
=======
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
>>>>>>> 7e199fd45db4007b1cfcd3f47b3374dde7c6fd18
