import React from 'react';
import { Table, Tag, Button } from 'antd';
import { CoinType } from './types';
import { formatNumber } from '@/utils';

interface CoinListProps {
  coins: CoinType[];
  onSelect: (coinId: string) => void;
  livePrices: Record<string, CoinType>;
}

const CoinList: React.FC<CoinListProps> = ({ coins, onSelect, livePrices }) => {
  const columns = [
    {
      title: '排名',
      dataIndex: 'market_cap_rank',
      key: 'rank',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <img src={record.image} alt={record.name} style={{ width: 16, height: 16 }} />
          <p>{record.name}</p>
          <p>{record.symbol.toUpperCase()}</p>
        </div>
      ),
    },
    {
      title: "流通供应量",
      dataIndex: 'circulating_supply',
      key: 'circulating_supply',
      render: (_: number) => formatNumber(_),
    },
    {
      title: '价格',
      dataIndex: 'current_price',
      key: 'price',
      render: (_: any, record: any) => {
        const livePrice = livePrices[record.id];
        const price = livePrice?.current_price || record.current_price;
        return (
          <div>
            {livePrice && <span></span>}
            ${price.toLocaleString()}
          </div>
        );
      },
    },
    {
      title: '24h变化',
      dataIndex: 'price_change_percentage_24h',
      key: 'change',
      render: (_: any, record: any) => {
        const liveChange = livePrices[record.id]?.price_change_percentage_24h || record.price_change_percentage_24h;
        const isPositive = liveChange >= 0;
        return (
          <Tag
            color={isPositive ? 'green' : 'red'}
            // icon={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          >
            {liveChange.toFixed(2)}%
          </Tag>
        );
      },
    },
    {
      title: '市值',
      dataIndex: 'market_cap',
      key: 'market_cap',
      render: (marketCap: any, record: any) => {
        const liveChange = livePrices[record.id]?.market_cap || record.market_cap;

        return `$${ formatNumber(liveChange) }`;
      },
    },
    {
      title: '24小时交易量',
      dataIndex: 'total_volume',
      key: 'total_volume',
      render: (marketCap: any, record: any) => {
        const liveChange = livePrices[record.id]?.total_volume || record.total_volume;

        return formatNumber(liveChange);
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          onClick={() => onSelect(record.id)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <Table
      style={{ flex: 1 }}
      dataSource={coins}
      columns={columns}
      rowKey="id"
      pagination={false}
      bordered={false}
      tableLayout="fixed"
    />
  );
};

export default CoinList;
