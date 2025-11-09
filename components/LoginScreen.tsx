
import React, { useState } from 'react';
import useUserStore from '../store/userStore';
import { LogoIcon } from './icons';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('test@user.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useUserStore((state) => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (email === 'test@user.com' && password === 'password') {
        login(email);
      } else {
        setError('Invalid credentials. Use test@user.com and password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg p-8 transform transition-all hover:scale-[1.01] duration-300">
          <div className="flex justify-center mb-6">
            <LogoIcon className="w-16 h-16 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">Welcome Back</h2>
          <p className="text-center text-slate-400 mb-8">Sign in to manage your services.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account? <a href="#" className="font-medium text-cyan-400 hover:text-cyan-300">Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
