import Select from "react-select";
import { customSelectStyles } from "../../shared/styleSelect";

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

export default SelectField;
