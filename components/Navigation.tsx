
import React, { useState } from 'react';
import { Home, Database, BarChart3, GraduationCap, Bell, Menu, X, MessageSquare, Mail } from './icons';
import type { Page } from '../types';
import { NOTIFICATIONS } from '../constants';


interface Props {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  unreadMessages: number;
}

const Navigation: React.FC<Props> = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, darkMode, setDarkMode, unreadMessages }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-lg transition-all duration-300 sticky top-0 z-40`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <GraduationCap className="h-10 w-10 text-green-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                  UNIPORT CS Alumni
                </h1>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {[
              { name: 'Dashboard', icon: Home, page: 'dashboard' as Page },
              { name: 'Alumni Records', icon: Database, page: 'alumni' as Page },
              { name: 'Community', icon: MessageSquare, page: 'community' as Page },
              { name: 'Analytics', icon: BarChart3, page: 'analytics' as Page }
            ].map(item => (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  currentPage === item.page 
                    ? 'bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
                onClick={() => setCurrentPage('messages')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              >
                <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                {unreadMessages > 0 && 
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">{unreadMessages}</span>
                }
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              >
                <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-bounce"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {NOTIFICATIONS.map(notification => (
                      <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'success' ? 'bg-green-500' : 'bg-green-400'}`}></div>
                          <div className="flex-1">
                            <p className="text-sm">{notification.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 transform hover:rotate-180"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
