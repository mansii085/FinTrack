import React from "react";

const Input = React.forwardRef(
  ({ label, error, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className={className}>
        {label && <label className="label-text">{label}</label>}

        <div className="relative">
          {Icon && (
            <Icon
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
            />
          )}

          <input
            ref={ref}
            className={`input-field ${Icon ? "pl-10" : ""}`}
            {...props}
          />
        </div>

        {error && <p className="field-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;