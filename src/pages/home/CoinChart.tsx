import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'antd';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { CoinDetailsType } from './types';
import { fetchHistoricalOHLCData } from '../../api/index';

interface CoinChartProps {
  coinId: string;
  coin: CoinDetailsType;
}

const CoinChart: React.FC<CoinChartProps> = ({ coinId, coin }) => {
  const [ohlcData, setOhlcData] = useState<any[]>([]);
  const chartRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  const fetchData = async () => {
    try {
      const data = await fetchHistoricalOHLCData(coinId);
      setOhlcData(data);
    } catch (error) {
      console.error('Error fetching historical OHLC data:', error);
    }
  };

  useEffect(() => {
    fetchData();

    // 每 10 秒（可根据需求调整）更新一次数据
    intervalRef.current = setInterval(() => {
      fetchData();
    }, 20000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [coinId]);

  const options: Highcharts.Options = {
    chart: {
      type: 'candlestick',
      height: 400,
      zoomType: 'x',
    },
    title: {
      text: `${coin.name} 价格图表`,
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: '价格 (USD)',
      },
    },
    rangeSelector: {
      selected: 0, // 默认选中的时间范围，索引从 0 开始
      inputEnabled: false, // 禁用输入框
    },
    scrollbar: {
      enabled: true, // 启用滚动条
    },
    plotOptions: {
      candlestick: {
        color: 'pink',
        lineColor: 'red',
        upColor: 'lightgreen',
        upLineColor: 'green',
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<small>{point.key}</small><table>',
      pointFormat: '<tr><td style="color: {series.color}">open: </td>' +
        '<td style="text-align: right"><b>${point.open:.2f}</b></td></tr>' +
        '<tr><td style="color: {series.color}">high: </td>' +
        '<td style="text-align: right"><b>${point.high:.2f}</b></td></tr>' +
        '<tr><td style="color: {series.color}">low: </td>' +
        '<td style="text-align: right"><b>${point.low:.2f}</b></td></tr>' +
        '<tr><td style="color: {series.color}">close: </td>' +
        '<td style="text-align: right"><b>${point.close:.2f}</b></td></tr>',
      footerFormat: '</table>',
      valueDecimals: 2,
    },
    series: [
      {
        name: `${coin.name}`,
        type: 'candlestick',
        data: ohlcData,
      },
    ],
  };

  return (
    <Card
      className="bg-gray-800 text-white rounded-xl shadow-lg h-full"
      title={`${coin.name} 价格图表`}
    >
      <div className="h-[400px]">
        {ohlcData.length > 0 ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
        ) : (
          <div className="text-center py-16">加载图表数据...</div>
        )}
      </div>
    </Card>
  );
};

export default CoinChart;