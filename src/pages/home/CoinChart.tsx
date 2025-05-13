import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'antd';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

interface CoinChartProps {
  coinSymbol: string; // 例如: BTCUSDT
  isLoading: boolean;
}

const CoinChart: React.FC<CoinChartProps> = ({ coinSymbol, isLoading }) => {
  const [ohlcData, setOhlcData] = useState<any[]>([]);
  const chartRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const initialViewSet = useRef<boolean>(false); // 标记是否已设置初始视图

  // 获取今天0点的时间戳
  const getTodayMidnightTimestamp = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  };

  // 从Binance获取K线数据（今天0点以后的2分钟级数据）
  const fetchKlineData = async (symbol: string) => {
    try {
      const startTime = getTodayMidnightTimestamp();
      const endTime = Date.now();

      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${ symbol }&interval=1m&startTime=${ startTime }&endTime=${ endTime }`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch kline data');
      }

      const data = await response.json();

      // 转换Binance K线数据格式为Highcharts需要的格式
      const formattedData = data.map((item: any[]) => [
        item[0], // 时间戳
        parseFloat(item[1]), // 开盘价
        parseFloat(item[2]), // 最高价
        parseFloat(item[3]), // 最低价
        parseFloat(item[4]), // 收盘价
      ]);

      setOhlcData(formattedData);
    } catch (error) {
      console.error('Error fetching kline data:', error);
    }
  };

  useEffect(() => {
    if (!coinSymbol) return;

    fetchKlineData(coinSymbol);

    // 初始化WebSocket连接，实时更新最新价格
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${ coinSymbol.toLowerCase() }@kline_2m`);
    wsRef.current = ws;

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        const kline = data.k;

        // 只处理今天0点以后的数据
        const klineTimestamp = parseInt(kline.t);
        const todayMidnight = getTodayMidnightTimestamp();

        if (klineTimestamp >= todayMidnight) {
          // 限制更新频率为5秒一次
          const now = Date.now();
          if (now - lastUpdateTime.current < 5000) return;
          lastUpdateTime.current = now;

          // 更新最新K线数据
          if (ohlcData.length > 0) {
            const updatedData = [...ohlcData];
            const lastIndex = updatedData.length - 1;

            // 如果是同一个K线周期，则更新
            if (updatedData[lastIndex][0] === klineTimestamp) {
              updatedData[lastIndex] = [
                klineTimestamp,
                parseFloat(kline.o),
                parseFloat(kline.h),
                parseFloat(kline.l),
                parseFloat(kline.c),
              ];
            } else {
              // 否则添加新的K线
              updatedData.push([
                klineTimestamp,
                parseFloat(kline.o),
                parseFloat(kline.h),
                parseFloat(kline.l),
                parseFloat(kline.c),
              ]);

              // 保持数据长度不超过720（一天的120分钟/2分钟=720）
              if (updatedData.length > 720) {
                updatedData.shift();
              }
            }

            setOhlcData(updatedData);

            // 只有在初始视图未设置时，才调整视图显示最近10条
            if (!initialViewSet.current && updatedData.length >= 10) {
              initialViewSet.current = true;

              if (chartRef.current && chartRef.current.chart) {
                const chart = chartRef.current.chart;
                const xAxis = chart.xAxis[0];
                const recentData = updatedData.slice(-10);
                const min = recentData[0][0];
                const max = recentData[recentData.length - 1][0];

                xAxis.setExtremes(min, max, false);
                chart.redraw();
              }
            }
          }
        }
      } catch (error) {
        console.error('Error parsing kline data:', error);
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [coinSymbol]);

  // 图表初始化完成后的回调
  const onChartLoad = (chart: any) => {
    chartRef.current = chart;

    // 设置图表初始化时显示最近的10个数据点
    if (ohlcData.length >= 10) {
      initialViewSet.current = true;
      const xAxis = chart.xAxis[0];
      const recentData = ohlcData.slice(-10);
      const min = recentData[0][0];
      const max = recentData[recentData.length - 1][0];

      xAxis.setExtremes(min, max, false);
      chart.redraw();
    }
  };

  // 格式化工具提示中的时间
  const formatTooltipTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const options: Highcharts.Options = {
    chart: {
      type: 'candlestick',
      height: 400,
      zoomType: 'x',
      events: {
        load: function() {
          onChartLoad(this);
        },
      },
    },
    title: undefined,
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function() {
          return formatTooltipTime(this.value);
        },
      },
      title: {
        text: '时间（分钟）',
      },
      // 设置x轴以每2分钟为单位显示
      tickInterval: 2 * 60 * 1000,
    },
    yAxis: {
      title: {
        text: '价格 (USD)',
      },
    },
    rangeSelector: {
      buttons: [
        { type: 'hour', count: 1, text: '1H' },
        { type: 'hour', count: 6, text: '6H' },
        { type: 'hour', count: 12, text: '12H' },
        { type: 'day', count: 1, text: '24H' },
      ],
      selected: 3, // 默认选中24小时
      inputEnabled: false,
    },
    scrollbar: {
      enabled: true,
    },
    plotOptions: {
      candlestick: {
        color: '#F56C6C', // 下跌颜色
        lineColor: '#F56C6C',
        upColor: '#67C23A', // 上涨颜色
        upLineColor: '#67C23A',
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
        name: `${ coinSymbol }`,
        type: 'candlestick',
        data: ohlcData,
      },
    ],
  };

  return (
    <Card
      title={
        <div>
          {coinSymbol} 实时数据
        </div>
      }
    >
      <div>
        {ohlcData.length > 0 ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
        ) : isLoading ? (
          <div>加载图表数据...</div>
        ) : (
          <div>无今日数据</div>
        )}
      </div>
    </Card>
  );
};

export default CoinChart;
