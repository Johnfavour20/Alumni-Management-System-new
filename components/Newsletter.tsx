import React, { useState, useMemo, useRef } from 'react';
import type { Alumni } from '../types';
import { Send, Loader, Bold, Italic, Underline, ListIcon, ListOrdered, Code } from './icons';

interface Props {
  alumni: Alumni[];
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const Newsletter: React.FC<Props> = ({ alumni, showToast }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [filters, setFilters] = useState({
    degree: '',
    graduationYear: '',
    status: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Fix: Add explicit string types to the sort callback parameters to fix type inference issue.
  const availableYears = useMemo(() => [...new Set(alumni.map(a => a.graduationYear))].sort((a: string, b: string) => b.localeCompare(a)), [alumni]);

  const selectedAlumni = useMemo(() => {
    return alumni.filter(person => {
      const matchesDegree = !filters.degree || person.degree === filters.degree;
      const matchesYear = !filters.graduationYear || person.graduationYear === filters.graduationYear;
      const matchesStatus = filters.status === '' || person.isActive.toString() === filters.status;
      return matchesDegree && matchesYear && matchesStatus;
    });
  }, [alumni, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSendNewsletter = async () => {
    if (!subject.trim() || !body.trim() || selectedAlumni.length === 0) {
      showToast('Please fill in subject, body, and select recipients.', 'warning');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    showToast(`Newsletter sent to ${selectedAlumni.length} alumni successfully!`, 'success');
    setSubject('');
    setBody('');
  };

  const applyFormatting = (format: 'bold' | 'italic' | 'underline' | 'ul' | 'ol' | 'placeholder') => {
    const textarea = bodyTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);
    let newText;
    const pre = body.substring(0, start);
    const post = body.substring(end);
    let cursorOffset = 0;

    switch (format) {
      case 'bold': newText = `**${selectedText}**`; cursorOffset = 2; break;
      case 'italic': newText = `*${selectedText}*`; cursorOffset = 1; break;
      case 'underline': newText = `__${selectedText}__`; cursorOffset = 2; break;
      case 'ul': newText = selectedText.split('\n').map(line => line ? `- ${line}` : '- ').join('\n'); break;
      case 'ol': newText = selectedText.split('\n').map((line, index) => line ? `${index + 1}. ${line}` : `${index + 1}. `).join('\n'); break;
      case 'placeholder': newText = `{{firstName}}`; break;
      default: newText = selectedText;
    }
    
    setBody(pre + newText + post);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText.length > 0 && cursorOffset > 0) {
         textarea.setSelectionRange(start + cursorOffset, end + cursorOffset);
      } else {
        textarea.setSelectionRange(start + newText.length, start + newText.length);
      }
    }, 0);
  };
  
  const renderPreview = () => {
    let previewBody = body
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
    const lines = previewBody.split('\n');
    let htmlLines: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    lines.forEach(line => {
        let isUl = line.trim().startsWith('- ');
        let isOl = /^\d+\.\s/.test(line.trim());

        if (isUl && listType !== 'ul') {
            if(listType === 'ol') htmlLines.push('</ol>');
            htmlLines.push('<ul>');
            listType = 'ul';
        } else if (isOl && listType !== 'ol') {
            if(listType === 'ul') htmlLines.push('</ul>');
            htmlLines.push('<ol>');
            listType = 'ol';
        } else if (!isUl && !isOl && listType) {
            htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
            listType = null;
        }

        if (isUl) {
            htmlLines.push(`<li>${line.trim().substring(2)}</li>`);
        } else if (isOl) {
            htmlLines.push(`<li>${line.trim().replace(/^\d+\.\s/, '')}</li>`);
        } else {
            htmlLines.push(line ? `<p>${line}</p>` : '<br/>');
        }
    });

    if (listType) {
        htmlLines.push(listType === 'ul' ? '</ul>' : '</ol>');
    }
    
    previewBody = htmlLines.join('').replace(/<\/p><p>/g, '</p><p style="margin-top: 1em">');

    if (selectedAlumni.length > 0) {
        const sampleAlumni = selectedAlumni[0];
        previewBody = previewBody
            .replace(/\{\{firstName\}\}/g, sampleAlumni.firstName)
            .replace(/\{\{lastName\}\}/g, sampleAlumni.lastName)
            .replace(/\{\{company\}\}/g, sampleAlumni.company);
    } else {
        previewBody = previewBody
            .replace(/\{\{firstName\}\}/g, '[FirstName]')
            .replace(/\{\{lastName\}\}/g, '[LastName]')
            .replace(/\{\{company\}\}/g, '[Company]');
    }

    return { __html: previewBody };
  };

  const ToolbarButton = ({ onClick, icon: Icon, title }: { onClick: () => void; icon: React.ElementType; title: string }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mb-2">Alumni Newsletter</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">Compose and send newsletters to your alumni network</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Recipients</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <select name="degree" value={filters.degree} onChange={handleFilterChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                <option value="">All Degrees</option><option value="MSc">MSc</option><option value="PhD">PhD</option>
              </select>
              <select name="graduationYear" value={filters.graduationYear} onChange={handleFilterChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                <option value="">All Years</option>
                {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none dark:bg-gray-700 dark:text-white">
                <option value="">All Status</option><option value="true">Active</option><option value="false">Inactive</option>
              </select>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">{selectedAlumni.length} alumni selected</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Newsletter Subject" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Body</label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="flex items-center space-x-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
                <ToolbarButton onClick={() => applyFormatting('bold')} icon={Bold} title="Bold" />
                <ToolbarButton onClick={() => applyFormatting('italic')} icon={Italic} title="Italic" />
                <ToolbarButton onClick={() => applyFormatting('underline')} icon={Underline} title="Underline" />
                <ToolbarButton onClick={() => applyFormatting('ul')} icon={ListIcon} title="Bulleted List" />
                <ToolbarButton onClick={() => applyFormatting('ol')} icon={ListOrdered} title="Numbered List" />
                <ToolbarButton onClick={() => applyFormatting('placeholder')} icon={Code} title="Insert Placeholder" />
              </div>
              <textarea ref={bodyTextareaRef} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your newsletter content here... Use placeholders like {{firstName}}." className="w-full h-64 p-4 rounded-b-lg border-0 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-white resize-none" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Live Preview</h3>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[300px] bg-gray-50 dark:bg-gray-900 overflow-y-auto">
                <p className="font-bold text-lg mb-4">{subject || "[Your Subject Here]"}</p>
                <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={renderPreview()} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Ready to Send?</h3>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">You are about to send this newsletter to {selectedAlumni.length} alumni. Please review the content before sending.</p>
              <button onClick={handleSendNewsletter} disabled={isLoading || selectedAlumni.length === 0} className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span>{isLoading ? 'Sending...' : 'Send Newsletter'}</span>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;