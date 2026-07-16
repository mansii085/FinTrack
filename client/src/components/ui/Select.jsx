import React from "react";

const Select = React.forwardRef(({ label, error, options = [], className = "", ...props }, ref) => {
  return (
    <div className={className}>
      {label && <label className="label-text">{label}</label>}
      <select ref={ref} className="input-field appearance-none cursor-pointer" {...props}>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-surface">
            {opt.icon ? `${opt.icon} ` : ""}
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
