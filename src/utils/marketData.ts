import { MarketData } from '../types';

const FINNHUB_API_KEY = 'cn8fhnhr01qjp8lgfkn0cn8fhnhr01qjp8lgfkng'; // Free API key for demo

class MarketDataService {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Set<(data: MarketData) => void>> = new Map();

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'trade') {
        const marketData: MarketData = {
          symbol: data.data[0].s,
          price: data.data[0].p,
          timestamp: data.data[0].t,
        };
        this.notifySubscribers(marketData);
      }
    };

    this.ws.onopen = () => {
      this.subscribers.forEach((_, symbol) => {
        this.subscribe(symbol);
      });
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.reconnect();
    };

    this.ws.onclose = () => {
      this.reconnect();
    };
  }

  private reconnect() {
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  subscribe(symbol: string) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'subscribe', symbol }));
    }
  }

  unsubscribe(symbol: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }));
    }
    this.subscribers.delete(symbol);
  }

  addListener(symbol: string, callback: (data: MarketData) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
      this.subscribe(symbol);
    }
    this.subscribers.get(symbol)?.add(callback);
  }

  removeListener(symbol: string, callback: (data: MarketData) => void) {
    this.subscribers.get(symbol)?.delete(callback);
    if (this.subscribers.get(symbol)?.size === 0) {
      this.unsubscribe(symbol);
    }
  }

  private notifySubscribers(data: MarketData) {
    const subscribers = this.subscribers.get(data.symbol);
    if (subscribers) {
      subscribers.forEach(callback => callback(data));
    }
  }
}

export const marketDataService = new MarketDataService();