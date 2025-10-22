import React, { useState, useEffect, useMemo } from 'react';
import type { Alumni, Page, Toast as ToastType, ModalType, Post, Conversation, Message, User, Degree, UserRole } from './types';
import { INITIAL_ALUMNI_DATA, INITIAL_POSTS_DATA, INITIAL_CONVERSATIONS_DATA, INITIAL_STUDENT_DATA, CURRENT_USER as ADMIN_USER } from './constants';
import Navigation from './components/Navigation';
import MobileSidebar from './components/MobileSidebar';
import Dashboard from './components/Dashboard';
import AlumniRecords from './components/AlumniRecords';
import Analytics from './components/Analytics';
import Community from './components/Community';
import Messages from './components/Messages';
import Newsletter from './components/Newsletter';
import Profile from './components/Profile';
import AlumniModal from './components/AlumniModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import type { SignUpFormData } from './components/SignUpPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false); // For login/signup
  const [isDataLoading, setIsDataLoading] = useState(false); // For data operations
  
  const [alumni, setAlumni] = useState<Alumni[]>(INITIAL_ALUMNI_DATA);
  const [students, setStudents] = useState<User[]>(INITIAL_STUDENT_DATA);
  const [toast, setToast] = useState<ToastType | null>(null);

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS_DATA);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS_DATA);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [typingInfo, setTypingInfo] = useState<{ conversationId: number, participantName: string } | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('view');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [alumniToDelete, setAlumniToDelete] = useState<Alumni | null>(null);
  
  const allUsersMap = useMemo(() => {
    const map = new Map<number, User | Alumni>();
    alumni.forEach(a => map.set(a.id, a));
    students.forEach(s => map.set(s.id, s));
    map.set(ADMIN_USER.id, ADMIN_USER);
    return map;
  }, [alumni, students]);

  const unreadMessages = conversations.filter(c => {
      const lastMessage = c.messages[c.messages.length - 1];
      return currentUser && lastMessage && lastMessage.authorId !== currentUser.id && !lastMessage.read;
  }).length;

  useEffect(() => {
    setAnimateCards(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if(darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode])

  const showToast = (message: string, type: ToastType['type'] = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email.toLowerCase() === ADMIN_USER.email.toLowerCase()) {
        setCurrentUser(ADMIN_USER);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
        showToast(`Welcome back, ${ADMIN_USER.firstName}!`, 'success');
    } else {
        const foundAlumni = alumni.find(a => a.email.toLowerCase() === email.toLowerCase());
        const foundStudent = students.find(s => s.email.toLowerCase() === email.toLowerCase());
        
        if (foundAlumni) {
            const alumnusUser: User = { id: foundAlumni.id, firstName: foundAlumni.firstName, lastName: foundAlumni.lastName, email: foundAlumni.email, role: 'Alumnus' };
            setCurrentUser(alumnusUser);
            setIsAuthenticated(true);
            setCurrentPage('community');
            showToast(`Welcome, ${alumnusUser.firstName}!`, 'success');
        } else if (foundStudent) {
            setCurrentUser(foundStudent);
            setIsAuthenticated(true);
            setCurrentPage('community');
            showToast(`Welcome, ${foundStudent.firstName}!`, 'success');
        } else {
            showToast('Invalid email or password.', 'error');
        }
    }
    setIsLoading(false);
  };

  const handleSignUp = async (formData: SignUpFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const emailExists = alumni.some(a => a.email.toLowerCase() === formData.email.toLowerCase()) || students.some(s => s.email.toLowerCase() === formData.email.toLowerCase());
    if (emailExists) {
        showToast('An account with this email already exists.', 'error');
        setIsLoading(false);
        return;
    }
    
    const newId = Math.max(...alumni.map(a => a.id), ...students.map(s => s.id), 0) + 1;
    const newUser: User = { id: newId, firstName: formData.firstName, lastName: formData.lastName, email: formData.email, role: formData.role };
    
    if (formData.role === 'Alumnus') {
        const newAlumni: Alumni = {
            id: newId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: '',
            graduationYear: formData.graduationYear,
            degree: formData.degree,
            program: 'Computer Science',
            currentPosition: '',
            company: '',
            location: '',
            salary: '',
            linkedin: '',
            achievements: [],
            isActive: true,
            lastLogin: 'Just now',
            joinDate: new Date().toISOString().split('T')[0],
            skills: [],
            openToMentoring: false,
        };
        setAlumni(prevAlumni => [...prevAlumni, newAlumni]);
    } else { // Student
        setStudents(prevStudents => [...prevStudents, newUser]);
    }

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setCurrentPage('community');
    showToast(`Welcome, ${newUser.firstName}! Your account has been created.`, 'success');

    setIsLoading(false);
  };
  
  const handleLogout = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setAuthMode('login');
      showToast('You have been logged out.', 'info');
  };

  const openModal = (type: ModalType, alumniData: Alumni | null = null) => {
    setModalType(type);
    setSelectedAlumni(alumniData);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedAlumni(null);
  };
  
  const confirmDelete = (id: number) => {
    setAlumniToDelete(alumni.find(a => a.id === id) || null);
  };

  const deleteAlumni = async (id: number) => {
    setIsDataLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlumni(alumni.filter(person => person.id !== id));
      showToast('Alumni deleted successfully!', 'success');
    } catch (error) {
      showToast('Failed to delete alumni', 'error');
    } finally {
      setIsDataLoading(false);
      setAlumniToDelete(null);
    }
  };
  
  const handleSave = async (formData: Omit<Alumni, 'id' | 'isActive' | 'lastLogin' | 'joinDate'>, id?: number) => {
    setIsDataLoading(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (id !== undefined) {
            setAlumni(alumni.map(person => person.id === id ? { ...person, ...formData } : person));
            showToast('Alumni updated successfully!', 'success');
        } else {
            const newAlumni: Alumni = {
                ...formData,
                id: Math.max(...alumni.map(a => a.id), 0) + 1,
                isActive: true,
                lastLogin: 'Just now',
                joinDate: new Date().toISOString().split('T')[0],
            };
            setAlumni([...alumni, newAlumni]);
            showToast('Alumni added successfully!', 'success');
        }
        closeModal();
    } catch (e) {
        showToast('An error occurred. Please try again.', 'error');
    } finally {
        setIsDataLoading(false);
    }
  };
  
  const handleUpdateUser = async (userData: Omit<User, 'id' | 'role'>) => {
      if (!currentUser) return;
      
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);

      if (currentUser.role === 'Alumnus') {
          setAlumni(prevAlumni => prevAlumni.map(a => a.id === currentUser.id ? { ...a, ...userData } : a));
      } else if (currentUser.role === 'Student') {
          setStudents(prevStudents => prevStudents.map(s => s.id === currentUser.id ? updatedUser : s));
      }

      showToast('Profile updated successfully!');
      await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleLikePost = (postId: number) => {
    if (!currentUser) return;
    setPosts(posts.map(p => {
        if (p.id === postId) {
            const liked = p.likes.includes(currentUser.id);
            const likes = liked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id];
            return { ...p, likes };
        }
        return p;
    }));
  };

  const handleAddComment = (postId: number, content: string) => {
    if (!currentUser) return;
    setPosts(posts.map(p => {
        if (p.id === postId) {
            const newComment = { id: Date.now(), authorId: currentUser.id, content, timestamp: 'Just now' };
            return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
    }));
  };

    const handleCreatePost = (content: string) => {
        if (!currentUser) return;
        const newPost: Post = {
            id: Date.now(),
            authorId: currentUser.id,
            content,
            timestamp: "Just now",
            likes: [],
            comments: []
        };
        setPosts([newPost, ...posts]);
        showToast('Post created successfully!', 'success');
    };

    const simulateResponse = (conversationId: number) => {
        if (!currentUser) return;
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;
    
        const otherParticipantId = conversation.participantIds.find(id => id !== currentUser.id);
        const participant = allUsersMap.get(otherParticipantId!);
        if (!participant) return;
    
        setTimeout(() => setTypingInfo({ conversationId, participantName: participant.firstName }), 1000);
    
        setTimeout(() => {
          setTypingInfo(null);
          const responses = ["That's interesting!", "Thanks for letting me know.", "I'll get back to you soon."];
          const reply: Message = {
            id: Date.now(),
            authorId: participant.id,
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: 'Just now',
            read: false,
            type: 'text'
          };
          setConversations(convos => convos.map(c => 
            c.id === conversationId ? { ...c, messages: [...c.messages, reply] } : c
          ));
        }, 3000 + Math.random() * 2000);
      };
      
    const handleStartConversation = (alumniId: number) => {
        if (!currentUser) return;
        let conversation = conversations.find(c => c.participantIds.includes(alumniId) && c.participantIds.includes(currentUser!.id));
        if (!conversation) {
            conversation = { id: Date.now(), participantIds: [currentUser.id, alumniId], messages: [] };
            setConversations([...conversations, conversation]);
        }
        setActiveConversationId(conversation.id);
        setCurrentPage('messages');
        if (showModal) closeModal();
    };
    
    const handleSendMessage = (conversationId: number, content: string) => {
        if (!currentUser) return;
        const newMessage: Message = { id: Date.now(), authorId: currentUser.id, content, timestamp: 'Just now', read: true, type: 'text' };
        setConversations(conversations.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, newMessage] } : c));
        simulateResponse(conversationId);
    };

    const handleSendVoiceNote = (conversationId: number, duration: string) => {
        if (!currentUser) return;
        const newVoiceNote: Message = { id: Date.now(), authorId: currentUser.id, content: 'Voice Note', timestamp: 'Just now', read: true, type: 'voice', duration };
        setConversations(convos => convos.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, newVoiceNote] } : c));
        simulateResponse(conversationId);
    };

    const setActiveConversationAndReadMessages = (id: number | null) => {
        setActiveConversationId(id);
        if (id !== null) {
            setConversations(convos => convos.map(convo => (convo.id === id) ? { ...convo, messages: convo.messages.map(msg => ({...msg, read: true})) } : convo));
        }
    };

  const renderPage = () => {
    if (!currentUser) return null;
    
    const adminPages: Page[] = ['dashboard', 'analytics', 'newsletter'];
    if (currentUser.role !== 'Admin' && adminPages.includes(currentPage)) {
        setCurrentPage('community');
        return <Community users={allUsersMap} posts={posts} currentUser={currentUser} onLikePost={handleLikePost} onAddComment={handleAddComment} onCreatePost={handleCreatePost} />;
    }
     if (currentUser.role === 'Alumnus' && currentPage === 'alumni') {
        setCurrentPage('community');
        return <Community users={allUsersMap} posts={posts} currentUser={currentUser} onLikePost={handleLikePost} onAddComment={handleAddComment} onCreatePost={handleCreatePost} />;
    }

    switch (currentPage) {
      case 'dashboard': return <Dashboard alumni={alumni} animateCards={animateCards} />;
      case 'alumni': return <AlumniRecords alumni={alumni} currentUser={currentUser} animateCards={animateCards} openModal={openModal} confirmDelete={confirmDelete} onStartConversation={handleStartConversation} />;
      case 'community': return <Community users={allUsersMap} posts={posts} currentUser={currentUser} onLikePost={handleLikePost} onAddComment={handleAddComment} onCreatePost={handleCreatePost} />;
      case 'messages': return <Messages conversations={conversations} users={allUsersMap} currentUser={currentUser} activeConversationId={activeConversationId} setActiveConversationId={setActiveConversationAndReadMessages} onSendMessage={handleSendMessage} onSendVoiceNote={handleSendVoiceNote} typingInfo={typingInfo} />;
      case 'analytics': return <Analytics alumni={alumni} />;
      case 'newsletter': return <Newsletter alumni={alumni} showToast={showToast} />;
      case 'profile': return <Profile user={currentUser} onUpdateUser={handleUpdateUser} showToast={showToast} />;
      default: return <Dashboard alumni={alumni} animateCards={animateCards} />;
    }
  };
  
  if (!isAuthenticated || !currentUser) {
    if (authMode === 'login') {
      return <LoginPage onLogin={handleLogin} isLoading={isLoading} onSwitchToSignUp={() => setAuthMode('signup')} />;
    }
    return <SignUpPage onSignUp={handleSignUp} isLoading={isLoading} onSwitchToLogin={() => setAuthMode('login')} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navigation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        unreadMessages={unreadMessages}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <MobileSidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentUser={currentUser}
      />
      
      <main className="transition-all duration-300">
        {renderPage()}
      </main>

      {showModal && (
        <AlumniModal 
          modalType={modalType}
          selectedAlumni={selectedAlumni}
          currentUser={currentUser}
          onClose={closeModal}
          onSave={handleSave}
          isLoading={isDataLoading}
          onStartConversation={handleStartConversation}
        />
      )}
      
      {alumniToDelete && (
        <DeleteConfirmModal 
          alumniToDelete={alumniToDelete}
          onClose={() => setAlumniToDelete(null)}
          onConfirm={deleteAlumni}
          isLoading={isDataLoading}
        />
      )}
      
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .typing-dot { animation: typing-blink 1.4s infinite both; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing-blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
        @media (prefers-reduced-motion: reduce) { .animate-fade-in { animation: none; } }
        @keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        .prose { line-height: 1.6; }
        .prose p, .prose ul, .prose ol { margin-bottom: 1em; }
        .prose ul, .prose ol { padding-left: 1.5em; }
        .prose li { margin-bottom: 0.25em; }
      `}</style>
    </div>
  );
};

export default App;
