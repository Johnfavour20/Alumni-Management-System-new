
import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { User as UserIcon, Mail, Save, Key, Loader } from './icons';

interface Props {
  user: User;
  onUpdateUser: (userData: Omit<User, 'id' | 'role'>) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const Profile: React.FC<Props> = ({ user, onUpdateUser, showToast }) => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await onUpdateUser(profileData);
    setIsSavingProfile(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match.", 'error');
      return;
    }
    if (passwordData.newPassword.length < 8) {
        showToast("Password must be at least 8 characters long.", 'warning');
        return;
    }
    setIsSavingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setIsSavingPassword(false);
    showToast("Password changed successfully!", 'success');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };


  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mb-2">My Profile</h2>
        <p className="text-gray-600 dark:text-gray-400">View and manage your personal information and settings.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Information Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><UserIcon className="h-6 w-6 text-green-500 mr-2" />Profile Information</h3>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">{user.role}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                <input type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                <input type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isSavingProfile} className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 font-medium flex items-center space-x-2 transform hover:scale-105 disabled:opacity-50">
                {isSavingProfile ? (<><Loader className="h-5 w-5 animate-spin" /><span>Saving...</span></>) : (<><Save className="h-5 w-5" /><span>Save Changes</span></>)}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><Key className="h-6 w-6 text-green-500 mr-2" />Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
              <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isSavingPassword} className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-medium flex items-center space-x-2 transform hover:scale-105 disabled:opacity-50">
                 {isSavingPassword ? (<><Loader className="h-5 w-5 animate-spin" /><span>Saving...</span></>) : (<><Key className="h-5 w-5" /><span>Update Password</span></>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
