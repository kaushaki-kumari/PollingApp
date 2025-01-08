import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessMessageModal = ({ message, buttonText, redirectUrl }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(redirectUrl);
    navigate(0)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 max-w-md p-6 rounded shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-4">{message}</h2>
        <button
          onClick={handleButtonClick}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessMessageModal;
