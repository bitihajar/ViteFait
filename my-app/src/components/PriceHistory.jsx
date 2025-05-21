import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PriceHistory({ productId }) {
  const [priceData, setPriceData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch(`/api/price-history/${productId}`);
        const data = await response.json();
        setPriceData(data);
      } catch (err) {
        setError('Failed to load price history');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [productId]);

  if (loading) return <div>Loading price history...</div>;
  if (error) return <div>{error}</div>;
  if (!priceData) return null;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Price History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (MAD)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  const data = {
    labels: priceData.dates,
    datasets: [
      {
        label: 'Price',
        data: priceData.prices,
        borderColor: 'rgb(255, 90, 0)',
        backgroundColor: 'rgba(255, 90, 0, 0.5)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="price-history-card">
      <Line options={options} data={data} />
      <div className="price-stats">
        <div className="stat-item">
          <span className="stat-label">Lowest Price:</span>
          <span className="stat-value">{priceData.lowestPrice} MAD</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Highest Price:</span>
          <span className="stat-value">{priceData.highestPrice} MAD</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Price:</span>
          <span className="stat-value">{priceData.averagePrice} MAD</span>
        </div>
      </div>
    </div>
  );
}

export default PriceHistory; 