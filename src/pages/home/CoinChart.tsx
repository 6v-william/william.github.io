import React, { useState } from 'react';
import { Card, Select } from 'antd';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { CoinDetailsType } from './types';

interface CoinChartProps {
  data: { x: Date; y: number }[];
  coin: CoinDetailsType;
}

const CoinChart: React.FC<CoinChartProps> = ({ data, coin }) => {
  const [timePeriod, setTimePeriod] = useState('7d');
  const { Option } = Select;

  // 格式化数据以适应Highcharts
  const formatData = (dataPoints: { x: Date; y: number }[]) => {
    if (!dataPoints || dataPoints.length === 0) return [];

    // 按时间排序
    const sortedData = [...dataPoints].sort((a, b) => a.x.getTime() - b.x.getTime());

    return sortedData.map(point => [point.x.getTime(), point.y]);
  };

  const chartData = formatData(data);

  const options = {
    chart: {
      type: 'line',
      backgroundColor: '#1f2937',
      style: {
        fontFamily: 'sans-serif',
        color: '#cbd5e1',
      },
    },
    title: {
      text: `${ coin.name } 价格图表`,
      style: {
        color: '#cbd5e1',
      },
    },
    xAxis: {
      type: 'datetime',
      tickInterval: timePeriod === '1d' ? 3600 * 1000 // 1 hour
        : timePeriod === '7d' ? 24 * 3600 * 1000 // 1 day
          : timePeriod === '30d' ? 7 * 24 * 3600 * 1000 // 1 week
            : 30 * 24 * 3600 * 1000, // 1 month
      gridLineColor: 'rgba(203, 213, 225, 0.1)',
      labels: {
        style: {
          color: 'rgba(203, 213, 225, 0.7)',
        },
      },
    },
    yAxis: {
      title: {
        text: '价格 (USD)',
        style: {
          color: '#cbd5e1',
        },
      },
      gridLineColor: 'rgba(203, 213, 225, 0.1)',
      labels: {
        formatter: function() {
          if (this.value >= 1000) {
            return '$' + (this.value / 1000) + 'k';
          }
          return '$' + this.value;
        },
        style: {
          color: 'rgba(203, 213, 225, 0.7)',
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      style: {
        color: '#cbd5e1',
      },
      formatter: function() {
        return `<b>$${ this.y.toFixed(2) }</b><br/>${ Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) }`;
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: `${ coin.name } 价格 (USD)`,
        data: chartData,
        color: '#165DFF',
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, 'rgba(22, 93, 255, 0.1)'],
            [1, 'rgba(22, 93, 255, 0)'],
          ],
        },
        fillOpacity: 0.5,
        lineWidth: 2,
        marker: {
          enabled: false,
          radius: 4,
          fillColor: '#165DFF',
        },
      },
    ],
  };

  const handlePeriodChange = (value: string) => {
    setTimePeriod(value);
    // 这里可以添加代码来根据新的时间周期重新获取数据
  };

  return (
    <Card
      className="bg-gray-800 text-white rounded-xl shadow-lg h-full"
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
      <div className="h-[400px]">
        {chartData.length > 0 ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        ) : (
          <div className="text-center py-16">加载图表数据...</div>
        )}
      </div>
    </Card>
  );
};

export default CoinChart;
