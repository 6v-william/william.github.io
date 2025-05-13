import React, { useState, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import CoinList from './CoinList';
import CoinChart from './CoinChart';
import CoinDetails from './CoinDetails';
import CoinTrades from './CoinTrades';
import 'antd/dist/reset.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const { Content, Footer } = Layout;

const App: React.FC = () => {
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始加载状态（可根据需要保留或移除）
  useEffect(() => {
    // 模拟加载过程，实际数据由CoinList组件通过WebSocket获取
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // 处理硬币选择
  const handleCoinSelect = (symbol: string) => {
    setSelectedCoinSymbol(symbol);
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px" }}>
        <h1>加密货币数据追踪</h1>
        <ConnectButton />
      </div>

      <Content>
        <Spin spinning={loading}>
          <div style={{ display: "flex", gap: 12 }}>
            <CoinList
              isLoading={loading}
              onSelect={handleCoinSelect}
            />
            {selectedCoinSymbol && (
              <div style={{ flex: 1 }}>
                <div>
                  <CoinChart
                    coinSymbol={selectedCoinSymbol}
                    isLoading={loading}
                  />
                </div>
                <div>
                  <CoinDetails
                    coinSymbol={selectedCoinSymbol}
                    isLoading={loading}
                  />
                  <CoinTrades
                    coinSymbol={selectedCoinSymbol}
                    isLoading={loading}
                  />
                </div>
              </div>
            )}
          </div>
        </Spin>
      </Content>
      <Footer>
        <p>coingecko需要付费账号，免费账号会被限流，所以目前使用的是币安数据。</p>
        <p>交易功能相对会简单，直接用币安就可以，当然如果是做合约的话，直接用web3就可以了</p>
        <p>样式比较丑，见谅见谅</p>
      </Footer>
    </Layout>
  );
};

export default App;
