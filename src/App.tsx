import React, { useState } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {isLogin ? (
          <LoginForm onLogin={handleLogin} onToggleForm={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onRegister={handleLogin} onToggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}

export default App;