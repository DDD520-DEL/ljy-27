import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Reply, User } from 'lucide-react';
import { useBenchStore } from '../../store/useBenchStore';
import type { Comment, Reply as ReplyType } from '../../types/bench';

interface CommentSectionProps {
  benchId: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString('zh-CN');
}

interface CommentItemProps {
  comment: Comment;
  benchId: string;
  onReply: (commentId: string, author: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, benchId, onReply }) => {
  const { deleteComment, deleteReply } = useBenchStore();
  const [showReplies, setShowReplies] = useState(true);

  const handleDeleteComment = () => {
    if (window.confirm('确定要删除这条评论吗？')) {
      deleteComment(comment.id, benchId);
    }
  };

  const handleDeleteReply = (replyId: string) => {
    if (window.confirm('确定要删除这条回复吗？')) {
      deleteReply(comment.id, replyId, benchId);
    }
  };

  const activeReplies = comment.replies.filter((r) => !r.isDeleted);

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3 transition-colors duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
          <User size={18} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">{comment.author}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onReply(comment.id, comment.author)}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                title="回复"
              >
                <Reply size={14} />
              </button>
              <button
                onClick={handleDeleteComment}
                className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="删除"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 leading-relaxed">{comment.content}</p>
        </div>
      </div>

      {activeReplies.length > 0 && (
        <div className="ml-12 space-y-3">
          {showReplies && (
            <>
              {activeReplies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  onDelete={() => handleDeleteReply(reply.id)}
                  onReply={() => onReply(comment.id, reply.author)}
                />
              ))}
            </>
          )}
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
          >
            {showReplies ? '收起回复' : `展开 ${activeReplies.length} 条回复`}
          </button>
        </div>
      )}
    </div>
  );
};

interface ReplyItemProps {
  reply: ReplyType;
  onDelete: () => void;
  onReply: () => void;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, onDelete, onReply }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
          <User size={14} className="text-teal-600 dark:text-teal-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">{reply.author}</span>
              {reply.replyTo && (
                <>
                  <span className="text-gray-400 dark:text-gray-500 text-xs">回复</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">{reply.replyTo}</span>
                </>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(reply.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onReply}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded transition-colors"
                title="回复"
              >
                <Reply size={12} />
              </button>
              <button
                onClick={onDelete}
                className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                title="删除"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-1 leading-relaxed">{reply.content}</p>
        </div>
      </div>
    </div>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({ benchId }) => {
  const { comments, getCommentsByBenchId, addComment, addReply, initComments } = useBenchStore();
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [replyTo, setReplyTo] = useState<{ commentId: string; author: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    if (comments.length === 0) {
      initComments();
    }
  }, [comments.length, initComments]);

  const benchComments = getCommentsByBenchId(benchId);
  const totalCount = benchComments.reduce((acc, comment) => {
    return acc + 1 + comment.replies.filter((r) => !r.isDeleted).length;
  }, 0);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    addComment({
      benchId,
      content: newComment.trim(),
      author: authorName.trim(),
    });
    setNewComment('');
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !authorName.trim() || !replyTo) return;

    addReply({
      commentId: replyTo.commentId,
      benchId,
      content: replyContent.trim(),
      author: authorName.trim(),
      replyTo: replyTo.author,
    });
    setReplyContent('');
    setReplyTo(null);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyContent('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={18} className="text-emerald-600 dark:text-emerald-500" />
        <h3 className="font-bold text-gray-800 dark:text-gray-100">评论区</h3>
        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
          {totalCount}
        </span>
      </div>

      <form onSubmit={handleSubmitComment} className="mb-5">
        <div className="space-y-3">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="您的昵称"
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-emerald-300 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="分享您对这个长椅的看法..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-emerald-300 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all text-sm resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() || !authorName.trim()}
            className="w-full py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-700 dark:hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            发表评论
          </button>
        </div>
      </form>

      {replyTo && (
        <form onSubmit={handleSubmitReply} className="mb-5 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl transition-colors duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              回复 @{replyTo.author}
            </span>
            <button
              type="button"
              onClick={handleCancelReply}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              取消
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="您的昵称"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-500 outline-none transition-all text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`回复 @${replyTo.author}...`}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-emerald-200 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-500 outline-none transition-all text-sm resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!replyContent.trim() || !authorName.trim()}
              className="w-full py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-700 dark:hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              发送回复
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {benchComments.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <MessageSquare size={28} className="text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">暂无评论</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">快来发表第一条评论吧！</p>
          </div>
        ) : (
          benchComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              benchId={benchId}
              onReply={(commentId, author) => {
                setReplyTo({ commentId, author });
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};
