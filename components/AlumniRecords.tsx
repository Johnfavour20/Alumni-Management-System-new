
import React, { useState, useMemo } from 'react';
import type { Alumni, ViewMode, SortBy, SortOrder } from '../types';
import { 
  Search, Plus, Eye, Edit, Trash2, Building2, GraduationCap, 
  MapPin, Grid, List, SortAsc, SortDesc, Users, Mail
} from './icons';

interface Props {
  alumni: Alumni[];
  animateCards: boolean;
  openModal: (type: 'view' | 'add' | 'edit', alumniData?: Alumni) => void;
  confirmDelete: (id: number) => void;
  onStartConversation: (alumniId: number) => void;
}

const AlumniRecords: React.FC<Props> = ({ alumni, animateCards, openModal, confirmDelete, onStartConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('firstName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filters, setFilters] = useState({
    degree: '',
    graduationYear: '',
    isActive: ''
  });

  const filteredAlumni = useMemo(() => {
    return alumni.filter(person => {
      const matchesSearch = 
        person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.currentPosition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDegree = !filters.degree || person.degree === filters.degree;
      const matchesYear = !filters.graduationYear || person.graduationYear === filters.graduationYear;
      const matchesActive = filters.isActive === '' || person.isActive.toString() === filters.isActive;

      return matchesSearch && matchesDegree && matchesYear && matchesActive;
    }).sort((a, b) => {
      let aVal: string | number = a[sortBy];
      let bVal: string | number = b[sortBy];
      
      if (sortBy === 'salary') {
        aVal = parseInt(a.salary);
        bVal = parseInt(b.salary);
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [alumni, searchTerm, filters, sortBy, sortOrder]);

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mb-2">Alumni Records</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage and view all alumni information</p>
        </div>
        <button onClick={() => openModal('add')} className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
          <Plus className="h-5 w-5" /><span className="font-medium">Add Alumni</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-4"><div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" placeholder="Search alumni..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" /></div></div>
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select value={filters.degree} onChange={(e) => setFilters({...filters, degree: e.target.value})} className="px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors"><option value="">All Degrees</option><option value="MSc">MSc</option><option value="PhD">PhD</option></select>
            <select value={filters.graduationYear} onChange={(e) => setFilters({...filters, graduationYear: e.target.value})} className="px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors"><option value="">All Years</option>{[...new Set(alumni.map(a => a.graduationYear))].sort().map(year => (<option key={year} value={year}>{year}</option>))}</select>
            <select value={filters.isActive} onChange={(e) => setFilters({...filters, isActive: e.target.value})} className="px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors"><option value="">All Status</option><option value="true">Active</option><option value="false">Inactive</option></select>
          </div>
          <div className="lg:col-span-2 flex space-x-2">
            <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">{viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}<span className="hidden sm:inline">{viewMode === 'grid' ? 'List' : 'Grid'}</span></button>
            <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="flex items-center justify-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">{sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}</button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-400">Showing {filteredAlumni.length} of {alumni.length} alumni</p>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors text-sm"><option value="firstName">Sort by Name</option><option value="graduationYear">Sort by Year</option><option value="company">Sort by Company</option><option value="salary">Sort by Salary</option></select>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{filteredAlumni.map((person, index) => (<div key={person.id} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${animateCards ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${index * 50}ms` }}><div className="p-6"><div className="flex items-center space-x-4 mb-4"><div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold">{person.firstName.charAt(0)}{person.lastName.charAt(0)}</div><div className="flex-1"><h3 className="text-lg font-bold text-gray-900 dark:text-white">{person.firstName} {person.lastName}</h3><p className="text-sm text-gray-600 dark:text-gray-400">{person.currentPosition}</p></div><div className={`px-2 py-1 rounded-full text-xs font-medium ${person.isActive ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'}`}>{person.isActive ? 'Active' : 'Inactive'}</div></div><div className="space-y-3 mb-4"><div className="flex items-center space-x-2 text-sm"><Building2 className="h-4 w-4 text-green-500" /><span className="text-gray-700 dark:text-gray-300 truncate">{person.company}</span></div><div className="flex items-center space-x-2 text-sm"><GraduationCap className="h-4 w-4 text-green-500" /><span className="text-gray-700 dark:text-gray-300">{person.degree} {person.graduationYear}</span></div><div className="flex items-center space-x-2 text-sm"><MapPin className="h-4 w-4 text-gray-500" /><span className="text-gray-700 dark:text-gray-300 truncate">{person.location}</span></div></div><div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600"><div className="flex space-x-2"><button onClick={() => openModal('view', person)} className="p-2 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-700 transition-colors" title="View Details"><Eye className="h-4 w-4" /></button><button onClick={() => openModal('edit', person)} className="p-2 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-700 transition-colors" title="Edit"><Edit className="h-4 w-4" /></button><button onClick={() => onStartConversation(person.id)} className="p-2 bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors" title="Message"><Mail className="h-4 w-4" /></button><button onClick={() => confirmDelete(person.id)} className="p-2 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button></div><div className="text-xs text-gray-500 dark:text-gray-400">{person.lastLogin}</div></div></div></div>))}</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Email</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Company</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Position</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th><th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th></tr></thead><tbody className="divide-y divide-gray-200 dark:divide-gray-600">{filteredAlumni.map((person) => (<tr key={person.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><td className="px-6 py-4"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">{person.firstName.charAt(0)}{person.lastName.charAt(0)}</div><div><div className="font-medium text-gray-900 dark:text-white">{person.firstName} {person.lastName}</div><div className="text-sm text-gray-500 dark:text-gray-400">{person.degree} {person.graduationYear}</div></div></div></td><td className="px-6 py-4 text-sm text-gray-900 dark:text-white hidden sm:table-cell">{person.email}</td><td className="px-6 py-4 text-sm text-gray-900 dark:text-white hidden md:table-cell">{person.company}</td><td className="px-6 py-4 text-sm text-gray-900 dark:text-white hidden lg:table-cell">{person.currentPosition}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${person.isActive ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'}`}>{person.isActive ? 'Active' : 'Inactive'}</span></td><td className="px-6 py-4"><div className="flex space-x-2"><button onClick={() => openModal('view', person)} className="p-1 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-700 transition-colors" title="View Details"><Eye className="h-4 w-4" /></button><button onClick={() => openModal('edit', person)} className="p-1 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-700 transition-colors" title="Edit"><Edit className="h-4 w-4" /></button><button onClick={() => onStartConversation(person.id)} className="p-1 bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300 rounded hover:bg-teal-200 dark:hover:bg-teal-700 transition-colors" title="Message"><Mail className="h-4 w-4" /></button><button onClick={() => confirmDelete(person.id)} className="p-1 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button></div></td></tr>))}</tbody></table></div>{filteredAlumni.length === 0 && (<div className="text-center py-12"><Users className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400">No alumni found matching your criteria</p></div>)}</div>
      )}
    </div>
  );
};

export default AlumniRecords;
