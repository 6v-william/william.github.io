import React, { useState, useEffect, useRef } from 'react';
import { Card, Statistic, Row, Col, Skeleton } from 'antd';
import { formatNumber } from '@/utils';

interface CoinDetailsProps {
  coinSymbol: string; // 例如: BTCUSDT
  isLoading: boolean;
}

// 从Binance API获取的硬币详情类型
interface BinanceCoinDetails {
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  bidPrice: number;
  askPrice: number;
  openPrice: number;
}

const CoinDetails: React.FC<CoinDetailsProps> = ({ coinSymbol, isLoading }) => {
  const [coinData, setCoinData] = useState<BinanceCoinDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!coinSymbol) return;

    // 初始化WebSocket连接获取实时数据
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${ coinSymbol.toLowerCase() }@ticker`);
    wsRef.current = ws;

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        setCoinData({
          symbol: data.s,
          price: parseFloat(data.c),
          priceChange24h: parseFloat(data.P),
          volume24h: parseFloat(data.q),
          high24h: parseFloat(data.h),
          low24h: parseFloat(data.l),
          bidPrice: parseFloat(data.b),
          askPrice: parseFloat(data.a),
          openPrice: parseFloat(data.o),
        });
      } catch (err) {
        console.error('Error parsing Binance data:', err);
        setError('数据解析错误');
      }
    };

    ws.onerror = err => {
      console.error('WebSocket error:', err);
      setError('连接失败，请稍后重试');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [coinSymbol]);

  // 计算价格变化百分比
  const getPriceChangePercentage = () => {
    if (!coinData) return 0;
    return ((coinData.price - coinData.openPrice) / coinData.openPrice) * 100;
  };

  if (isLoading || !coinData) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div>
          {error}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="当前价格"
            value={coinData.price}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix="$"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="24h变化"
            value={coinData.priceChange24h}
            precision={2}
            valueStyle={{ color: coinData.priceChange24h >= 0 ? '#3f8600' : '#cf1322' }}
            suffix="%"
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Statistic
            title="开盘价"
            value={coinData.openPrice}
            precision={2}
            prefix="$"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="24h变化率"
            value={getPriceChangePercentage()}
            precision={2}
            valueStyle={{ color: getPriceChangePercentage() >= 0 ? '#3f8600' : '#cf1322' }}
            suffix="%"
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Statistic
            title="24h交易量"
            value={coinData.volume24h}
            formatter={value => `$${ formatNumber(value) }`}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="买价"
            value={coinData.bidPrice}
            precision={2}
            prefix="$"
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Statistic
            title="卖价"
            value={coinData.askPrice}
            precision={2}
            prefix="$"
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="最高价(24h)"
            value={coinData.high24h}
            precision={2}
            prefix="$"
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Statistic
            title="最低价(24h)"
            value={coinData.low24h}
            precision={2}
            prefix="$"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default CoinDetails;
