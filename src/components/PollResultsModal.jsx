import React from "react";
import Modal from "react-modal";
import { Bar } from "react-chartjs-2";
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

const PollResultsModal = ({ isOpen, onClose, pollData }) => {
  if (!pollData || !pollData.options) return null;

  const truncateText = (text, maxLength = 12) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const voteCounts = pollData.options.map((option) => option.voteCount.length);
  console.log(voteCounts);

  const data = {
    labels: pollData.options.map((option) => truncateText(option.optionTitle)),
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: pollData.title,
        font: {
          size: 16,
          weight: "bold",
        },
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
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Poll Results"
      ariaHideApp={false}
      className="bg-white w-72 p-1 rounded-lg shadow-lg max-w-2xl mx-auto md:p-6 md:w-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 shadow-xl flex items-center justify-center"
    >
      <div className="flex flex-col h-[500px]">
        <h2 className="text-xl font-bold mb-4">Poll Results</h2>
        <div className="flex-1">
          <Bar data={data} options={chartOptions} />
        </div>
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
