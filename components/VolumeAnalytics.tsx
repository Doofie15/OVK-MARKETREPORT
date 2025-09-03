import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface VolumeAnalyticsProps {
  data?: any[];
}

const VolumeAnalytics: React.FC<VolumeAnalyticsProps> = ({ data = [] }) => {
  // Mock data for demonstration - similar to Tesla dashboard
  const volumeData = [
    { month: 'Jan', revenue: 45, volume: 1200, netIncome: 8 },
    { month: 'Feb', revenue: 52, volume: 1350, netIncome: 12 },
    { month: 'Mar', revenue: 48, volume: 1180, netIncome: 10 },
    { month: 'Apr', revenue: 61, volume: 1520, netIncome: 15 },
    { month: 'May', revenue: 55, volume: 1390, netIncome: 13 },
    { month: 'Jun', revenue: 67, volume: 1680, netIncome: 18 },
    { month: 'Jul', revenue: 59, volume: 1450, netIncome: 16 },
    { month: 'Aug', revenue: 72, volume: 1820, netIncome: 22 },
    { month: 'Sep', revenue: 68, volume: 1710, netIncome: 20 },
    { month: 'Oct', revenue: 75, volume: 1950, netIncome: 25 },
    { month: 'Nov', revenue: 71, volume: 1780, netIncome: 23 },
    { month: 'Dec', revenue: 78, volume: 2100, netIncome: 28 }
  ];

  const chartOptions: ApexOptions = {
    theme: { mode: 'dark' },
    chart: {
      type: 'bar',
      background: 'transparent',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      animations: { enabled: true, easing: 'easeinout', speed: 800 }
    },
    colors: ['#64ffda', '#06b6d4', '#7c3aed'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '60%',
        distributed: false,
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#2a3152',
      strokeDashArray: 3,
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    xaxis: {
      categories: volumeData.map(d => d.month),
      labels: {
        style: { colors: '#8892b0', fontSize: '12px', fontWeight: 500 }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#8892b0', fontSize: '12px', fontWeight: 500 },
        formatter: (value) => `${value}K`
      }
    },
    tooltip: {
      theme: 'dark',
      shared: true,
      intersect: false,
      style: { fontSize: '13px', fontFamily: 'Inter, sans-serif' }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      fontWeight: 500,
      labels: { colors: '#b8c5d6' },
      markers: { radius: 6 }
    }
  };

  const chartSeries = [
    {
      name: 'Revenue',
      type: 'column',
      data: volumeData.map(d => d.revenue)
    },
    {
      name: 'Volume',
      type: 'line',
      data: volumeData.map(d => d.volume / 25) // Scale for visibility
    },
    {
      name: 'Net Income',
      type: 'line',
      data: volumeData.map(d => d.netIncome)
    }
  ];

  return (
    <section className="section">
      <div className="grid-responsive cols-1 lg-cols-3 gap-6">
        {/* Income Overview */}
        <div className="chart-container">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            </div>
            <div>
              <h3 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Income Overview</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Revenue vs Operating Income</p>
            </div>
          </div>
          <Chart
            options={{
              ...chartOptions,
              colors: ['#64ffda', '#7c3aed'],
              chart: { ...chartOptions.chart, height: 200 }
            }}
            series={[
              { name: 'Revenue', data: volumeData.map(d => d.revenue) },
              { name: 'Operating Income', data: volumeData.map(d => d.netIncome) }
            ]}
            type="bar"
            height={200}
          />
        </div>

        {/* Net Income */}
        <div className="chart-container">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
            <div>
              <h3 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Net Income</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Net Income</p>
            </div>
          </div>
          <Chart
            options={{
              ...chartOptions,
              colors: ['#10b981'],
              chart: { ...chartOptions.chart, height: 200 }
            }}
            series={[{ name: 'Net Income', data: volumeData.map(d => d.netIncome) }]}
            type="bar"
            height={200}
          />
        </div>

        {/* Volume Delivered */}
        <div className="chart-container">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            </div>
            <div>
              <h3 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Volumes Delivered</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Model S and Model Y vs Model 3, Model X, and Cybertruck</p>
            </div>
          </div>
          <Chart
            options={{
              ...chartOptions,
              colors: ['#f59e0b', '#ef4444'],
              chart: { ...chartOptions.chart, height: 200 }
            }}
            series={[
              { name: 'Model S and Model Y', data: volumeData.map(d => d.volume / 25) },
              { name: 'Model 3, Model X, and Cybertruck', data: volumeData.map(d => (d.volume / 25) * 0.7) }
            ]}
            type="bar"
            height={200}
          />
        </div>
      </div>
    </section>
  );
};

export default VolumeAnalytics;
