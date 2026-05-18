import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Home, IdCard, Pencil, CalendarDays, FolderOpen, CircleDollarSign, Landmark, Save, X, Trash2 } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import { Card, Button, EditAttachmentsModal } from "../../components/ui/main";
import { getProcurementById, updateProcurement, deleteProcurement } from "../../services/procurementService";
import { customSelectStyles } from "../../components/shared/styleSelect";
import { PROCUREMENT_TYPES, STATUS_OPTIONS, CLASSIFICATION_OPTIONS, SECRETARIAS, getOptionLabel, getOptionValue } from "../../utils/procurementOptions";
import "./DetailsProcurements.css";
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

const formatDateToBrazilian = (date) => {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const formatDateToInput = (date) => {
  if (!date) return "";

  if (date.includes("-")) return date;

  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

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

export default EditProcurement;
