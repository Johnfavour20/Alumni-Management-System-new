
import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Conversation, Alumni, User } from '../types';
import { Send, Mail, ChevronLeft, Mic, Play, Pause } from './icons';

interface Props {
  conversations: Conversation[];
  users: Map<number, User | Alumni>;
  currentUser: User;
  activeConversationId: number | null;
  setActiveConversationId: (id: number | null) => void;
  onSendMessage: (conversationId: number, content: string) => void;
  onSendVoiceNote: (conversationId: number, duration: string) => void;
  typingInfo: { conversationId: number, participantName: string } | null;
}

const VoiceNotePlayer: React.FC<{ duration: string, isSender: boolean }> = ({ duration, isSender }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<number | null>(null);
    const audioDuration = useMemo(() => {
        const [minutes, seconds] = duration.split(':').map(Number);
        return minutes * 60 + seconds;
    }, [duration]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            intervalRef.current = window.setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 100 / audioDuration;
                });
            }, 1000);
        }
    };
    
    const progressColor = isSender ? 'bg-white/50' : 'bg-green-500/50';
    const textColor = isSender ? 'text-white' : 'text-gray-700 dark:text-gray-300';
    const iconColor = isSender ? 'text-white' : 'text-green-500';

    return (
        <div className={`flex items-center space-x-2 ${textColor}`}>
            <button onClick={togglePlay} className={`${iconColor}`}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <div className="w-32 h-1 bg-gray-300/50 rounded-full">
                <div className={`h-1 rounded-full ${progressColor}`} style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-xs font-mono">{duration}</span>
        </div>
    );
};

const Messages: React.FC<Props> = ({ conversations, users, currentUser, activeConversationId, setActiveConversationId, onSendMessage, onSendVoiceNote, typingInfo }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation, typingInfo]);
  
  useEffect(() => {
      if (isRecording) {
          recordingIntervalRef.current = window.setInterval(() => {
              setRecordingTime(prev => prev + 1);
          }, 1000);
      } else {
          if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
          setRecordingTime(0);
      }
      return () => {
          if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      }
  }, [isRecording]);

  const handleSend = () => {
    if (newMessage.trim() && activeConversationId !== null) {
      onSendMessage(activeConversationId, newMessage);
      setNewMessage('');
    }
  };
  
  const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
  }

  const handleMicPress = () => {
      navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => setIsRecording(true))
          .catch(err => alert("Microphone access is required for voice notes."));
  };
  
  const handleMicRelease = () => {
      setIsRecording(false);
      if (activeConversationId !== null && recordingTime > 0) {
        onSendVoiceNote(activeConversationId, formatTime(recordingTime));
      }
  };
  
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mb-2">Messages</h2>
        <p className="text-gray-600 dark:text-gray-400">Your private conversations</p>
      </div>

      <div className="flex h-[70vh] bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Left Panel: Conversation List */}
        <div className={`${activeConversationId !== null ? 'hidden lg:flex' : 'flex'} w-full lg:w-1/3 border-r border-gray-200 dark:border-gray-700 flex-col`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold">Chats</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(convo => {
              const otherParticipantId = convo.participantIds.find(id => id !== currentUser.id);
              const participant = otherParticipantId ? users.get(otherParticipantId) : null;
              const lastMessage = convo.messages[convo.messages.length - 1];
              const unread = lastMessage && lastMessage.authorId !== currentUser.id && !lastMessage.read;

              return (
                <div key={convo.id} onClick={() => setActiveConversationId(convo.id)} className={`flex items-center space-x-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${activeConversationId === convo.id ? 'bg-green-50 dark:bg-gray-900' : ''}`}>
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                    {participant ? `${participant.firstName.charAt(0)}${participant.lastName.charAt(0)}` : '?'}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className={`font-semibold truncate ${unread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{participant ? `${participant.firstName} ${participant.lastName}` : 'Unknown'}</p>
                      {unread && <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>}
                    </div>
                    <p className={`text-sm truncate ${unread ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>{lastMessage?.type === 'voice' ? 'Voice Note' : lastMessage?.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Chat Window */}
        <div className={`${activeConversationId === null ? 'hidden lg:flex' : 'flex'} w-full lg:w-2/3 flex flex-col`}>
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                <button onClick={() => setActiveConversationId(null)} className="lg:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                  {users.get(activeConversation.participantIds.find(id => id !== currentUser.id)!)?.firstName.charAt(0)}
                  {users.get(activeConversation.participantIds.find(id => id !== currentUser.id)!)?.lastName.charAt(0)}
                </div>
                <h3 className="font-bold text-lg">{users.get(activeConversation.participantIds.find(id => id !== currentUser.id)!)?.firstName} {users.get(activeConversation.participantIds.find(id => id !== currentUser.id)!)?.lastName}</h3>
              </div>

              <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-4">
                {activeConversation.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.authorId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.authorId === currentUser.id ? 'bg-green-700 text-white rounded-br-none' : 'bg-white dark:bg-gray-700 rounded-bl-none'}`}>
                      {msg.type === 'voice' ? (
                        <VoiceNotePlayer duration={msg.duration || '0:00'} isSender={msg.authorId === currentUser.id} />
                      ) : (
                        <p>{msg.content}</p>
                      )}
                      <p className={`text-xs mt-1 text-right ${msg.authorId === currentUser.id ? 'opacity-90' : 'text-gray-500 dark:text-gray-400'}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
                {typingInfo && typingInfo.conversationId === activeConversationId && (
                  <div className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-white dark:bg-gray-700 rounded-bl-none flex items-center space-x-2">
                          <span className="typing-dot">.</span>
                          <span className="typing-dot">.</span>
                          <span className="typing-dot">.</span>
                      </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={isRecording ? '' : newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isRecording ? `Recording... ${formatTime(recordingTime)}` : "Type a message..."}
                    className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-green-500 dark:bg-gray-700"
                    disabled={isRecording}
                  />
                  {newMessage ? (
                    <button onClick={handleSend} className="p-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors">
                      <Send className="h-6 w-6" />
                    </button>
                  ) : (
                    <button 
                        onMouseDown={handleMicPress}
                        onMouseUp={handleMicRelease}
                        onTouchStart={handleMicPress}
                        onTouchEnd={handleMicRelease}
                        className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-green-700'} text-white hover:bg-green-800`}
                    >
                      <Mic className="h-6 w-6" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                <div>
                    <Mail className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold">Select a conversation</h3>
                    <p>Choose a chat from the left panel to start messaging.</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
