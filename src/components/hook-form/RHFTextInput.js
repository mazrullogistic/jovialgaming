import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";

RHFTextInput.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextInput({
  name,
  placeholder = "",
  type = "text",
  disabled = false,
  className = "",
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <input
            type={type}
            className={className}
            placeholder={placeholder}
            disabled={disabled}
            {...field}
          />
          <p className="text-red">{error ? error?.message : ""}</p>
        </>
      )}
      {...other}
    />
  );
}
