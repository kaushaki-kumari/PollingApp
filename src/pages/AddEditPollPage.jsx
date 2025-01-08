import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPollDetails,
  updateOption,
  deleteOption,
  addPollOption,
  addPoll,
  editPoll,
} from "../reducer/pollSlice";
import { validatePollForm } from "../utils/errorHandler";
import SuccessMessageModal from "../components/SuccessMessageModal";
const AddEditPollPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pollId } = useParams();
  const isEditMode = Boolean(pollId);

  const { currentPollDetails, isLoading } = useSelector((state) => state.polls);

  const [pollTitle, setPollTitle] = useState("");
  const [options, setOptions] = useState([
    { id: `newopt-1`, optionTitle: "" },
    { id: `newopt-2`, optionTitle: "" },
  ]);
  const [deletedOptionIds, setDeletedOptionIds] = useState([]);
  const [error, setError] = useState({ title: "", options: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchPollDetails(pollId)).unwrap();
    }
  }, [dispatch, pollId, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentPollDetails) {
      setPollTitle(currentPollDetails.title || "");
      setOptions(currentPollDetails.optionList || []);
    }
  }, [currentPollDetails, isEditMode]);

  const handleAddOption = () => {
    const newOption = { id: `newopt-${Date.now()}`, optionTitle: "" };
    setOptions((prev) => [...prev, newOption]);
  };

  const handleRemoveOption = (index) => {
    const option = options[index];
    if (option.id.toString().startsWith("newopt-")) {
      setOptions((prev) => prev.filter((_, i) => i !== index));
    } else {
      setDeletedOptionIds((prev) => [...prev, option.id]);
      setOptions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    if (value.trim() && error.options) {
      setError((prev) => ({ ...prev, options: "" }));
    }
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], optionTitle: value };
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { titleError, optionsError } = validatePollForm(pollTitle, options);

    if (titleError || optionsError) {
      setError({ title: titleError, options: optionsError });
      return;
    }

    try {
      setIsUpdating(true);

      if (isEditMode) {
        for (const optionId of deletedOptionIds) {
          await dispatch(deleteOption(optionId)).unwrap();
        }

        for (const option of options) {
          if (
            option.id.toString().startsWith("newopt-") &&
            option.optionTitle.trim()
          ) {
            await dispatch(
              addPollOption({ pollId, optionTitle: option.optionTitle })
            ).unwrap();
          } else if (
            option.id &&
            option.optionTitle.trim() &&
            currentPollDetails.optionList.find(
              (existingOption) => existingOption.id === option.id
            ).optionTitle !== option.optionTitle
          ) {
            await dispatch(
              updateOption({
                optionId: option.id,
                optionTitle: option.optionTitle,
              })
            ).unwrap();
          }
        }

        if (currentPollDetails.title !== pollTitle) {
          await dispatch(editPoll({ pollId, title: pollTitle })).unwrap();
        }
      } else {
        const validOptions = options
          .filter((option) => option.optionTitle.trim())
          .map((option) => ({ optionTitle: option.optionTitle.trim() }));

        await dispatch(
          addPoll({
            title: pollTitle,
            options: validOptions,
          })
        ).unwrap();
      }

      setIsModalOpen(true);
    } catch (err) {
      console.error("Error saving poll:", err);
      setError({
        title: `Failed to ${
          isEditMode ? "update" : "add"
        } poll. Please try again.`,
        options: "",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTitleChange = (e) => {
    setPollTitle(e.target.value);
    if (e.target.value.length >= 10 && error.title) {
      setError((prev) => ({ ...prev, title: "" }));
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      {isModalOpen && (
        <SuccessMessageModal
          message={`Poll successfully ${
            isEditMode ? "updated😝😝" : "added😎😎"
          }!`}
          buttonText="Go to Polls Page"
          redirectUrl="/polls"
        />
      )}

      <div className={isModalOpen ? "opacity-50" : ""}>
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? "Edit Poll" : "Add New Poll"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Poll Title
            </label>
            <input
              type="text"
              value={pollTitle}
              onChange={handleTitleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter poll title"
              disabled={isUpdating}
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
              <div key={option.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={option.optionTitle}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder={`Option ${index + 1}`}
                  disabled={isUpdating}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-500 font-semibold"
                    disabled={isUpdating}
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
              disabled={isUpdating}
            >
              + Add Option
            </button>
            {error.options && (
              <p className="text-red-500 text-sm mt-2">{error.options}</p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={isLoading || isUpdating}
            >
              {isUpdating ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : isEditMode ? (
                "Update Poll"
              ) : (
                "Add Poll"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/polls")}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditPollPage;
