import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const GraphicView = ({ openModal, percentage, count }) => {
  const { positive, negative, neutral } = percentage;
  const { positive_count, negative_count, neutral_count } = count
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      new Chart(ctx, {
        type: "pie",
        data: {
          labels: [positive_count+" Positive", negative_count+" Negative", neutral_count+" Neutral"],
          datasets: [
            {
              label: "Sentiment Analysis",
              data: [positive, negative, neutral],
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 205, 86, 0.2)",
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 205, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: {
                  size: 14,
                },
              },
            },
          },
        },
      });
    }
  }, [positive, negative, neutral]);

  return (
    <div className="modal fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center">
      <div className="modal-container bg-white w-1/2 rounded-xl shadow-lg h-auto transition duration-900 ease-in-out">
        <div className="modal-content pb-4 text-left">
          <div className="flex justify-between items-center bg-zinc-700 text-white rounded-t-lg py-2 px-4">
            <p className="text-2xl font-bold p-3 font-sans">Graphic View</p>
            <div className="modal-close cursor-pointer">
              <FontAwesomeIcon
                icon={faTimes}
                className="text-white text-2xl hover:text-gray-300 transition duration-300 ease-in-out"
                onClick={() => openModal()}
              />
            </div>
          </div>
          <div className="px-24">
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphicView;
