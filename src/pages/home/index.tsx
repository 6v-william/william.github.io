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
  const handleCoinSymbolSelect = (symbol: string) => {
    setSelectedCoinSymbol(symbol);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333333' }}>加密货币数据追踪</h1>
        <ConnectButton/>
      </div>

      <Content style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <Spin spinning={loading} style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <CoinList
              isLoading={loading}
              onSelect={handleCoinSymbolSelect}
            />
            {selectedCoinSymbol && <>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', height: "calc(100vh - 190px)", overflow: "auto" }}>
                <div style={{ flex: 1 }}>
                  <CoinChart
                    coinSymbol={selectedCoinSymbol}
                    isLoading={loading}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <CoinDetails
                    coinSymbol={selectedCoinSymbol}
                    isLoading={loading}
                  />
                </div>
              </div>
              <div style={{ flex: 1, height: "calc(100vh - 190px)", overflow: "auto" }}>
                <CoinTrades
                  coinSymbol={selectedCoinSymbol}
                  isLoading={loading}
                />
              </div>
            </>}
          </div>
        </Spin>
      </Content>
      <Footer style={{ textAlign: 'center', padding: '12px 0', backgroundColor: '#ffffff', boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)' }}>
        <p style={{ color: '#666666', fontSize: '14px' }}>coingecko需要付费账号，免费账号会被限流，所以目前使用的是币安数据。</p>
        <p style={{ color: '#666666', fontSize: '14px' }}>交易功能相对会简单，直接用币安就可以，当然如果是做合约的话，直接用web3就可以了</p>
        <p style={{ color: '#666666', fontSize: '14px' }}>样式比较丑，时间紧迫见谅见谅</p>
      </Footer>
    </Layout>
  );
};

export default App;
