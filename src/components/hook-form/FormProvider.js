import PropTypes from "prop-types";
import { FormProvider as RHFormProvider } from "react-hook-form";

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
  methods: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

export default function FormProvider({
  children,
  onSubmit,
  methods,
  className = "",
}) {
  return (
    <RHFormProvider {...methods}>
      <form className={className} onSubmit={onSubmit}>
        {children}
      </form>
    </RHFormProvider>
  );
}
