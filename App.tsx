
import React, { useState, useEffect } from 'react';
import type { Alumni, Page, Toast as ToastType, ModalType, Post, Conversation, Message } from './types';
import { INITIAL_ALUMNI_DATA, INITIAL_POSTS_DATA, INITIAL_CONVERSATIONS_DATA, CURRENT_USER_ID } from './constants';
import Navigation from './components/Navigation';
import MobileSidebar from './components/MobileSidebar';
import Dashboard from './components/Dashboard';
import AlumniRecords from './components/AlumniRecords';
import Analytics from './components/Analytics';
import Community from './components/Community';
import Messages from './components/Messages';
import AlumniModal from './components/AlumniModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [alumni, setAlumni] = useState<Alumni[]>(INITIAL_ALUMNI_DATA);
  const [toast, setToast] = useState<ToastType | null>(null);

  // New state for communication features
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS_DATA);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS_DATA);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [typingInfo, setTypingInfo] = useState<{ conversationId: number, participantName: string } | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('view');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [alumniToDelete, setAlumniToDelete] = useState<Alumni | null>(null);
  
  const unreadMessages = conversations.filter(c => {
      const lastMessage = c.messages[c.messages.length - 1];
      return lastMessage && lastMessage.authorId !== CURRENT_USER_ID && !lastMessage.read;
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
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlumni(alumni.filter(person => person.id !== id));
      showToast('Alumni deleted successfully!', 'success');
    } catch (error) {
      showToast('Failed to delete alumni', 'error');
    } finally {
      setIsLoading(false);
      setAlumniToDelete(null);
    }
  };
  
  const handleSave = async (formData: Omit<Alumni, 'id' | 'isActive' | 'lastLogin' | 'joinDate'>, id?: number) => {
    setIsLoading(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (id !== undefined) { // Editing
            setAlumni(alumni.map(person => person.id === id ? { ...person, ...formData } : person));
            showToast('Alumni updated successfully!', 'success');
        } else { // Adding
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
        setIsLoading(false);
    }
  };

  // Community Feature Handlers
  const handleLikePost = (postId: number) => {
    setPosts(posts.map(p => {
        if (p.id === postId) {
            const liked = p.likes.includes(CURRENT_USER_ID);
            const likes = liked ? p.likes.filter(id => id !== CURRENT_USER_ID) : [...p.likes, CURRENT_USER_ID];
            return { ...p, likes };
        }
        return p;
    }));
  };

  const handleAddComment = (postId: number, content: string) => {
    setPosts(posts.map(p => {
        if (p.id === postId) {
            const newComment = { id: Date.now(), authorId: CURRENT_USER_ID, content, timestamp: 'Just now' };
            return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
    }));
  };

    const handleCreatePost = (content: string) => {
        // For demo, new posts are authored by the first alumnus
        const authorId = alumni[0]?.id || 1;
        const newPost: Post = {
            id: Date.now(),
            authorId: authorId,
            content,
            timestamp: "Just now",
            likes: [],
            comments: []
        };
        setPosts([newPost, ...posts]);
        showToast('Post created successfully!', 'success');
    };

    const simulateResponse = (conversationId: number) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;
    
        const otherParticipantId = conversation.participantIds.find(id => id !== CURRENT_USER_ID);
        const participant = alumni.find(a => a.id === otherParticipantId);
        if (!participant) return;
    
        setTimeout(() => {
          setTypingInfo({ conversationId, participantName: participant.firstName });
        }, 1000);
    
        setTimeout(() => {
          setTypingInfo(null);
          const responses = ["That's interesting!", "Thanks for letting me know.", "I'll get back to you soon.", "Okay, sounds good.", "Got it."];
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
        }, 3000 + Math.random() * 2000); // Respond after 3-5 seconds
      };
      
    // Messaging Feature Handlers
    const handleStartConversation = (alumniId: number) => {
        let conversation = conversations.find(c => c.participantIds.includes(alumniId));
        if (!conversation) {
            conversation = {
                id: Date.now(),
                participantIds: [CURRENT_USER_ID, alumniId],
                messages: []
            };
            setConversations([...conversations, conversation]);
        }
        setActiveConversationId(conversation.id);
        setCurrentPage('messages');
        if (showModal) closeModal();
    };
    
    const handleSendMessage = (conversationId: number, content: string) => {
        const newMessage: Message = {
            id: Date.now(),
            authorId: CURRENT_USER_ID,
            content,
            timestamp: 'Just now',
            read: true,
            type: 'text'
        };
        
        setConversations(conversations.map(c => 
            c.id === conversationId ? { ...c, messages: [...c.messages, newMessage] } : c
        ));

        simulateResponse(conversationId);
    };

    const handleSendVoiceNote = (conversationId: number, duration: string) => {
        const newVoiceNote: Message = {
            id: Date.now(),
            authorId: CURRENT_USER_ID,
            content: 'Voice Note',
            timestamp: 'Just now',
            read: true,
            type: 'voice',
            duration,
        };
        setConversations(convos => convos.map(c => 
            c.id === conversationId ? { ...c, messages: [...c.messages, newVoiceNote] } : c
        ));
        simulateResponse(conversationId);
    };

    const setActiveConversationAndReadMessages = (id: number | null) => {
        setActiveConversationId(id);
        if (id !== null) {
            setConversations(convos => convos.map(convo => {
                if (convo.id === id) {
                    return {
                        ...convo,
                        messages: convo.messages.map(msg => ({...msg, read: true}))
                    }
                }
                return convo;
            }));
        }
    };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard alumni={alumni} animateCards={animateCards} />;
      case 'alumni':
        return <AlumniRecords alumni={alumni} animateCards={animateCards} openModal={openModal} confirmDelete={confirmDelete} onStartConversation={handleStartConversation} />;
      case 'community':
        return <Community posts={posts} alumni={alumni} onLikePost={handleLikePost} onAddComment={handleAddComment} onCreatePost={handleCreatePost} />;
      case 'messages':
        return <Messages conversations={conversations} alumni={alumni} activeConversationId={activeConversationId} setActiveConversationId={setActiveConversationAndReadMessages} onSendMessage={handleSendMessage} onSendVoiceNote={handleSendVoiceNote} typingInfo={typingInfo} />;
      case 'analytics':
        return <Analytics alumni={alumni} />;
      default:
        return <Dashboard alumni={alumni} animateCards={animateCards} />;
    }
  };
  
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
      />
      <MobileSidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <main className="transition-all duration-300">
        {renderPage()}
      </main>

      {showModal && (
        <AlumniModal 
          modalType={modalType}
          selectedAlumni={selectedAlumni}
          onClose={closeModal}
          onSave={handleSave}
          isLoading={isLoading}
          onStartConversation={handleStartConversation}
        />
      )}
      
      {alumniToDelete && (
        <DeleteConfirmModal 
          alumniToDelete={alumniToDelete}
          onClose={() => setAlumniToDelete(null)}
          onConfirm={deleteAlumni}
          isLoading={isLoading}
        />
      )}
      
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .typing-dot {
            animation: typing-blink 1.4s infinite both;
        }
        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes typing-blink {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default App;