import React, { useState, useEffect } from 'react';
import type { Alumni, ModalType, Degree, User } from '../types';
import { 
  X, Mail, Phone, MapPin, GraduationCap, Building2, DollarSign, 
  Globe, ExternalLink, Activity, Award, Zap, Loader 
} from './icons';

interface Props {
  modalType: ModalType;
  selectedAlumni: Alumni | null;
  currentUser: User;
  onClose: () => void;
  onSave: (alumni: Omit<Alumni, 'id' | 'isActive' | 'lastLogin' | 'joinDate'>, id?: number) => Promise<void>;
  isLoading: boolean;
  onStartConversation: (alumniId: number) => void;
}

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  graduationYear: '',
  degree: '' as Degree,
  program: 'Computer Science',
  currentPosition: '',
  company: '',
  location: '',
  salary: '',
  linkedin: '',
  achievements: '',
  skills: '',
  openToMentoring: false
};

const AlumniModal: React.FC<Props> = ({ modalType, selectedAlumni, currentUser, onClose, onSave, isLoading, onStartConversation }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const isStudentView = currentUser.role === 'Student';
  const isEditingOwnProfile = modalType === 'edit' && selectedAlumni?.id === currentUser.id;

  useEffect(() => {
    if ((modalType === 'edit' || modalType === 'view') && selectedAlumni) {
      const { achievements, skills, ...rest } = selectedAlumni;
      setFormData({
        ...INITIAL_FORM_DATA, // Ensure all fields are present
        ...rest,
        achievements: Array.isArray(achievements) ? achievements.join(', ') : '',
        skills: Array.isArray(skills) ? skills.join(', ') : ''
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [modalType, selectedAlumni]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.degree) errors.degree = 'Degree is required';
    if (!formData.graduationYear) errors.graduationYear = 'Graduation year is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // FIX: Correctly access 'checked' property for checkbox input type to ensure boolean value is captured.
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: inputValue });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const finalData = {
        ...formData,
        achievements: formData.achievements.split(',').map(a => a.trim()).filter(a => a),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    }
    await onSave(finalData, selectedAlumni?.id);
  };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
          <div className="p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                {modalType === 'view' && 'Alumni Profile'}
                {modalType === 'add' && 'Add New Alumni'}
                {modalType === 'edit' && 'Edit Alumni Profile'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {modalType === 'view' && selectedAlumni && (
             <div className="space-y-6">
             <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
               <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                 {selectedAlumni.firstName.charAt(0)}{selectedAlumni.lastName.charAt(0)}
               </div>
               <div className="flex-1">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                   {selectedAlumni.firstName} {selectedAlumni.lastName}
                 </h2>
                 <p className="text-lg text-gray-700 dark:text-gray-300">{selectedAlumni.currentPosition}</p>
                 <p className="text-green-600 dark:text-green-400 font-medium">{selectedAlumni.company}</p>
               </div>
                <div className="flex flex-col items-end space-y-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedAlumni.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                    }`}>
                        {selectedAlumni.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <button 
                        onClick={() => onStartConversation(selectedAlumni.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                        <Mail className="h-4 w-4" />
                        <span>{isStudentView ? 'Request to Connect' : 'Message'}</span>
                    </button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                 <div className="flex items-center space-x-3"><Mail className="h-5 w-5 text-green-500" /><span className="text-gray-900 dark:text-white">{selectedAlumni.email}</span></div>
                 {!isStudentView && <div className="flex items-center space-x-3"><Phone className="h-5 w-5 text-green-500" /><span className="text-gray-900 dark:text-white">{selectedAlumni.phone}</span></div>}
                 <div className="flex items-center space-x-3"><MapPin className="h-5 w-5 text-green-500" /><span className="text-gray-900 dark:text-white">{selectedAlumni.location}</span></div>
                 <div className="flex items-center space-x-3"><GraduationCap className="h-5 w-5 text-green-500" /><span className="text-gray-900 dark:text-white">{selectedAlumni.degree} {selectedAlumni.program} ({selectedAlumni.graduationYear})</span></div>
               </div>
               <div className="space-y-4">
                 <div className="flex items-center space-x-3"><Building2 className="h-5 w-5 text-green-500" /><span className="text-gray-900 dark:text-white">{selectedAlumni.company}</span></div>
                 {!isStudentView && <div className="flex items-center space-x-3"><DollarSign className="h-5 w-5 text-green-500" /><span className="text-gray-900 dark:text-white">₦{(Number(selectedAlumni.salary) || 0).toLocaleString()}</span></div>}
                 <div className="flex items-center space-x-3"><Globe className="h-5 w-5 text-green-500" /><a href={`https://${selectedAlumni.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 flex items-center space-x-1"><span>LinkedIn Profile</span><ExternalLink className="h-4 w-4" /></a></div>
                 {!isStudentView && <div className="flex items-center space-x-3"><Activity className="h-5 w-5 text-green-500" /><span className="text-gray-900 dark:text-white">Last login: {selectedAlumni.lastLogin}</span></div>}
               </div>
             </div>

             <div><h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center"><Award className="h-5 w-5 text-green-500 mr-2" />Achievements</h4><div className="flex flex-wrap gap-2">{selectedAlumni.achievements.map((achievement, index) => (<span key={index} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full text-sm">{achievement}</span>))}</div></div>
             <div><h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center"><Zap className="h-5 w-5 text-green-500 mr-2" />Skills</h4><div className="flex flex-wrap gap-2">{selectedAlumni.skills.map((skill, index) => (<span key={index} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full text-sm">{skill}</span>))}</div></div>
           </div>
            )}

            {(modalType === 'add' || modalType === 'edit') && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {isEditingOwnProfile && (
                  <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                    <label htmlFor="openToMentoring" className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        id="openToMentoring"
                        name="openToMentoring"
                        checked={formData.openToMentoring}
                        onChange={handleInputChange}
                        className="h-5 w-5 rounded text-green-500 focus:ring-green-500"
                      />
                      <span className="font-medium text-gray-800 dark:text-gray-200">Open to Mentoring Students</span>
                    </label>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-lg border ${validationErrors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors`} />
                    {validationErrors.firstName && (<p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-lg border ${validationErrors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors`} />
                    {validationErrors.lastName && (<p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>)}
                  </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-lg border ${validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors`} />
                    {validationErrors.email && (<p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>)}
                  </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                     <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" />
                   </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Degree *</label>
                    <select name="degree" value={formData.degree} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-lg border ${validationErrors.degree ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors`}>
                      <option value="">Select Degree</option><option value="MSc">MSc</option><option value="PhD">PhD</option>
                    </select>
                    {validationErrors.degree && (<p className="text-red-500 text-sm mt-1">{validationErrors.degree}</p>)}
                  </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Program</label>
                     <input type="text" name="program" value={formData.program} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Graduation Year *</label>
                     <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleInputChange} min="2000" max={new Date().getFullYear()} className={`w-full px-4 py-3 rounded-lg border ${validationErrors.graduationYear ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-green-500'} focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors`} />
                     {validationErrors.graduationYear && (<p className="text-red-500 text-sm mt-1">{validationErrors.graduationYear}</p>)}
                   </div>
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Position</label><input type="text" name="currentPosition" value={formData.currentPosition} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label><input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary (NGN)</label><input type="number" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="5000000" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn Profile</label><input type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="linkedin.com/in/yourprofile" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Achievements (comma-separated)</label><textarea name="achievements" value={formData.achievements} onChange={handleInputChange} rows={3} placeholder="Award 1, Award 2" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors resize-none" /></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills (comma-separated)</label><textarea name="skills" value={formData.skills} onChange={handleInputChange} rows={3} placeholder="Python, Machine Learning" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors resize-none" /></div>
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">Cancel</button>
                  <button type="submit" disabled={isLoading} className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 font-medium flex items-center space-x-2 transform hover:scale-105">
                    {isLoading ? (<><Loader className="h-5 w-5 animate-spin" /><span>Saving...</span></>) : (<span>{modalType === 'add' ? 'Add Alumni' : 'Update Alumni'}</span>)}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
};

export default AlumniModal;