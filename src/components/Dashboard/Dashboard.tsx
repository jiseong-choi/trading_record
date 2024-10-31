import React, { useState, useEffect } from 'react';
import { Trade, User } from '../../types';
import { storage } from '../../utils/storage';
import { marketDataService } from '../../utils/marketData';
import { TradeForm } from './TradeForm';
import { TradeList } from './TradeList';
import { LogOut } from 'lucide-react';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    setTrades(storage.getTrades(user.id));
    marketDataService.connect();
  }, [user.id]);

  const handleAddTrade = (newTrade: Omit<Trade, 'id'>) => {
    const trade: Trade = {
      ...newTrade,
      id: crypto.randomUUID()
    };
    storage.saveTrade(user.id, trade);
    setTrades(prev => [...prev, trade]);
  };

  const handleCloseTrade = (tradeId: string) => {
    const exitPrice = parseFloat(prompt('Enter exit price:') || '0');
    if (exitPrice <= 0) return;

    const updatedTrades = trades.map(trade => {
      if (trade.id === tradeId) {
        const updatedTrade = {
          ...trade,
          exit: exitPrice,
          status: 'closed' as const
        };
        storage.updateTrade(user.id, updatedTrade);
        return updatedTrade;
      }
      return trade;
    });
    setTrades(updatedTrades);
  };

  const handleDeleteTrade = (tradeId: string) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      storage.deleteTrade(user.id, tradeId);
      setTrades(prev => prev.filter(trade => trade.id !== tradeId));
    }
  };

  const handleUpdateTrade = (updatedTrade: Trade) => {
    setTrades(prev => prev.map(trade => 
      trade.id === updatedTrade.id ? updatedTrade : trade
    ));
  };

  const calculateStats = () => {
    const closedTrades = trades.filter(t => t.status === 'closed');
    const openTrades = trades.filter(t => t.status === 'open');
    
    const realizedPnL = closedTrades.reduce((sum, trade) => {
      const diff = (trade.exit! - trade.entry) * trade.quantity;
      return sum + (trade.type === 'buy' ? diff : -diff);
    }, 0);

    const unrealizedPnL = openTrades.reduce((sum, trade) => {
      if (!trade.currentPrice) return sum;
      const diff = (trade.currentPrice - trade.entry) * trade.quantity;
      return sum + (trade.type === 'buy' ? diff : -diff);
    }, 0);
    
    const winningTrades = closedTrades.filter(trade => {
      const diff = trade.exit! - trade.entry;
      return trade.type === 'buy' ? diff > 0 : diff < 0;
    });

    return {
      totalTrades: trades.length,
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
      winRate: closedTrades.length ? (winningTrades.length / closedTrades.length * 100).toFixed(1) : 0,
      realizedPnL: realizedPnL.toFixed(2),
      unrealizedPnL: unrealizedPnL.toFixed(2),
      totalPnL: (realizedPnL + unrealizedPnL).toFixed(2)
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-800">Trading Journal</h1>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">{user.email}</span>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Trades</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalTrades}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Open Trades</h3>
            <p className="text-3xl font-bold text-green-600">{stats.openTrades}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Win Rate</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.winRate}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total P&L</h3>
            <div>
              <p className={`text-3xl font-bold ${parseFloat(stats.totalPnL) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${stats.totalPnL}
              </p>
              <div className="mt-2 text-sm">
                <p className="text-gray-500">
                  Realized: <span className={parseFloat(stats.realizedPnL) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${stats.realizedPnL}
                  </span>
                </p>
                <p className="text-gray-500">
                  Unrealized: <span className={parseFloat(stats.unrealizedPnL) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${stats.unrealizedPnL}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TradeForm onSubmit={handleAddTrade} />
          </div>
          <div className="lg:col-span-2">
            <TradeList
              trades={trades}
              onCloseTrade={handleCloseTrade}
              onDeleteTrade={handleDeleteTrade}
              onUpdateTrade={handleUpdateTrade}
            />
          </div>
        </div>
      </main>
    </div>
  );
}