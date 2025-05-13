import { CoinType } from "../pages/home/types";

// 使用CoinGecko API获取加密货币数据
const API_BASE = 'https://api.coingecko.com/api/v3';
const options = {
  method: "GET",
  headers: {
    accept: 'application/json',
    // 'x-cg-pro-api-key': 'CG-qbFnQVCQgcpBYxmmLCANxztX',
  },
};

export const fetchTopCoins = async (limit = 10): Promise<CoinType[]> => {
  const response = await fetch(
    `${ API_BASE }/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${ limit }&page=1&sparkline=true&price_change_percentage=1h,24h,7d`,
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

// 获取历史OHLC数据
export const fetchHistoricalOHLCData = async (coinId: string) => {
  const response = await fetch(
    `${ API_BASE }/coins/${ coinId }/ohlc?vs_currency=usd&days=30`,
    options
  );
  if (!response.ok) {
    throw new Error('Failed to fetch historical OHLC data');
  }
  return response.json();
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
