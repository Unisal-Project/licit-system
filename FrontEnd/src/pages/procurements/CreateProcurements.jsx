import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { Button, Input } from "../../components/ui/main";
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, FileText, Folder, Home, Landmark, Paperclip, Pencil, Save, Upload, UserRoundCog, X, CircleDollarSign } from "lucide-react"
import { createProcurement, getDepartmentOptions } from "../../services/procurementService";
import { uploadAttachments } from "../../services/attachmentService";
import { customSelectStyles } from "../../components/shared/styleSelect";
import { PROCUREMENT_TYPES, CLASSIFICATION_OPTIONS, SECRETARIAS } from "../../utils/procurementOptions";
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

const CALENDAR_WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const CALENDAR_MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const YEAR_RANGE_SIZE = 12;

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateFromInputValue = (date) => {
  if (!date) return null;

  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const getCalendarDays = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const previousMonthLastDay = new Date(year, month, 0).getDate();
  const days = [];

  for (let index = firstDay.getDay() - 1; index >= 0; index -= 1) {
    days.push({
      date: new Date(year, month - 1, previousMonthLastDay - index),
      outsideMonth: true,
    });
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push({
      date: new Date(year, month, day),
      outsideMonth: false,
    });
  }

  while (days.length % 7 !== 0) {
    const day = days.length - firstDay.getDay() - lastDay.getDate() + 1;
    days.push({
      date: new Date(year, month + 1, day),
      outsideMonth: true,
    });
  }

  return days;
};

function DateField({ label, value, onChange }) {
  const wrapperRef = React.useRef(null);
  const selectedDate = getDateFromInputValue(value);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(selectedDate || new Date());
  const [calendarView, setCalendarView] = useState("days");

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(selectedDate);
    }
  }, [value]);

  useEffect(() => {
    if (!isCalendarOpen) return;

    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCalendarOpen]);

  const openCalendar = () => {
    setIsCalendarOpen(true);
  };

  const displayValue = value ? formatDateToBrazilian(value) : "Selecione a data";
  const calendarDays = getCalendarDays(visibleMonth);
  const selectedInputValue = value || "";
  const todayInputValue = toDateInputValue(new Date());

  const changeMonth = (monthOffset) => {
    setVisibleMonth((currentMonth) => (
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1)
    ));
  };

  const changeYearRange = (yearOffset) => {
    setVisibleMonth((currentMonth) => (
      new Date(currentMonth.getFullYear() + yearOffset, currentMonth.getMonth(), 1)
    ));
  };

  const selectMonth = (monthIndex) => {
    setVisibleMonth((currentMonth) => (
      new Date(currentMonth.getFullYear(), monthIndex, 1)
    ));
    setCalendarView("days");
  };

  const selectYear = (year) => {
    setVisibleMonth((currentMonth) => (
      new Date(year, currentMonth.getMonth(), 1)
    ));
    setCalendarView("months");
  };

  const selectDate = (date) => {
    onChange(toDateInputValue(date));
    setIsCalendarOpen(false);
    setCalendarView("days");
  };

  const currentYear = visibleMonth.getFullYear();
  const startYear = currentYear - (currentYear % YEAR_RANGE_SIZE);
  const years = Array.from(
    { length: YEAR_RANGE_SIZE },
    (_, index) => startYear + index
  );

  return (
    <label className="edit-field">
      <span>{label}</span>

      <div className="date-input-container" ref={wrapperRef}>
        <button
          type="button"
          className="date-icon-button"
          onClick={openCalendar}
        >
          <CalendarDays size={22} />
        </button>

        <button
          type="button"
          className={`date-display-button${value ? "" : " is-placeholder"}`}
          onClick={openCalendar}
        >
          {displayValue}
        </button>

        {isCalendarOpen && (
          <div className="ios-calendar" role="dialog" aria-label={`Selecionar ${label}`}>
            <div className="ios-calendar-header">
              <button
                type="button"
                onClick={() => calendarView === "years" ? changeYearRange(-YEAR_RANGE_SIZE) : changeMonth(-1)}
                aria-label={calendarView === "years" ? "Anos anteriores" : "Mês anterior"}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                className="ios-calendar-title-button"
                onClick={() => setCalendarView(calendarView === "days" ? "months" : "days")}
              >
                {CALENDAR_MONTHS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
              </button>

              <button
                type="button"
                onClick={() => calendarView === "years" ? changeYearRange(YEAR_RANGE_SIZE) : changeMonth(1)}
                aria-label={calendarView === "years" ? "Próximos anos" : "Próximo mês"}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {calendarView === "days" && (
              <>
                <div className="ios-calendar-weekdays">
                  {CALENDAR_WEEKDAYS.map((weekday, index) => (
                    <span key={`${weekday}-${index}`}>{weekday}</span>
                  ))}
                </div>

                <div className="ios-calendar-grid">
                  {calendarDays.map(({ date, outsideMonth }) => {
                    const dateInputValue = toDateInputValue(date);
                    const isSelected = dateInputValue === selectedInputValue;
                    const isToday = dateInputValue === todayInputValue;

                    return (
                      <button
                        type="button"
                        key={dateInputValue}
                        className={[
                          "ios-calendar-day",
                          outsideMonth ? "is-outside-month" : "",
                          isSelected ? "is-selected" : "",
                          isToday ? "is-today" : "",
                        ].filter(Boolean).join(" ")}
                        onClick={() => selectDate(date)}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {calendarView === "months" && (
              <div className="ios-calendar-picker-grid">
                {CALENDAR_MONTHS.map((month, index) => (
                  <button
                    type="button"
                    key={month}
                    className={`ios-calendar-picker-option${index === visibleMonth.getMonth() ? " is-selected" : ""}`}
                    onClick={() => selectMonth(index)}
                  >
                    {month.slice(0, 3)}
                  </button>
                ))}

                <button
                  type="button"
                  className="ios-calendar-picker-option ios-calendar-year-shortcut"
                  onClick={() => setCalendarView("years")}
                >
                  {visibleMonth.getFullYear()}
                </button>
              </div>
            )}

            {calendarView === "years" && (
              <div className="ios-calendar-picker-grid">
                {years.map((year) => (
                  <button
                    type="button"
                    key={year}
                    className={`ios-calendar-picker-option${year === visibleMonth.getFullYear() ? " is-selected" : ""}`}
                    onClick={() => selectYear(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
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

function CardOrigem({ formData, updateField, secretariaOptions }) {
  return (
    <FormCard
      icon={Landmark}
      title="Origem"
      subtitle="Selecione a secretaria responsável"
      className="card-origem"
    >
      <SelectField
        label="Secretaria Responsável:"
        options={secretariaOptions}
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

const getSelectedSecretaria = (value, secretariaOptions = SECRETARIAS) => {
  return secretariaOptions.find(
    (secretaria) => secretaria.value === value || secretaria.label === value
  );
};

const REQUIRED_CREATE_FIELDS = [
  ["numero", "Número"],
  ["ano", "Ano"],
  ["tipo", "Tipo de Licitação"],
  ["objeto", "Objeto"],
  ["classificacao", "Classificação"],
  ["valorEstimado", "Valor Estimado"],
  ["dataPublicacao", "Data de Publicação"],
  ["dataAbertura", "Data de Abertura"],
  ["secretaria", "Secretaria Responsável"],
];

const getMissingRequiredField = (formData) => {
  return REQUIRED_CREATE_FIELDS.find(([fieldName]) => {
    const value = formData[fieldName];

    return value === null || value === undefined || String(value).trim() === "";
  });
};

function CreateProcurements() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [attachments, setAttachments] = useState([]);
  const [secretariaOptions, setSecretariaOptions] = useState(SECRETARIAS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      try {
        const departments = await getDepartmentOptions();
        setSecretariaOptions(departments);
      } catch (error) {
        console.error("Erro ao carregar secretarias:", error);
        toast.error("Erro ao carregar secretarias da API.");
      }
    }

    loadOptions();
  }, []);

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
      const missingField = getMissingRequiredField(formData);

      if (missingField) {
        toast.error(`Preencha o campo ${missingField[1]}.`);
        return;
      }

      setSaving(true);

      const selectedSecretaria =
        getSelectedSecretaria(formData.secretaria, secretariaOptions)

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

      const createdProcurement = await createProcurement(newProcurement)
      const biddingId = createdProcurement?.bidding_id || createdProcurement?.id;

      if (biddingId && attachments.length > 0) {
        await uploadAttachments(biddingId, attachments);
      }

      toast.success("Licitação criada com sucesso!")

      setFormData(INITIAL_FORM_DATA)

      setAttachments([])

      navigate("/procurements")

    } catch (error) {

      console.error(
        "Erro ao criar licitação:",
        error
      )

      toast.error(error.message || "Erro ao criar licitação.")
    } finally {
      setSaving(false);
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
          <CardOrigem
            formData={formData}
            updateField={updateField}
            secretariaOptions={secretariaOptions}
          />
          <CardAnexos attachments={attachments} addAttachments={addAttachments} removeAttachment={removeAttachment} />
        </div>

        <footer className="form-actions">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            <Save size={22} />
            {saving ? "Salvando..." : "Salvar"}
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
        </footer>
      </main>
    </div>
  );
}

export default CreateProcurements;
