import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { getQuestionnaireSummary } from '../../api/QuestionaireAPI';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function QuestionnaireDashboard() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Track mounted state
    
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getQuestionnaireSummary();
        // Only update state if component is still mounted
        if (isMounted) {
          // Ensure response.data exists and is an array
          const data = Array.isArray(response?.data) ? response.data : [];
          console.log(data)
          setSummaryData(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load questionnaire summary:', err);
          setError(err.response?.data?.message || 'Failed to load data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSummaryData();

    // Cleanup function to cancel pending requests
    return () => {
      isMounted = false;
    };
  }, []);

  // Safe data mapping with fallbacks
  const chartData = {
    labels: summaryData?.map(item => item?.title) || [],
    datasets: [
      {
        label: 'Completed',
        data: summaryData?.map(item => item?.completed || 0) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: summaryData?.map(item => item?.pending || 0) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          precision: 0,
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom component="div">
            Questionnaire Completion Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Visual representation of completed vs pending questionnaires
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ height: 400, mt: 2 }}>
              {summaryData?.length > 0 ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  alignItems="center" 
                  height="100%"
                >
                  <Typography variant="body1" color="text.secondary">
                    {error ? 'Error loading data' : 'No questionnaire data available'}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}