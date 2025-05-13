/**
 * 加密货币基本信息
 */
export interface Coin {
  /** 加密货币唯一标识符 */
  id: string;
  /** 加密货币符号，如btc、eth */
  symbol: string;
  /** 加密货币名称，如Bitcoin、Ethereum */
  name: string;
  /** 加密货币图标URL */
  image: string;
  /** 当前价格（USD） */
  current_price: number;
  /** 市值（USD） */
  market_cap: number;
  /** 市值排名 */
  market_cap_rank: number;
  /** 完全稀释估值（USD），可选 */
  fully_diluted_valuation?: number;
  /** 24小时交易量（USD） */
  total_volume: number;
  /** 24小时最高价（USD） */
  high_24h: number;
  /** 24小时最低价（USD） */
  low_24h: number;
  /** 24小时价格变化（USD） */
  price_change_24h: number;
  /** 24小时价格变化百分比 */
  price_change_percentage_24h: number;
  /** 24小时市值变化（USD） */
  market_cap_change_24h: number;
  /** 24小时市值变化百分比 */
  market_cap_change_percentage_24h: number;
  /** 流通供应量 */
  circulating_supply: number;
  /** 总供应量，可选 */
  total_supply?: number;
  /** 最大供应量，可选 */
  max_supply?: number;
  /** 历史最高价（USD） */
  ath: number;
  /** 历史最高价变化百分比 */
  ath_change_percentage: number;
  /** 历史最高价日期 */
  ath_date: string;
  /** 历史最低价（USD） */
  atl: number;
  /** 历史最低价变化百分比 */
  atl_change_percentage: number;
  /** 历史最低价日期 */
  atl_date: string;
  /** 最后更新时间 */
  last_updated: string;
}

/**
 * 加密货币详情信息
 */
export interface CoinDetails {
  /** 加密货币唯一标识符 */
  id: string;
  /** 加密货币符号 */
  symbol: string;
  /** 加密货币名称 */
  name: string;
  /** 加密货币图片信息 */
  image: {
    /** 大图URL */
    large: string;
  };
  /** 市场数据 */
  market_data: {
    /** 当前价格信息 */
    current_price: {
      /** 当前价格（USD） */
      usd: number;
    };
    /** 价格变化百分比 */
    price_change_percentage_24h: number;
    /** 7天价格变化百分比 */
    price_change_percentage_7d: number;
    /** 市值信息 */
    market_cap: {
      /** 市值（USD） */
      usd: number;
    };
    /** 24小时交易量 */
    total_volume: {
      /** 24小时交易量（USD） */
      usd: number;
    };
    /** 24小时最高价 */
    high_24h: {
      /** 24小时最高价（USD） */
      usd: number;
    };
    /** 24小时最低价 */
    low_24h: {
      /** 24小时最低价（USD） */
      usd: number;
    };
  };
}
