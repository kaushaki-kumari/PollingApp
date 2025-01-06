import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPoll } from "../reducer/pollSlice";

const AddPollPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pollTitle, setPollTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");

  const handleAddOption = () => {
    setOptions((prevOptions) => [...prevOptions, ""]);
  };

  const handleRemoveOption = (index) => {
    setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pollTitle.length < 10) {
      setError("Poll title must be at least 10 characters long.");
      return;
    }

    if (options.length < 2 || options.some((option) => typeof option !== "string")) {
      setError("At least 2 valid options are required.");
      return;
    }

    setError(""); 

    try {
      await dispatch(addPoll({ title: pollTitle, options })).unwrap();
      navigate("/polls");
    } catch (err) {
      console.error("Error adding poll:", err);
      setError("Failed to add poll. Please try again.");
    }
  };

  const handleOptionChange = (index, value) => {
    setOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      updatedOptions[index] = value;
      return updatedOptions;
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Add New Poll
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium mb-2">Poll Title</label>
          <input
            type="text"
            value={pollTitle}
            onChange={(e) => setPollTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter poll title"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-2">Options</label>
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
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPollPage;
