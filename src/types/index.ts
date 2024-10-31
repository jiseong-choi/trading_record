export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entry: number;
  exit: number | null;
  quantity: number;
  date: string;
  status: 'open' | 'closed';
  notes: string;
  pnl?: number;
  currentPrice?: number;
  unrealizedPnL?: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
}

export interface MarketData {
  symbol: string;
  price: number;
  timestamp: number;
}