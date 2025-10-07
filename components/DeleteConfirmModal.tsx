
import React from 'react';
import type { Alumni } from '../types';
import { AlertTriangle, Trash2, Loader } from './icons';

interface Props {
  alumniToDelete: Alumni | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
  isLoading: boolean;
}

const DeleteConfirmModal: React.FC<Props> = ({ alumniToDelete, onClose, onConfirm, isLoading }) => {
  if (!alumniToDelete) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Deletion</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <span className="font-semibold">{alumniToDelete.firstName} {alumniToDelete.lastName}</span>? 
          This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(alumniToDelete.id)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
