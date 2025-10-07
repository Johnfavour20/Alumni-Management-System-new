
import React from 'react';
import { Home, Database, BarChart3, X, MessageSquare, Mail } from './icons';
import type { Page } from '../types';

interface Props {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const MobileSidebar: React.FC<Props> = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
      <div className={`absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Menu</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <nav className="p-6 space-y-4">
          {[
            { name: 'Dashboard', icon: Home, page: 'dashboard' as Page },
            { name: 'Alumni Records', icon: Database, page: 'alumni' as Page },
            { name: 'Community', icon: MessageSquare, page: 'community' as Page },
            { name: 'Messages', icon: Mail, page: 'messages' as Page },
            { name: 'Analytics', icon: BarChart3, page: 'analytics' as Page }
          ].map(item => (
            <button
              key={item.page}
              onClick={() => { setCurrentPage(item.page); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                currentPage === item.page 
                  ? 'bg-gradient-to-r from-green-500 to-green-700 text-white transform scale-105' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileSidebar;
