import React, { useState } from 'react';
import { Card, Select } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { CoinDetailsType } from './types';

ChartJS.register(TimeScale, LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

interface CoinChartProps {
  data: { x: Date; y: number }[];
  coin: CoinDetailsType;
}

const CoinChart: React.FC<CoinChartProps> = ({ data, coin }) => {
  const [timePeriod, setTimePeriod] = useState('7d');
  const { Option } = Select;

  // 格式化数据以适应Chart.js
  const formatData = (dataPoints: { x: Date; y: number }[]) => {
    if (!dataPoints || dataPoints.length === 0) return { labels: [], datasets: [] };

    // 按时间排序
    const sortedData = [...dataPoints].sort((a, b) => a.x.getTime() - b.x.getTime());

    return {
      labels: sortedData.map(point => point.x),
      datasets: [
        {
          label: `${ coin.name } 价格 (USD)`,
          data: sortedData.map(point => point.y),
          borderColor: '#165DFF',
          backgroundColor: 'rgba(22, 93, 255, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: '#165DFF',
        },
      ],
    };
  };

  const chartData = formatData(data);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            return `$${ context.raw.toFixed(2) }`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timePeriod === '1d' ? 'hour'
            : timePeriod === '7d' ? 'day'
              : timePeriod === '30d' ? 'week' : 'month',
        },
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(203, 213, 225, 0.7)',
        },
      },
      y: {
        grid: {
          color: 'rgba(203, 213, 225, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(203, 213, 225, 0.7)',
          callback: function(value) {
            if (value >= 1000) {
              return '$' + (value / 1000) + 'k';
            }
            return '$' + value;
          },
        },
      },
    },
  };

  const handlePeriodChange = (value: string) => {
    setTimePeriod(value);
    // 这里可以添加代码来根据新的时间周期重新获取数据
  };

  return (
    <Card
      title={`${ coin.name } 价格图表`}
      extra={
        <Select
          defaultValue="7d"
          style={{ width: 120 }}
          onChange={handlePeriodChange}
        >
          <Option value="1d">1天</Option>
          <Option value="7d">7天</Option>
          <Option value="30d">30天</Option>
          <Option value="90d">90天</Option>
        </Select>
      }
    >
      <div>
        {chartData.labels.length > 0 ? (
          <Line
            data={chartData}
            options={options}
          />
        ) : (
          <div>加载图表数据...</div>
        )}
      </div>
    </Card>
  );
};

export default CoinChart;
