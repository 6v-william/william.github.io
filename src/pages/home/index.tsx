import { useState, useEffect, useRef } from 'react';
import { Layout, Spin } from 'antd';
import CoinList from './CoinList';
import CoinChart from './CoinChart';
import CoinDetails from './CoinDetails';
import { fetchTopCoins, fetchCoinData, fetchHistoricalData, fetchLivePrice } from '@/api/index';
import { CoinType, CoinDetailsType } from './types';
import 'antd/dist/reset.css';
// import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const { Content, Footer } = Layout;

function App() {
  const [topCoins, setTopCoins] = useState<CoinType[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinDetailsType | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [livePrices, setLivePrices] = useState<Record<string, CoinType>>({});
  const [liveCoinData, setLiveCoinData] = useState<CoinDetailsType | null>(null);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coins = await fetchTopCoins(10);
        setTopCoins(coins);
        // 初始化实时价格数据
        const initialPrices: Record<string, CoinType> = {};
        coins.forEach((coin: any) => {
          initialPrices[coin.id] = coin;
        });
        setLivePrices(initialPrices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top coins:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 实时更新代币列表数据
  useEffect(() => {
    if (topCoins.length === 0) return;

    // 清除之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 每30秒更新一次价格数据
    intervalRef.current = setInterval(async () => {
      try {
        const coinIds = topCoins.map(coin => coin.id).join(',');
        const liveData = await fetchLivePrice(coinIds);

        const updatedPrices: Record<string, CoinType> = {};
        topCoins.forEach(coin => {
          if (liveData[coin.id]) {
            updatedPrices[coin.id] = liveData[coin.id];
          }
        });

        setLivePrices(prev => ({
          ...prev,
          ...updatedPrices,
        }));

        // 如果有选中的代币，更新其详情
        if (selectedCoin && liveData[selectedCoin.id]) {
          setLiveCoinData(prev => ({
            ...prev!,
            market_data: {
              ...prev!.market_data,
              current_price: {
                usd: liveData[selectedCoin.id].usd,
              },
              price_change_percentage_24h: liveData[selectedCoin.id].usd_24h_change,
            },
          }));
        }
      } catch (error) {
        console.error('Error fetching live prices:', error);
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [topCoins, selectedCoin]);

  const handleCoinSelect = async (coinId: string) => {
    setLoading(true);
    try {
      const [coinData, histData] = await Promise.all([
        fetchCoinData(coinId),
        fetchHistoricalData(coinId, '7d'),
      ]);
      setSelectedCoin(coinData);
      setLiveCoinData(coinData);
      setHistoricalData(histData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coin data:', error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px" }}>
        <h1>简易加密货币数据追踪</h1>
        <ConnectButton />
      </div>

      <Content>
        <Spin spinning={loading}>
          <div style={{ display: "flex" }}>
            <CoinList
              coins={topCoins}
              onSelect={handleCoinSelect}
              livePrices={livePrices}
            />
            {selectedCoin && (
              <div style={{ flex: 1 }}>
                <div>
                  <CoinChart data={historicalData} coin={selectedCoin} />
                </div>
                <div>
                  <CoinDetails coin={liveCoinData || selectedCoin} />
                </div>
              </div>
            )}
          </div>

        </Spin>
      </Content>
      <Footer>
        <p>时间有限，之前没玩过小代币，只是随便填写一些字段上去</p>
      </Footer>
    </Layout>
  );
}

export default App;
