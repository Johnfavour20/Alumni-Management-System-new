
import React, { useState, useMemo } from 'react';
import type { Post, Alumni } from '../types';
import { CURRENT_USER_ID } from '../constants';
import { ThumbsUp, MessageCircle, Send } from './icons';

interface Props {
  posts: Post[];
  alumni: Alumni[];
  onLikePost: (postId: number) => void;
  onAddComment: (postId: number, content: string) => void;
  onCreatePost: (content: string) => void;
}

const Community: React.FC<Props> = ({ posts, alumni, onLikePost, onAddComment, onCreatePost }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [commentingPostId, setCommentingPostId] = useState<number | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');

  const alumniMap = useMemo(() => {
    const map = new Map<number, Alumni>();
    alumni.forEach(a => map.set(a.id, a));
    return map;
  }, [alumni]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      onCreatePost(newPostContent);
      setNewPostContent('');
    }
  };

  const handleCommentSubmit = (postId: number) => {
    if (newCommentContent.trim()) {
      onAddComment(postId, newCommentContent);
      setNewCommentContent('');
      setCommentingPostId(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mb-2">Community Feed</h2>
        <p className="text-gray-600 dark:text-gray-400">Share updates and connect with fellow alumni</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
        <form onSubmit={handlePostSubmit} className="flex flex-col space-y-4">
            <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:bg-gray-700 dark:text-white transition-colors resize-none"
                rows={3}
            />
            <button type="submit" className="self-end flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
                <Send className="h-5 w-5" />
                <span>Post Update</span>
            </button>
        </form>
      </div>

      <div className="space-y-8">
        {posts.map(post => {
          const author = alumniMap.get(post.authorId);
          return (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {author ? `${author.firstName.charAt(0)}${author.lastName.charAt(0)}` : 'A'}
                </div>
                <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{author ? `${author.firstName} ${author.lastName}` : 'Anonymous'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</p>
                </div>
              </div>
              
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-4">{post.content}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>{post.likes.length} Likes</span>
                <span>{post.comments.length} Comments</span>
              </div>

              <div className="border-t border-b border-gray-200 dark:border-gray-700 flex justify-around">
                <button onClick={() => onLikePost(post.id)} className={`flex-1 flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${post.likes.includes(CURRENT_USER_ID) ? 'text-green-500' : ''}`}>
                    <ThumbsUp className="h-5 w-5" /><span>Like</span>
                </button>
                <button onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)} className="flex-1 flex items-center justify-center space-x-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <MessageCircle className="h-5 w-5" /><span>Comment</span>
                </button>
              </div>

              {commentingPostId === post.id && (
                <div className="mt-4 space-y-4">
                    {post.comments.map(comment => {
                        const commentAuthor = alumniMap.get(comment.authorId);
                        return (
                             <div key={comment.id} className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                    {commentAuthor ? `${commentAuthor.firstName.charAt(0)}${commentAuthor.lastName.charAt(0)}` : 'A'}
                                </div>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                    <p className="font-semibold text-sm">{commentAuthor ? `${commentAuthor.firstName} ${commentAuthor.lastName}` : 'Anonymous'}</p>
                                    <p className="text-sm">{comment.content}</p>
                                </div>
                            </div>
                        )
                    })}
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:outline-none dark:bg-gray-700"
                            onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                        />
                        <button onClick={() => handleCommentSubmit(post.id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Community;
