import React, { useState, useEffect, useRef } from 'react';
import { Table, Tag, Skeleton } from 'antd';

// 交易数据类型定义
export interface TradeType {
  id: string; // 交易ID
  price: number; // 交易价格
  amount: number; // 交易数量
  total: number; // 交易总额 (price * amount)
  direction: 'buy' | 'sell'; // 交易方向：买入或卖出
  timestamp: string; // 交易时间戳
}

interface CoinTradesProps {
  coinSymbol: string; // 加密货币交易符号，如 "BTCUSDT"
  isLoading: boolean;
  coinId?: string; // 可选参数，根据实际需要决定是否保留
}

const CoinTrades: React.FC<CoinTradesProps> = ({ coinSymbol, isLoading }) => {
  const [trades, setTrades] = useState<TradeType[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const tradesRef = useRef<TradeType[]>([]);

  useEffect(() => {
    if (!coinSymbol) return;

    // 初始化WebSocket连接
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${ coinSymbol.toLowerCase() }@trade`);
    wsRef.current = ws;

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        const trade: TradeType = {
          id: data.t.toString(), // 交易ID
          price: parseFloat(data.p), // 价格
          amount: parseFloat(data.q), // 数量
          total: parseFloat(data.p) * parseFloat(data.q), // 总额
          direction: data.m ? 'sell' : 'buy', // 交易方向
          timestamp: new Date(data.T).toISOString(), // 时间戳
        };

        // 更新交易数据（保持最新的50条）
        tradesRef.current = [trade, ...tradesRef.current].slice(0, 50);
        setTrades([...tradesRef.current]);
      } catch (error) {
        console.error('Error parsing trade data:', error);
      }
    };

    ws.onerror = error => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      // 可以添加重连逻辑
    };

    // 组件卸载时关闭WebSocket连接
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [coinSymbol]);

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${ price.toFixed(2) }`,
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => amount.toFixed(4),
    },
    {
      title: '总额',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${ total.toFixed(2) }`,
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      render: (direction: 'buy' | 'sell') => (
        <Tag color={direction === 'buy' ? 'green' : 'red'}>
          {direction === 'buy' ? '买入' : '卖出'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h3>实时交易数据</h3>
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : trades.length === 0 ? (
        <div>
          等待交易数据...
        </div>
      ) : (
        <Table
          dataSource={trades}
          columns={columns}
          rowKey="id"
          pagination={false}
          bordered={false}
        />
      )}
    </div>
  );
};

export default CoinTrades;
