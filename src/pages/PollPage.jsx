import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPolls, saveVote } from "../reducer/pollSlice";
import { FaRegEdit, FaChartBar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ROLE_ADMIN } from "../utils/constant";
import Skeleton from "../components/Skeleton";
import PollResultsModal from "../components/PollResultsModal";

const PollPage = () => {
  const dispatch = useDispatch();
  const { polls, isLoading, error, hasMore } = useSelector(
    (state) => state.polls
  );
  const { user } = useSelector((state) => state.auth);
  const [selectedOptions, setSelectedOptions] = useState(
    JSON.parse(localStorage.getItem(`selectedOptions_${user?.id}`)) || {}
  );
  const [votedPolls, setVotedPolls] = useState(
    JSON.parse(localStorage.getItem(`votes_${user?.id}`)) || {}
  );
  const [isPollResultsModalOpen, setIsPollResultsModalOpen] = useState(false);
  const [currentPollResults, setCurrentPollResults] = useState(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchPolls());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  const handleLoadMore = (e) => { 
    if (!isLoading && hasMore) {
      dispatch(fetchPolls());
    }
  };

  useEffect(() => {
    if (user) {
      const storedSelectedOptions =
        JSON.parse(localStorage.getItem(`selectedOptions_${user.id}`)) || {};
      setSelectedOptions(storedSelectedOptions);
    }
  }, [user]);

  const handleOptionSelect = (pollId, optionId) => {
    const updatedSelectedOptions = {
      ...selectedOptions,
      [pollId]: optionId,
    };
    setSelectedOptions(updatedSelectedOptions);
    localStorage.setItem(
      `selectedOptions_${user.id}`,
      JSON.stringify(updatedSelectedOptions)
    );
  };

  const handleSubmit = async (pollId) => {
    const selectedOption = selectedOptions[pollId];
    if (!selectedOption) return;
    try {
      await dispatch(
        saveVote({
          pollId,
          optionId: selectedOption,
          userId: user.id,
        })
      ).unwrap();
      const updatedVotedPolls = {
        ...votedPolls,
        [pollId]: {
          ...votedPolls[pollId],
          [user.id]: selectedOption,
        },
      };
      setVotedPolls(updatedVotedPolls);
      localStorage.setItem(
        `votes_${user.id}`,
        JSON.stringify(updatedVotedPolls)
      );
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const handleViewResults = (pollId) => {
    const poll = polls.find((poll) => poll.id === pollId);
    if (poll) {
      setCurrentPollResults({
        title: poll.title,
        options: poll.optionList,
      });
      setIsPollResultsModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold text-center">Polls</h1>
      {isLoading && (
        <div className="m-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(9)].map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!isLoading && !error && (
        <div className="m-4">
          {polls && polls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className="p-4 border rounded-lg shadow-sm transition flex flex-col min-h-full"
                >
                  {user?.roleId === ROLE_ADMIN && (
                    <div className="flex justify-center items-center mb-2 gap-2 text-red-500">
                      <FaRegEdit className="cursor-pointer w-8 h-8" />
                      <FaChartBar
                        className="cursor-pointer w-8 h-8"
                        onClick={() => handleViewResults(poll.id)}
                      />
                      <MdDelete className="w-8 h-8" />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold flex justify-between items-center">
                    {poll.title}
                  </h2>
                  {poll.optionList && poll.optionList.length > 0 ? (
                    <ul className="space-y-2 flex-grow">
                      {poll.optionList.map((option) => (
                        <li key={option.id} className="flex items-center">
                          <input
                            type="radio"
                            id={`poll-${poll.id}-option-${option.id}`}
                            name={`poll-${poll.id}`}
                            value={option.id}
                            checked={selectedOptions[poll.id] === option.id}
                            onChange={() =>
                              handleOptionSelect(poll.id, option.id)
                            }
                            disabled={votedPolls[poll.id]?.[user.id]}
                            className="mr-2 cursor-pointer"
                          />
                          <label
                            htmlFor={`poll-${poll.id}-option-${option.id}`}
                            className={`cursor-pointer ${
                              selectedOptions[poll.id] === option.id
                                ? "font-bold text-blue-600"
                                : ""
                            } ${
                              votedPolls[poll.id]?.[user.id]
                                ? "text-gray-500 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {option.optionTitle}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No options available.</p>
                  )}
                  <div className="flex justify-center items-center mt-auto">
                    <button
                      onClick={() => handleSubmit(poll.id)}
                      className={`py-2 px-4 rounded-lg mt-2 text-white 
                        ${
                          votedPolls[poll.id]?.[user.id]
                            ? "bg-blue-200 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      disabled={votedPolls[poll.id]?.[user.id]}
                    >
                      {votedPolls[poll.id]?.[user.id] ? "Submitted" : "Submit"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No polls available.</p>
          )}
          <div className="flex justify-center mt-6">
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className={`py-2 px-4 rounded-lg ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            ) : (
              <p className="text-gray-500">No more polls to load.</p>
            )}
          </div>
        </div>
      )}
      <PollResultsModal
        isOpen={isPollResultsModalOpen}
        onClose={() => setIsPollResultsModalOpen(false)}
        pollData={currentPollResults}
      />
    </div>
  );
};

export default PollPage;
