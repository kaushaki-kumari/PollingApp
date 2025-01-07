import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessMessageModal = ({ message, buttonText, redirectUrl }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md w-full space-y-6 p-6 bg-white rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-blue-600">{message}</h2>
      <button
        onClick={() => navigate(redirectUrl)}
        className="mt-4 py-2 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default SuccessMessageModal;
