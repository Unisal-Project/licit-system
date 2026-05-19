export const PROCUREMENT_TYPES = [
  { label: "Pregão Eletrônico", value: "pregao_eletronico" },
  { label: "Concorrência Pública", value: "concorrencia_publica" },
];

export const STATUS_OPTIONS = [
  {label:"Aguardando Abertura", value: "aguardando_abertura"},
  {label:"Aberto", value: "aberto"},
  {label:"Em Andamento", value: "em_andamento"},
  {label:"Suspenso", value: "suspenso"},
  {label:"Revogado", value: "revogado"},
  {label:"Finalizado", value: "finalizado"},
];

export const CLASSIFICATION_OPTIONS = [
  { label: "Global", value: "global" },
  { label: "Por Item", value: "por_item" },
  { label: "Por Lote", value: "por_lote" }
];

export const SECRETARIAS = [
  { value: "GAB", label: "Gabinete" },
  { value: "SEGOV", label: "Secretaria de Governo" },
  { value: "SEFAZ", label: "Secretaria da Fazenda" },
  { value: "SEAD", label: "Secretaria de Administração" },
  { value: "SEFI", label: "Secretaria de Finanças" },
  { value: "SEMEC", label: "Secretaria de Educação" },
  { value: "SEMUS", label: "Secretaria de Saúde" },
  { value: "SEESP", label: "Secretaria de Esporte, Lazer e Juventude" },
  { value: "SMSP", label: "Secretaria de Segurança Públicos" },
  { value: "SEAS", label: "Secretaria de Assistência e Desenvolvimento Social" },
  { value: "SEPCD", label: "Secretaria de Pessoa com Deficiência" },
  { value: "SEMDH", label: "Secretaria Mulheres e Direitos Humanos" },
  { value: "SEC", label: "Secretaria de Cultura" },
  { value: "SEPP", label: "Secretaria de Políticas Públicas" },
  { value: "SEOS", label: "Secretaria de Obras e Serviços Públicos" },
  { value: "SEMA", label: "Secretaria de Meio Ambiente" },
  { value: "SEDU", label: "Secretaria de Desenvolvimento Urbano e Rural" },
  { value: "SEDET", label: "Secretaria de Desenvolvimento Econômico e Turismo" },
  { value: "SEAJ", label: "Secretaria de Assuntos Jurídicos" },
];

export const getOptionLabel = (options, value) => {
  return (
    options.find((option) => option.value === value)?.label || value
  );
};

export const getOptionValue = (options, value) => {
  return (
    options.find((option) => option.value === value || option.label === value)?.value || value
  );
}
