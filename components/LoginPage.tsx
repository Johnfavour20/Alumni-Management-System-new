import React, { useState } from 'react';
import { Mail, Key, LogIn, GraduationCap, Loader } from './icons';

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  onSwitchToSignUp: () => void;
}

const LoginPage: React.FC<Props> = ({ onLogin, isLoading, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
               <GraduationCap className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">UNIPORT CS Alumni & Student Portal</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Sign in to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@uniport-cs.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" c lassName="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="mt-1 relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </div>
                )}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignUp} className="font-medium text-green-600 hover:text-green-500 focus:outline-none">
                    Sign Up
                </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
