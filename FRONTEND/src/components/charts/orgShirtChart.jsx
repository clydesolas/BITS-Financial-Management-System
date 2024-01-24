import React, { useState, useEffect } from 'react';
import { Bar, Chart } from 'react-chartjs-2';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const OrgShirtChart = () => {
  const [transactionData, setTransactionData] = useState(null);

  const fetchData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('http://localhost:8001/transaction/paidShirt');
      setTransactionData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial data fetch

    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  if (!transactionData) {
    return <div>Loading...</div>;
  }

  const acadYearSemesterLabels = Object.keys(transactionData);
  const paidCountData = acadYearSemesterLabels.map((label) => transactionData[label].paidCount);
  const unpaidCountData = acadYearSemesterLabels.map((label) => transactionData[label].unpaidCount);
  const totalStudentCountData = acadYearSemesterLabels.map((label) => transactionData[label].totalStudentCount);

  const chartData = {
    labels: acadYearSemesterLabels,
    datasets: [
      {
        label: 'Paid Count',
        data: paidCountData,
        backgroundColor: 'rgba(0, 128, 0, 0.6)', // Green for paid
        borderColor: 'rgba(0, 128, 0, 1)',
        borderWidth: 1,
      },
      {
        label: 'Unpaid Count',
        data: unpaidCountData,
        backgroundColor: 'rgba(255, 0, 0, 0.6)', // Red for unpaid
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Student Count',
        data: totalStudentCountData,
        backgroundColor: 'rgba(0, 0, 255, 0.6)', // Blue for total
        borderColor: 'rgba(0, 0, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { stacked: false },
      y: { stacked: false },
    },
    plugins: {
      title: {
        display: true,
        text: 'Organization Shirt',
        color: '#536150',
      },
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        display: true,
        color: 'black',
        font: {
          weight: 'bold',
        },
        formatter: (value) => value, 
      },
    },
  };

  return (
    <Bar
      data={chartData}
      options={chartOptions}
      plugins={[ChartDataLabels]} 
    />
  );
};

export default OrgShirtChart;
