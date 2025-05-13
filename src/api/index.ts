// 移除对CoinGecko API的依赖，改用Binance API

// 获取币安交易对列表
export const fetchBinanceSymbols = async () => {
  const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
  if (!response.ok) {
    throw new Error('Failed to fetch Binance symbols');
  }
  const data = await response.json();
  return data.symbols;
};
