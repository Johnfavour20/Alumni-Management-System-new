
import React from 'react';
import { Home, Database, BarChart3, X, MessageSquare, Mail, Send, User, LogOut } from './icons';
import type { Page, User as CurrentUser } from '../types';

interface Props {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentUser: CurrentUser | null;
  onLogout: () => void;
}

const MobileSidebar: React.FC<Props> = ({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, currentUser, onLogout }) => {
  const allLinks = [
    { name: 'Dashboard', icon: Home, page: 'dashboard' as Page, roles: ['Admin'] },
    { name: 'Alumni Records', icon: Database, page: 'alumni' as Page, roles: ['Admin', 'Student'] },
    { name: 'Community', icon: MessageSquare, page: 'community' as Page, roles: ['Admin', 'Alumnus', 'Student'] },
    { name: 'Messages', icon: Mail, page: 'messages' as Page, roles: ['Admin', 'Alumnus', 'Student'] },
    { name: 'Analytics', icon: BarChart3, page: 'analytics' as Page, roles: ['Admin'] },
    { name: 'Newsletter', icon: Send, page: 'newsletter' as Page, roles: ['Admin'] },
    { name: 'Profile', icon: User, page: 'profile' as Page, roles: ['Admin', 'Alumnus', 'Student'] }
  ];

  const visibleLinks = allLinks.filter(link => currentUser && link.roles.includes(currentUser.role));

  const getPageName = (page: Page) => {
    if (page === 'alumni' && currentUser?.role === 'Student') return 'Find a Mentor';
    const link = allLinks.find(l => l.page === page);
    return link ? link.name : 'Dashboard';
  }

  return (
    <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
      <div className={`absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex-grow overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <nav className="p-6 space-y-4">
            {visibleLinks.map(item => (
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
                <span className="font-medium">{getPageName(item.page)}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => { onLogout(); setSidebarOpen(false); }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
