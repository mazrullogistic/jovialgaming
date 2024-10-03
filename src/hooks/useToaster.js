import { toast } from "react-toastify";

const useToaster = () => {
  const toaster = (message, variant, options = {}) => {
    toast[variant](message, options);
  };

  return { toaster };
};

export default useToaster;