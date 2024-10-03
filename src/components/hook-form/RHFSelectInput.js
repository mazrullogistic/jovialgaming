import PropTypes from "prop-types";
// form
import { Controller, useFormContext } from "react-hook-form";

RHFSelectInput.propTypes = {
  name: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default function RHFSelectInput({
  name,
  children,
  id,
  label = "",
  disabled = false,
  placeholder = "",
  className = "form-label",
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <select
            aria-label={label}
            id={id}
            isInvalid={!!error}
            {...field}
            disabled={disabled}
          >
            {!field.value && placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <p id={id} className="text-red-500 pl-4">
            {error ? error?.message : ""}
          </p>
        </>
      )}
      {...other}
    />
  );
}
