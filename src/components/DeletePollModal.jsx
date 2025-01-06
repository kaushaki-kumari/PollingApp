import React from "react";
import { FaTimes } from "react-icons/fa";

const DeletePoll = ({ isOpen, onClose, onConfirm, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-64  md:w-80">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Delete Poll</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <p className="mb-4">Are you sure you want to delete this poll?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 ${
              isDeleting ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePoll;
