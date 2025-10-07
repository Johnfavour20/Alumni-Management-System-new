
import React from 'react';
import type { Toast as ToastProps } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Bell, X } from './icons';

interface Props {
  toast: ToastProps;
  onClose: () => void;
}

const Toast: React.FC<Props> = ({ toast, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Bell
  };
  
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-teal-500'
  };
  
  const Icon = icons[toast.type];
  
  return (
    <div className={`fixed top-4 right-4 ${colors[toast.type]} text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center space-x-3 transform transition-all duration-300 animate-pulse`}>
      <Icon className="h-5 w-5" />
      <span className="font-medium">{toast.message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
