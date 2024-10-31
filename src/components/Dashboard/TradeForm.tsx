import React, { useState } from 'react';
import { Trade } from '../../types';
import { PlusCircle } from 'lucide-react';

interface TradeFormProps {
  onSubmit: (trade: Omit<Trade, 'id'>) => void;
}

export function TradeForm({ onSubmit }: TradeFormProps) {
  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState<'buy' | 'sell'>('buy');
  const [entry, setEntry] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      symbol: symbol.toUpperCase(),
      type,
      entry: parseFloat(entry),
      exit: null,
      quantity: parseFloat(quantity),
      date: new Date().toISOString(),
      status: 'open',
      notes
    });

    // Reset form
    setSymbol('');
    setType('buy');
    setEntry('');
    setQuantity('');
    setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <PlusCircle className="text-blue-500 mr-2" size={24} />
        <h2 className="text-xl font-bold text-gray-800">New Trade</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="symbol">
            Symbol
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="symbol"
            type="text"
            placeholder="AAPL"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
            Type
          </label>
          <select
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'buy' | 'sell')}
            required
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="entry">
            Entry Price
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="entry"
            type="number"
            step="0.01"
            placeholder="100.00"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
            Quantity
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="quantity"
            type="number"
            step="0.01"
            placeholder="100"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
          Notes
        </label>
        <textarea
          className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="notes"
          rows={3}
          placeholder="Enter your trade notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          Add Trade
        </button>
      </div>
    </form>
  );
}