import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPoll } from "../reducer/pollSlice";
import { validatePollForm } from "../utils/errorHandler";
import SuccessMessageModal from "../components/SuccessMessageModal";

const AddPollPage = () => {
  const dispatch = useDispatch();

  const [pollTitle, setPollTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState({ title: "", options: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddOption = () => {
    setOptions((prevOptions) => [...prevOptions, ""]);
    setError((prevError) => ({ ...prevError, options: "" }));
  };

  const handleRemoveOption = (index) => {
    setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
  };

  const handlePollSubmit = async (e) => {
    e.preventDefault();
    const { titleError, optionsError } = validatePollForm(pollTitle, options);

    if (titleError || optionsError) {
      setError({ title: titleError, options: optionsError });
      return;
    }

    setError({ title: "", options: "" });

    const payload = {
      title: pollTitle,
      options: options.map((option) => ({ optionTitle: option.trim() })),
    };

    try {
      await dispatch(addPoll(payload)).unwrap();
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error adding poll:", err);
      setError({ title: "Failed to add poll. Please try again.", options: "" });
    }
  };

  const handleOptionChange = (index, value) => {
    if (value.trim() && error.options) {
      setError((prev) => ({ ...prev, options: "" }));
    }
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = value;
      return updatedOptions;
    });
  };

  const handleTitleChange = (value) => {
    setPollTitle(value);
    if (value.length >= 10) {
      setError((prevError) => ({ ...prevError, title: "" }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      {isModalOpen ? (
        <SuccessMessageModal
          message="Poll successfully added!"
          buttonText="Go to Polls Page"
          redirectUrl="/polls"
        />
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
            Add New Poll
          </h1>
          <form onSubmit={handlePollSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Poll Title
              </label>
              <input
                type="text"
                value={pollTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter poll title"
              />
              {error.title && (
                <p className="text-red-500 text-sm mt-2">{error.title}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Options
              </label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-500 font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2 text-blue-500 font-semibold"
              >
                + Add Option
              </button>
              {error.options && (
                <p className="text-red-500 text-sm mt-2">{error.options}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddPollPage;
