import React, { useState, useEffect, useRef } from 'react';
import { Table, Tag, Button } from 'antd';
import { formatNumber } from '@/utils';

interface CoinListProps {
  isLoading: boolean;
  onSelect: (coinSymbol: string) => void;
}

const CoinList: React.FC<CoinListProps> = ({ isLoading, onSelect }) => {
  const [coins, setCoins] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 初始化WebSocket连接
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
    wsRef.current = ws;

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);

        // 过滤USDT交易对并排序
        const filteredCoins = data
          .filter((item: any) => item.s.endsWith('USDT'))
          .sort((a: any, b: any) => parseFloat(b.q) - parseFloat(a.q)) // 按24h交易量排序
          // .slice(0, 10); // 取前10个

        setCoins(filteredCoins);
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
  }, []);

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
      // 优化排名列样式
      style: {
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
      },
    },
    {
      title: '名称',
      dataIndex: 's',
      key: 'name',
      render: (symbol: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div>
            <span>{symbol.replace('USDT', '')}</span>
          </div>
          <p>USDT</p>
        </div>
      ),
      // 优化名称列样式
      style: {
        paddingLeft: '10px',
      },
    },
    {
      title: "价格",
      dataIndex: 'c',
      key: 'price',
      render: (price: string) => `$${ parseFloat(price).toFixed(2) }`,
      // 优化价格列样式
      style: {
        textAlign: 'center',
      },
    },
    {
      title: '24h变化',
      dataIndex: 'P',
      key: 'change',
      render: (change: string) => {
        const isPositive = parseFloat(change) >= 0;
        return (
          <Tag
            color={isPositive ? 'green' : 'red'}
          >
            {parseFloat(change).toFixed(2)}%
          </Tag>
        );
      },
      // 优化24h变化列样式
      style: {
        textAlign: 'center',
      },
    },
    {
      title: '市值',
      dataIndex: 'q',
      key: 'market_cap',
      render: (volume: string) => `$${ formatNumber(parseFloat(volume)) }`,
      // 优化市值列样式
      style: {
        textAlign: 'center',
      },
    },
    {
      title: '24小时交易量',
      dataIndex: 'Q',
      key: 'total_volume',
      render: (volume: string) => formatNumber(parseFloat(volume)),
      // 优化24小时交易量列样式
      style: {
        textAlign: 'center',
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          onClick={() => onSelect(record.s)}
          style={{ backgroundColor: '#007bff', border: 'none', borderRadius: '4px', padding: '6px 12px' }}
        >
          详情
        </Button>
      ),
      // 优化操作列样式
      style: {
        textAlign: 'center',
      },
    },
  ];

  return (
    <Table
      style={{
        flex: 1,
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'auto',
        backgroundColor: '#fff',
        maxWidth: 1000,
        height: "calc(100vh - 190px)",
      }}
      dataSource={coins}
      columns={columns}
      rowKey="s"
      pagination={false}
      bordered={false}
      tableLayout="fixed"
      loading={isLoading || !coins.length}
      locale={{ emptyText: error || '加载中...' }}
    />
  );
};

export default CoinList;
