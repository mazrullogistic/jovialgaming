import { useState } from "react";

const AlertDialog = ({ title, message, onConfirm, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onConfirm) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-grayA4 p-6 rounded-lg shadow-lg max-w-sm mx-auto relative">
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-xl font-semibold text-red-500">{title}</h2>
        </div>
        <p className="mb-4 text-gray-700">{message}</p>
        <div className="flex justify-center">
          <button
            className="w-20 bg-black25 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105"
            onClick={onConfirm}
          >
            {"Ok"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
