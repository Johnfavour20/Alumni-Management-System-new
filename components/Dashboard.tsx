import React from 'react';
import type { Alumni } from '../types';
import { Users, GraduationCap, Award, Activity, TrendingUp, Target, Star, DollarSign } from './icons';

interface Props {
  alumni: Alumni[];
  animateCards: boolean;
}

const Dashboard: React.FC<Props> = ({ alumni, animateCards }) => {
  const totalAlumni = alumni.length;
  const mscGraduates = alumni.filter(a => a.degree === 'MSc').length;
  const phdGraduates = alumni.filter(a => a.degree === 'PhD').length;
  const recentGraduates = alumni.filter(a => Number(a.graduationYear) >= 2020).length;
  const activeAlumni = alumni.filter(a => a.isActive).length;
  const averageSalary = alumni.reduce((sum, a) => sum + (Number(a.salary) || 0), 0) / (totalAlumni || 1);

  // FIX: Explicitly type the accumulator and cast the initial value for the reduce function to ensure correct type inference.
  const graduationYearsData = alumni.reduce((acc: Record<string, number>, a) => {
    acc[a.graduationYear] = (acc[a.graduationYear] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // FIX: Explicitly type the accumulator and cast the initial value for the reduce function to ensure correct type inference.
  const careerData = alumni.reduce((acc: Record<string, number>, a) => {
      const role = a.currentPosition.includes("Engineer") ? "Software Engineer" : 
                   a.currentPosition.includes("Scientist") ? "Research Scientist" :
                   a.currentPosition.includes("CEO") || a.currentPosition.includes("Entrepreneur") ? "Entrepreneur/CEO" :
                   a.currentPosition.includes("Officer") ? "Technology Officer" :
                   a.currentPosition.includes("Professor") ? "Academic/Professor" : "Other";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mb-2">
          Alumni Dashboard
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">Welcome to the Computer Science Alumni Management System</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Alumni', value: totalAlumni, icon: Users, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-600' },
          { title: 'MSc Graduates', value: mscGraduates, icon: GraduationCap, color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50 dark:bg-teal-900/20', textColor: 'text-teal-600' },
          { title: 'PhD Graduates', value: phdGraduates, icon: Award, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', textColor: 'text-emerald-600' },
          { title: 'Active Alumni', value: activeAlumni, icon: Activity, color: 'from-green-400 to-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-500' }
        ].map((stat, index) => (
          <div 
            key={stat.title}
            className={`${stat.bgColor} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${animateCards ? 'animate-fade-in' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{stat.title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><TrendingUp className="h-6 w-6 text-green-500 mr-2" />Graduation Trends</h3>
          <div className="space-y-4">
            {Object.entries(graduationYearsData).sort(([a], [b]) => a.localeCompare(b)).map(([year, count]) => (
              <div key={year} className="flex items-center space-x-4">
                <span className="w-12 text-sm font-medium">{year}</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  {/* FIX: Cast `count` to a number to resolve arithmetic operation type error. */}
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(Number(count) / (totalAlumni || 1)) * 100}%` }}></div>
                </div>
                <span className="w-8 text-sm text-gray-700 dark:text-gray-300">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><Target className="h-6 w-6 text-green-500 mr-2" />Career Distribution</h3>
          <div className="space-y-4">
            {Object.entries(careerData).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{role}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-white w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;