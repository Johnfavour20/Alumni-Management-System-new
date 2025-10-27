import React, { useState } from 'react';
import { Mail, Key, User, GraduationCap, Loader, UserPlus } from './icons';
import type { Degree, UserRole } from '../types';

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  graduationYear: string;
  degree: Degree;
  role: UserRole;
}

interface Props {
  onSignUp: (formData: SignUpFormData) => Promise<void>;
  isLoading: boolean;
  onSwitchToLogin: () => void;
}

const SignUpPage: React.FC<Props> = ({ onSignUp, isLoading, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    graduationYear: '',
    degree: '' as Degree,
  });
  const [role, setRole] = useState<UserRole>('Alumnus');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
        newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (role === 'Alumnus') {
        if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
        if (!formData.degree) newErrors.degree = 'Degree is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSignUp({ ...formData, role });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
               <UserPlus className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Create Your Account</h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mt-1">Join the UNIPORT CS network</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I am a...</label>
                <div className="flex space-x-4">
                    <label className="flex-1 flex items-center p-3 border rounded-lg cursor-pointer transition-colors" style={role === 'Alumnus' ? {borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.05)'} : {}}>
                        <input type="radio" name="role" value="Alumnus" checked={role === 'Alumnus'} onChange={() => setRole('Alumnus')} className="h-4 w-4 text-green-600 focus:ring-green-500" />
                        <span className="ml-3 text-base font-medium">Alumnus</span>
                    </label>
                    <label className="flex-1 flex items-center p-3 border rounded-lg cursor-pointer transition-colors" style={role === 'Student' ? {borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.05)'} : {}}>
                        <input type="radio" name="role" value="Student" checked={role === 'Student'} onChange={() => setRole('Student')} className="h-4 w-4 text-green-600 focus:ring-green-500" />
                        <span className="ml-3 text-base font-medium">Student</span>
                    </label>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                    <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white`} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                    <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white`} />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white`} />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                    <input name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white`} />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
            </div>

            {role === 'Alumnus' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
                        <select name="degree" value={formData.degree} onChange={handleChange} className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.degree ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white`}>
                            <option value="">Select...</option><option value="MSc">MSc</option><option value="PhD">PhD</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Graduation Year</label>
                        <input name="graduationYear" type="number" min="2000" max={new Date().getFullYear()} value={formData.graduationYear} onChange={handleChange} className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.graduationYear ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white`} />
                    </div>
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 focus:outline-none disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? ( <Loader className="h-5 w-5 animate-spin" /> ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Create Account</span>
                  </div>
                )}
              </button>
            </div>
          </form>
           <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="font-medium text-green-600 hover:text-green-500 focus:outline-none">
                    Sign In
                </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;