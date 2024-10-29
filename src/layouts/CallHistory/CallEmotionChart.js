import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { expressionColors } from "utils/expressionColors";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function CallEmotionChart({ data }) {
  // Map response data to chart labels and values
  const labels = Object.keys(data);
  const values = Object.values(data);

  // Map colors from expressionColors based on the labels
  const backgroundColors = labels.map((label) => expressionColors[label] || "#9e9e9e"); // Default gray if no color found

  // Chart.js configuration
  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((color) => color.replace(/[^,]+(?=\))/, "1")), // Optional for a cleaner look
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1000, // Smooth transition duration
      easing: "easeInOutQuad", // Soft easing effect for smooth animation
    },
    plugins: {
      legend: { display: false }, // Remove the legend
      tooltip: {
        callbacks: {
          title: (tooltipItems) => labels[tooltipItems[0].dataIndex], // Show emotion as title in tooltip
          label: (tooltipItem) => `Intensity: ${tooltipItem.raw.toFixed(2)}`, // Customize tooltip label
        },
        backgroundColor: "#333", // Dark background for tooltip
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 4,
        displayColors: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { maxRotation: 100, minRotation: 45, color: "#666" },
        grid: { display: false }, // Remove grid lines for x-axis
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#666" },
        grid: { color: "rgba(200, 200, 200, 0.3)", lineWidth: 0.5 }, // Light grid for y-axis
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

// Add PropTypes for validation
CallEmotionChart.propTypes = {
  data: PropTypes.object.isRequired, // Expect data to be an object and required
};

export default CallEmotionChart;
