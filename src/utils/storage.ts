import { Trade, User } from '../types';

export const storage = {
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  saveUser: (user: User): void => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },

  getTrades: (userId: string): Trade[] => {
    return JSON.parse(localStorage.getItem(`trades_${userId}`) || '[]');
  },

  saveTrade: (userId: string, trade: Trade): void => {
    const trades = storage.getTrades(userId);
    trades.push(trade);
    localStorage.setItem(`trades_${userId}`, JSON.stringify(trades));
  },

  updateTrade: (userId: string, updatedTrade: Trade): void => {
    const trades = storage.getTrades(userId);
    const index = trades.findIndex((t) => t.id === updatedTrade.id);
    if (index !== -1) {
      trades[index] = updatedTrade;
      localStorage.setItem(`trades_${userId}`, JSON.stringify(trades));
    }
  },

  deleteTrade: (userId: string, tradeId: string): void => {
    const trades = storage.getTrades(userId);
    const filteredTrades = trades.filter((t) => t.id !== tradeId);
    localStorage.setItem(`trades_${userId}`, JSON.stringify(filteredTrades));
  }
};