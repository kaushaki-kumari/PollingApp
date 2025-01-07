import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPolls, saveVote, deletePoll } from "../reducer/pollSlice";
import { FaRegEdit, FaChartBar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ROLE_ADMIN } from "../utils/constant";
import Skeleton from "../components/Skeleton";
import PollResultsModal from "../components/PollResultsModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const PollPage = () => {
  const dispatch = useDispatch();
  const { polls, isLoading, error, currentPage, hasMore } = useSelector(
    (state) => state.polls
  );
  const { user } = useSelector((state) => state.auth);
  const [votes, setVotes] = useState(
    JSON.parse(localStorage.getItem(`votes_${user?.id}`)) || {}
  );
  const [isPollResultsModalOpen, setIsPollResultsModalOpen] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      dispatch(fetchPolls());
      isInitialLoad.current = false;
    }
  }, [dispatch]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      dispatch(fetchPolls(currentPage + 1));
    }
  };

  const handleOptionSelect = (pollId, optionId) => {
    const updatedVotes = {
      ...votes,
      [pollId]: {
        ...votes[pollId],
        selectedOption: optionId,
      },
    };
    setVotes(updatedVotes);
  };

  const handleVoteSubmit = async (pollId) => {
    const selectedOption = votes[pollId]?.selectedOption;
    if (!selectedOption) return;
    try {
      await dispatch(
        saveVote({
          pollId,
          optionId: selectedOption,
          userId: user.id,
        })
      ).unwrap();
  
      setVotes((prevVotes) => {
        const updatedVotes = {
          ...prevVotes,
          [pollId]: {
            ...prevVotes[pollId],
            voted: true, 
          },
        };
        localStorage.setItem(`votes_${user.id}`, JSON.stringify(updatedVotes));
        return updatedVotes;
      });
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const handleViewResults = (pollId) => {
    setSelectedPollId(pollId);
    setIsPollResultsModalOpen(true);
  };

  const handleDeletePoll = async () => {
    if (!pollToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deletePoll(pollToDelete.id)).unwrap();
    } catch (error) {
      console.error("Error deleting poll:", error);
    } finally {
      setPollToDelete(null);
      setIsDeleteModalOpen(false);
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold text-center">Polls</h1>
      {isLoading && currentPage === 1 && (
        <div className="m-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(9)].map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="m-4">
        {polls && polls.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {polls.map((poll,index) => (
              <div
              key={`${poll.id}-${index}`}
                className="p-4 border rounded-lg shadow-sm transition flex flex-col min-h-full"
              >
                {user?.roleId === ROLE_ADMIN && (
                  <div className="flex justify-center items-center mb-2 gap-2 text-red-500">
                    <FaRegEdit className="cursor-pointer w-8 h-8" />
                    <FaChartBar
                      className="cursor-pointer w-8 h-8"
                      onClick={() => handleViewResults(poll.id)}
                    />
                    <MdDelete
                      className="w-8 h-8 cursor-pointer"
                      onClick={() => {
                        setPollToDelete(poll);
                        setIsDeleteModalOpen(true);
                      }}
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
                          checked={votes[poll.id]?.selectedOption === option.id}
                          onChange={() => handleOptionSelect(poll.id, option.id)}
                          disabled={votes[poll.id]?.voted}
                          className="mr-2 cursor-pointer"
                        />
                        <label
                          htmlFor={`poll-${poll.id}-option-${option.id}`}
                          className={`cursor-pointer ${
                            votes[poll.id]?.selectedOption === option.id
                              ? "font-bold text-blue-600"
                              : ""
                          } ${
                            votes[poll.id]?.voted
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
                    onClick={() => handleVoteSubmit(poll.id)}
                    className={`py-2 px-4 rounded-lg mt-2 text-white 
                      ${
                        votes[poll.id]?.voted
                          ? "bg-blue-200 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    disabled={votes[poll.id]?.voted}
                  >
                    {votes[poll.id]?.voted ? "Submitted" : "Submit"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No polls available.</p>
        )}
        <div className="flex justify-center mt-6 text-white">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className={`py-2 px-4 rounded-lg ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          ) : (
            <p>No more polls</p>
          )}
         
        </div>
      </div>
      {isPollResultsModalOpen && (
        <PollResultsModal
          isOpen={isPollResultsModalOpen}
          onClose={() => {
            setIsPollResultsModalOpen(false);
            setSelectedPollId(null);
          }}
          pollId={selectedPollId}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeletePoll}
          isDeleting={isDeleting}
          title="Delete Poll"
          message="Are you sure you want to delete this Poll?"
        />
      )}
    </div>
  );
};

export default PollPage;
