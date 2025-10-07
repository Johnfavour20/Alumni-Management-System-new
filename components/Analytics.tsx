
import React from 'react';
import type { Alumni } from '../types';
import { GraduationCap, MapPin, DollarSign, Building2, Activity } from './icons';

interface Props {
  alumni: Alumni[];
}

const Analytics: React.FC<Props> = ({ alumni }) => {
  const totalAlumni = alumni.length || 1;
  const mscGraduates = alumni.filter(a => a.degree === 'MSc').length;
  const phdGraduates = alumni.filter(a => a.degree === 'PhD').length;
  const activeAlumni = alumni.filter(a => a.isActive).length;
  const recentGraduates = alumni.filter(a => parseInt(a.graduationYear) >= 2020).length;

  const salaries = alumni.map(a => parseInt(a.salary));
  const averageSalary = salaries.reduce((sum, s) => sum + s, 0) / (salaries.length || 1);
  const highestSalary = Math.max(...salaries, 0);
  const lowestSalary = Math.min(...salaries, Infinity);
  
  const geoDistribution = alumni.reduce((acc, person) => {
    const city = person.location.split(',')[0];
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEmployers = Object.entries(
    alumni.reduce((acc, person) => {
      acc[person.company] = (acc[person.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).sort(([,a], [,b]) => b - a).slice(0, 5);
  
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into alumni data and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><GraduationCap className="h-6 w-6 text-green-500 mr-2" />Degree Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-gray-700 dark:text-gray-300">MSc Programs</span><div className="flex items-center space-x-3"><div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000" style={{ width: `${(mscGraduates / totalAlumni) * 100}%` }}></div></div><span className="text-sm font-medium w-12">{mscGraduates}</span></div></div>
            <div className="flex items-center justify-between"><span className="text-gray-700 dark:text-gray-300">PhD Programs</span><div className="flex items-center space-x-3"><div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="h-full bg-gradient-to-r from-green-300 to-green-400 rounded-full transition-all duration-1000" style={{ width: `${(phdGraduates / totalAlumni) * 100}%` }}></div></div><span className="text-sm font-medium w-12">{phdGraduates}</span></div></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><MapPin className="h-6 w-6 text-green-500 mr-2" />Geographic Distribution</h3>
          <div className="space-y-4 max-h-48 overflow-y-auto">
            {Object.entries(geoDistribution).map(([city, count]) => (<div key={city} className="flex items-center justify-between"><span className="text-gray-700 dark:text-gray-300">{city}</span><div className="flex items-center space-x-3"><div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-3"><div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full transition-all duration-1000" style={{ width: `${(count / totalAlumni) * 100}%` }}></div></div><span className="text-sm font-medium w-12">{count}</span></div></div>))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><DollarSign className="h-6 w-6 text-green-500 mr-2" />Salary Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"><p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Average Salary</p><p className="text-2xl font-bold text-green-600">₦{(averageSalary / 1000000).toFixed(1)}M</p></div>
          <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg"><p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Highest Salary</p><p className="text-2xl font-bold text-teal-600">₦{(highestSalary / 1000000).toFixed(1)}M</p></div>
          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"><p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Lowest Salary</p><p className="text-2xl font-bold text-emerald-600">₦{(lowestSalary / 1000000).toFixed(1)}M</p></div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"><p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Salary Range</p><p className="text-2xl font-bold text-green-500">₦{((highestSalary - lowestSalary) / 1000000).toFixed(1)}M</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><Building2 className="h-6 w-6 text-green-500 mr-2" />Top Employers</h3>
          <div className="space-y-4">
            {topEmployers.map(([company, count]) => (<div key={company} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"><span className="font-medium text-gray-900 dark:text-white">{company}</span><span className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full text-sm font-medium">{count} alumni</span></div>))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><Activity className="h-6 w-6 text-green-500 mr-2" />Alumni Engagement</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"><div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Users</span><span className="text-sm font-bold text-green-600">{((activeAlumni / totalAlumni) * 100).toFixed(1)}%</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000" style={{ width: `${(activeAlumni / totalAlumni) * 100}%` }}></div></div></div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"><div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Graduates (2020+)</span><span className="text-sm font-bold text-green-600">{((recentGraduates / totalAlumni) * 100).toFixed(1)}%</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"><div className="h-full bg-gradient-to-r from-green-300 to-green-400 rounded-full transition-all duration-1000" style={{ width: `${(recentGraduates / totalAlumni) * 100}%` }}></div></div></div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"><p className="text-lg font-bold text-green-600">{new Set(alumni.map(a => a.company)).size}</p><p className="text-xs text-gray-600 dark:text-gray-400">Companies</p></div>
                <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg"><p className="text-lg font-bold text-teal-600">{new Set(alumni.map(a => a.location.split(',')[0])).size}</p><p className="text-xs text-gray-600 dark:text-gray-400">Cities</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
