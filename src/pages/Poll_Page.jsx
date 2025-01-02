import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPolls, saveVote } from "../reducer/pollSlice";
import { FaRegEdit, FaChartBar } from "react-icons/fa";
import { ROLE_ADMIN } from "../utils/constant";
import Skeleton from "../components/Skeleton";
import PollResultsModal from "../components/PollResultsModal";

const Poll_Page = () => {
  const dispatch = useDispatch();
  const { polls, isLoading, error } = useSelector((state) => state.polls);
  const { user } = useSelector((state) => state.auth);
  const [selectedOptions, setSelectedOptions] = useState(
    JSON.parse(localStorage.getItem("selectedOptions")) || {}
  );
  const [votedPolls, setVotedPolls] = useState(
    JSON.parse(localStorage.getItem("votes")) || {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPollResults, setCurrentPollResults] = useState(null);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const storedVotes = JSON.parse(localStorage.getItem("votes")) || {};
      setVotedPolls(storedVotes);
    }
  }, [user]);

  const handleOptionSelect = (pollId, optionId) => {
    const updatedSelectedOptions = {
      ...selectedOptions,
      [pollId]: optionId,
    };
    setSelectedOptions(updatedSelectedOptions);
    localStorage.setItem(
      "selectedOptions",
      JSON.stringify(updatedSelectedOptions)
    );
  };

  const handleSubmit = async (pollId) => {
    const selectedOption = selectedOptions[pollId];
    if (!selectedOption) return;

    try {
      await dispatch(saveVote({ pollId, optionId: selectedOption })).unwrap();
      const updatedVotedPolls = {
        ...votedPolls,
        [pollId]: { [user.id]: selectedOption },
      };
      setVotedPolls(updatedVotedPolls);
      localStorage.setItem("votes", JSON.stringify(updatedVotedPolls));
      dispatch(fetchPolls());
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const handleViewResults = (pollId) => {
    const poll = polls.find((poll) => poll.id === pollId);
    if (poll) {
      const pollVotes = votedPolls[pollId] || {};
      console.log("Poll ID:", pollId);
      console.log("All Votes:", votedPolls);
      console.log("Poll Votes:", pollVotes);

      setCurrentPollResults({
        title: poll.title,
        options: poll.optionList,
      });
      setIsModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold text-center">Polls</h1>
      {isLoading && (
        <div className="m-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(polls?.length || 11)].map((_, index) => (
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
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-2 cursor-pointer"
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
          <div className="flex justify-center mt-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
              Load More
            </button>
          </div>
        </div>
      )}

      <PollResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pollData={currentPollResults}
      />
    </div>
  );
};

export default Poll_Page;
