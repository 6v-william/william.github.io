import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { CoinDetailsType } from './types';

interface CoinDetailsProps {
  coin: CoinDetailsType;
}

const CoinDetails: React.FC<CoinDetailsProps> = ({ coin }) => {
  const { name, symbol, image, market_data } = coin;
  const currentPrice = market_data.current_price.usd;
  const priceChange24h = market_data.price_change_percentage_24h;
  const priceChange7d = market_data.price_change_percentage_7d;
  const marketCap = market_data.market_cap.usd;
  const totalVolume = market_data.total_volume.usd;
  const high24h = market_data.high_24h.usd;
  const low24h = market_data.low_24h.usd;

  return <Card
    className="bg-gray-800 text-white rounded-xl shadow-lg"
    title={
      <div className="flex items-center">
        <img src={image.large} alt={name} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-400">{symbol.toUpperCase()}</p>
        </div>
      </div>
    }
  >
    <Row gutter={16}>
      <Col span={12}>
        <Statistic
          title="当前价格"
          value={currentPrice}
          precision={2}
          valueStyle={{ color: '#3f8600' }}
          prefix="$"
        />
      </Col>
      <Col span={12}>
        <Statistic
          title="24h变化"
          value={priceChange24h}
          precision={2}
          valueStyle={{ color: priceChange24h >= 0 ? '#3f8600' : '#cf1322' }}
          prefix={priceChange24h >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          suffix="%"
        />
      </Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={12}>
        <Statistic
          title="7天变化"
          value={priceChange7d}
          precision={2}
          valueStyle={{ color: priceChange7d >= 0 ? '#3f8600' : '#cf1322' }}
          prefix={priceChange7d >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          suffix="%"
        />
      </Col>
      <Col span={12}>
        <Statistic
          title="市值"
          value={marketCap}
          formatter={value => `$${ value.toLocaleString('en-US') }`}
        />
      </Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={12}>
        <Statistic
          title="24h交易量"
          value={totalVolume}
          formatter={value => `$${ value.toLocaleString('en-US') }`}
        />
      </Col>
      <Col span={12}>
        <Statistic
          title="最高价(24h)"
          value={high24h}
          precision={2}
          prefix="$"
        />
      </Col>
    </Row>
    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={12}>
        <Statistic
          title="最低价(24h)"
          value={low24h}
          precision={2}
          prefix="$"
        />
      </Col>
    </Row>
  </Card>;
};

export default CoinDetails;
