import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { getQuestionnaireSummary } from '../../api/QuestionnaireAPI';

// Register all chart components
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function QuestionnaireDashboard() {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getQuestionnaireSummary();
        if (isMounted) {
          const data = Array.isArray(response?.data) ? response.data : [];
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

    return () => {
      isMounted = false;
    };
  }, []);

  // Chart data calculations
  const totalCompleted = summaryData.reduce((sum, item) => sum + (item?.completed || 0), 0);
  const totalPending = summaryData.reduce((sum, item) => sum + (item?.pending || 0), 0);
  const completionRate = totalCompleted + totalPending > 0 
    ? Math.round((totalCompleted / (totalCompleted + totalPending)) * 100) 
    : 0;

  // Bar Chart Data
  const barChartData = {
    labels: summaryData?.map(item => item?.title) || [],
    datasets: [
      {
        label: 'Completed',
        data: summaryData?.map(item => item?.completed || 0) || [],
        backgroundColor: '#4bc0c0',
        borderColor: '#4bc0c0',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: summaryData?.map(item => item?.pending || 0) || [],
        backgroundColor: '#ff6384',
        borderColor: '#ff6384',
        borderWidth: 1,
      }
    ],
  };

  // Line Chart Data (Completion Trend)
  const lineChartData = {
    labels: summaryData?.map(item => item?.title) || [],
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: summaryData?.map(item => {
          const total = (item?.completed || 0) + (item?.pending || 0);
          return total > 0 ? Math.round((item.completed / total) * 100) : 0;
        }) || [],
        borderColor: '#36a2eb',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }
    ]
  };

  // Pie Chart Data (Overall Status)
  const pieChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [{
      data: [totalCompleted, totalPending],
      backgroundColor: ['#4bc0c0', '#ff6384'],
      borderWidth: 1
    }]
  };

  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}` + 
              (context.chart.data.labels[context.dataIndex] === 'Completion Rate (%)' ? '%' : '');
          }
        }
      }
    }
  };

  // Bar chart specific options
  const barChartOptions = {
    ...chartOptions,
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
    }
  };

  // Line chart specific options
  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total Questionnaires
            </Typography>
            <Typography variant="h3" color="primary">
              {summaryData.length}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total Responses
            </Typography>
            <Typography variant="h3" color="secondary">
              {totalCompleted + totalPending}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Completion Rate
            </Typography>
            <Typography variant="h3" sx={{ color: completionRate >= 75 ? 'success.main' : 'warning.main' }}>
              {completionRate}%
            </Typography>
          </Paper>
        </Grid>

        {/* Main Chart */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Questionnaire Completion Status
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
                <Box sx={{ height: 400 }}>
                  {summaryData?.length > 0 ? (
                    <Bar data={barChartData} options={barChartOptions} />
                  ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                      <Typography variant="body1" color="text.secondary">
                        {error ? 'Error loading data' : 'No questionnaire data available'}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Charts */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completion Rate Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                {summaryData?.length > 0 && (
                  <Line data={lineChartData} options={lineChartOptions} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Overall Status
              </Typography>
              <Box sx={{ height: 300 }}>
                {summaryData?.length > 0 && (
                  <Pie data={pieChartData} options={chartOptions} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}