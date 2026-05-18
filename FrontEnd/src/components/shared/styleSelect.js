export const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    borderRadius: "10px",
    borderColor: state.isFocused
      ? "var(--secondary)"
      : "var(--text-secondary)",
    backgroundColor: "var(--bg)",
    boxShadow: "none",
    transition: "0.2s ease",

    "&:hover": {
      borderColor: "var(--secondary)",
    },
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 10px",
  }),

  placeholder: (base) => ({
    ...base,
    color: "var(--text-secondary)",
    fontSize: "14px",
  }),

  singleValue: (base) => ({
    ...base,
    color: "var(--text-primary)",
    fontSize: "14px",
  }),

  input: (base) => ({
    ...base,
    color: "var(--text-primary)",
    fontSize: "14px",
  }),

  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    overflow: "hidden",
    zIndex: 9999,
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "var(--select)"
      : "var(--bg)",
    color: "var(--text-primary)",
    cursor: "pointer",
    transition: "0.15s ease",
  }),

  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused
      ? "var(--secondary)"
      : "var(--text-secondary)",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),
};