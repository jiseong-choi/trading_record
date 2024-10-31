import React, { useState } from 'react';
import { User } from '../../types';
import { storage } from '../../utils/storage';
import { Lock, Mail } from 'lucide-react';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onToggleForm: () => void;
}

export function LoginForm({ onLogin, onToggleForm }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="appearance-none border rounded-lg w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              className="appearance-none border rounded-lg w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
            type="submit"
          >
            Sign In
          </button>
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-blue-500 hover:text-blue-700 font-semibold"
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}