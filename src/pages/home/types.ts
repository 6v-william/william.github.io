/**
 * CoinGecko API 数据类型
 */
export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply?: number;
  max_supply?: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface CoinGeckoDetails {
  id: string;
  symbol: string;
  name: string;
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
  };
}

/**
 * Binance API 数据类型
 */
export interface BinanceSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  filters: any[];
}

export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  askPrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

export interface BinanceTrade {
  e: string;
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  b: number;
  a: number;
  T: number;
  m: boolean;
  M: boolean;
}

/**
 * 应用内部统一使用的数据类型
 */
export interface CoinType {
  id: string; // 唯一标识符
  symbol: string; // 交易对符号
  name: string; // 加密货币名称
  image?: string; // 图标URL
  price: number; // 当前价格
  priceChange: number; // 价格变化
  priceChangePercent: number; // 价格变化百分比
  volume: number; // 成交量
  high: number; // 最高价
  low: number; // 最低价
  marketCap?: number; // 市值 (如果有)
  lastUpdate: number; // 最后更新时间
}

/**
 * 数据转换工具
 */
export const convertBinanceTickerToCoinType = (ticker: BinanceTicker): CoinType => {
  return {
    id: ticker.symbol,
    symbol: ticker.symbol,
    name: ticker.symbol.replace('USDT', ''),
    price: parseFloat(ticker.lastPrice),
    priceChange: parseFloat(ticker.priceChange),
    priceChangePercent: parseFloat(ticker.priceChangePercent),
    volume: parseFloat(ticker.volume),
    high: parseFloat(ticker.highPrice),
    low: parseFloat(ticker.lowPrice),
    lastUpdate: Date.now(),
  };
};

export const convertCoinGeckoCoinToCoinType = (coin: CoinGeckoCoin): CoinType => {
  return {
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    image: coin.image,
    price: coin.current_price,
    priceChange: coin.price_change_24h,
    priceChangePercent: coin.price_change_percentage_24h,
    volume: coin.total_volume,
    high: coin.high_24h,
    low: coin.low_24h,
    marketCap: coin.market_cap,
    lastUpdate: new Date(coin.last_updated).getTime(),
  };
};
