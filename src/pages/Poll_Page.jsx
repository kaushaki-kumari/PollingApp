import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPolls, saveVote } from "../features/pollSlice";
import { FaRegEdit, FaChartBar } from "react-icons/fa";
import { ROLE_ADMIN } from "../utils/constant";
import Skeleton from "../components/Skeleton";  

const Poll_Page = () => {
  const dispatch = useDispatch();
  const { polls, isLoading, error } = useSelector((state) => state.polls);
  const { user } = useSelector((state) => state.auth);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [votedPolls, setVotedPolls] = useState(
    JSON.parse(localStorage.getItem("votes")) || {}
  );

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  const handleOptionSelect = (pollId, optionId) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      [pollId]: optionId,
    }));
  };

  const handleSubmit = (pollId) => {
    const selectedOption = selectedOptions[pollId];
    if (selectedOption) {
      const voteData = {
        pollId,
        optionId: selectedOption,
      };
      setVotedPolls((prevVotedPolls) => ({
        ...prevVotedPolls,
        [pollId]: true,
      }));

      dispatch(saveVote({ pollId, optionId: selectedOption }));
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
                  className="p-4 border rounded-lg shadow-sm transition"
                >
                  {user?.roleId === ROLE_ADMIN && (
                    <div className="flex justify-center items-center mb-2 gap-2  text-red-500">
                      <FaRegEdit
                        className="cursor-pointer w-5 h-5"
                        onClick={() => console.log("Edit poll:", poll.id)}
                      />
                      <FaChartBar className="cursor-pointer w-5 h-5" />
                    </div>
                  )}

                  <h2 className="text-lg font-semibold flex justify-between items-center">
                    {poll.title}
                  </h2>
                  {poll.optionList && poll.optionList.length > 0 ? (
                    <ul className="space-y-2">
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
                            disabled={votedPolls[poll.id]}
                            className="mr-2 cursor-pointer"
                          />
                          <label
                            htmlFor={`poll-${poll.id}-option-${option.id}`}
                            className={`cursor-pointer ${
                              selectedOptions[poll.id] === option.id
                                ? "font-bold text-blue-600"
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
                  <div className="my-auto text-center">
                    <button
                      onClick={() => handleSubmit(poll.id)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-4"
                      disabled={votedPolls[poll.id]}
                    >
                      {votedPolls[poll.id] ? "Submitted" : "Submit"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No polls available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Poll_Page;
