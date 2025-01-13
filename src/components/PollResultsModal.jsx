import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Bar } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { fetchPollDetails } from "../reducer/pollSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Modal.setAppElement("#root");
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PollResultsModal = ({ isOpen, onClose, pollId }) => {
  const dispatch = useDispatch();
  const [pollData, setPollData] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!pollId) return;

    const loadPollDetails = async () => {
      setStatus("loading");
      try {
        const details = await dispatch(fetchPollDetails(pollId)).unwrap();
        setPollData({ title: details.title, options: details.optionList });
        setStatus("loaded");
      } catch (err) {
        setStatus("error");
        console.error("Error fetching poll details:", err);
      }
    };

    loadPollDetails();
  }, [dispatch, pollId]);

  const truncateText = (text, maxLength = 10) =>
    text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  const splitTitleBasedOnWordCount = (title) => {
    if (!title) return [title];
    const words = title.split(' ');
    const totalWords = words.length;
    if (totalWords <= 25) {
      return [title];
    }
    const wordsPerLine = Math.ceil(totalWords / 3);
    const firstLine = words.slice(0, wordsPerLine).join(' ');
    const secondLine = words.slice(wordsPerLine, wordsPerLine * 2).join(' ');
    const thirdLine = words.slice(wordsPerLine * 2).join(' ');
    
    return [firstLine, secondLine, thirdLine];
  };

  const renderModalContent = () => {
    if (status === "loading") {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-center">Loading results...</p>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="flex flex-col items-center justify-center">
          <p className="text-red-500 mb-4">Failed to load poll results</p>
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
      );
    }

    if (!pollData?.options) return null;

    const voteCounts = pollData.options.map(
      (option) => option.voteCount.length
    );
    const data = {
      labels: pollData.options.map((option) =>
        truncateText(option.optionTitle)
      ),
      datasets: [
        {
          label: "Number of Votes",
          data: voteCounts,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
    const titleLines = splitTitleBasedOnWordCount(pollData.title);
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          fullSize: true,
          text: titleLines,
          font: { size: 14, weight: "bold" },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw;
              const total = voteCounts.reduce((a, b) => a + b, 0);
              const percentage =
                total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `Votes: ${value} (${percentage}%)`;
            },
          },
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    };

    return <Bar data={data} options={chartOptions} />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Poll Results"
      className="bg-white w-72 p-1 rounded-lg shadow-lg max-w-2xl mx-auto md:p-6 md:w-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 shadow-xl flex items-center justify-center"
    >
      <div className="flex flex-col h-[500px]">
        <h2 className="text-xl font-bold mb-4 text-center">Poll Results</h2>
        <div className="flex-1">{renderModalContent()}</div>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PollResultsModal;
