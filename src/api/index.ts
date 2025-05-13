import { Coin } from "../pages/home/types";

// 使用CoinGecko API获取加密货币数据
const API_BASE = 'https://api.coingecko.com/api/v3';
const options = {
  method: "GET",
  headers: {
    accept: 'application/json',
    // 'x-cg-pro-api-key': 'CG-qbFnQVCQgcpBYxmmLCANxztX',
  },
};
// x_cg_pro_api_key=CG-qbFnQVCQgcpBYxmmLCANxztX&

export const fetchTopCoins = async (limit = 10): Promise<Coin[]> => {
  const response = await fetch(
    `${ API_BASE }/coins/markets?&vs_currency=usd&order=market_cap_desc&per_page=${ limit }&page=1&sparkline=true&price_change_percentage=1h,24h,7d`,
    options
  );
  if (!response.ok) {
    throw new Error('Failed to fetch top coins');
  }
  return response.json();
};

export const fetchCoinData = async (coinId: string) => {
  const response = await fetch(
    `${ API_BASE }/coins/${ coinId }?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    options
  );
  if (!response.ok) {
    throw new Error('Failed to fetch coin data');
  }
  return response.json();
};

export const fetchHistoricalData = async (coinId: string, days = '14d') => {
  const response = await fetch(
    `${ API_BASE }/coins/${ coinId }/market_chart?vs_currency=usd&days=${ days }&interval=daily`,
    options
  );
  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }
  const data = await response.json();
  // 转换数据格式以适应Chart.js
  return data.prices.map(([timestamp, price]: [number, number]) => ({
    x: new Date(timestamp),
    y: price,
  }));
};

// 获取实时价格数据
export const fetchLivePrice = async (coinIds: string) => {
  const response = await fetch(
    `${ API_BASE }/simple/price?ids=${ coinIds }&vs_currencies=usd&include_24hr_change=true`,
    options
  );
  if (!response.ok) {
    throw new Error('Failed to fetch live price');
  }
  return response.json();
};
