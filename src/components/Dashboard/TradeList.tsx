import React, { useEffect } from 'react';
import { Trade } from '../../types';
import { ArrowDownCircle, ArrowUpCircle, XCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { marketDataService } from '../../utils/marketData';

interface TradeListProps {
  trades: Trade[];
  onCloseTrade: (tradeId: string) => void;
  onDeleteTrade: (tradeId: string) => void;
  onUpdateTrade: (trade: Trade) => void;
}

export function TradeList({ trades, onCloseTrade, onDeleteTrade, onUpdateTrade }: TradeListProps) {
  useEffect(() => {
    // Subscribe to market data for open trades
    const openTrades = trades.filter(t => t.status === 'open');
    
    openTrades.forEach(trade => {
      const callback = (data: { price: number }) => {
        const updatedTrade = {
          ...trade,
          currentPrice: data.price,
          unrealizedPnL: calculateUnrealizedPnL(trade, data.price)
        };
        onUpdateTrade(updatedTrade);
      };

      marketDataService.addListener(trade.symbol, callback);
      return () => marketDataService.removeListener(trade.symbol, callback);
    });
  }, [trades]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateUnrealizedPnL = (trade: Trade, currentPrice: number) => {
    const diff = currentPrice - trade.entry;
    return trade.type === 'buy' ? diff * trade.quantity : -diff * trade.quantity;
  };

  const calculatePnL = (trade: Trade) => {
    if (trade.status === 'open' && trade.currentPrice) {
      return trade.unrealizedPnL;
    }
    if (trade.exit === null) return null;
    const diff = trade.exit - trade.entry;
    return trade.type === 'buy' ? diff * trade.quantity : -diff * trade.quantity;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trades.map((trade) => (
              <tr key={trade.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(trade.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {trade.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`flex items-center ${trade.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                    {trade.type === 'buy' ? <ArrowUpCircle size={16} className="mr-1" /> : <ArrowDownCircle size={16} className="mr-1" />}
                    {trade.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${trade.entry.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trade.status === 'open' && trade.currentPrice ? (
                    <span className="flex items-center">
                      ${trade.currentPrice.toFixed(2)}
                      <RefreshCw size={14} className="ml-2 text-gray-400 animate-spin" />
                    </span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trade.exit ? `$${trade.exit.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {trade.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(trade.status === 'open' && trade.unrealizedPnL !== undefined) || trade.exit ? (
                    <span className={calculatePnL(trade)! >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${calculatePnL(trade)!.toFixed(2)}
                      {trade.status === 'open' && <span className="text-xs ml-1">(unrealized)</span>}
                    </span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    trade.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {trade.status === 'open' ? (
                      <CheckCircle size={12} className="mr-1" />
                    ) : (
                      <XCircle size={12} className="mr-1" />
                    )}
                    {trade.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {trade.status === 'open' && (
                    <button
                      onClick={() => onCloseTrade(trade.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteTrade(trade.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}