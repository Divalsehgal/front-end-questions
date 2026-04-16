import React, { useRef, useState } from "react";
import POSTS from "./posts.json";
import { cn } from "../../utils/cn";
import { 
  MessageCircle, 
  Send, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  User as UserIcon,
  Reply as ReplyIcon,
  MoreHorizontal
} from "lucide-react";
import { Collapsible } from "@base-ui/react/collapsible";

type ReplyProps = {
  replyId: number;
  replyData: string;
  replyLikes: number;
  replyTimeStamp: string;
};

type CommentProps = {
  commentId: number;
  commentData: string;
  commentLikes: number;
  commentTimeStamp: string;
  replies: ReplyProps[];
};

type PostProps = {
  postLikes: number;
  postId: number;
  postTimeStamp: string;
  postData: { content: string };
  postComments: CommentProps[];
};

export const hint = "Nested comments and replies with expand/collapse logic";

export const formatTimestamp = (timestamp: string): string => {
  const currentDate = new Date().getTime();
  const postDate = new Date(timestamp).getTime();
  const diffInMinutes = Math.round((currentDate - postDate) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.round(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return new Date(postDate).toLocaleDateString();
};

export default function CommentReplyBox() {
  const [posts, setPosts] = useState<PostProps[]>(POSTS);
  const postRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmitPost = () => {
    if (!postRef.current?.value.trim()) return;
    
    const newPost: PostProps = {
      postId: Date.now(),
      postLikes: 0,
      postTimeStamp: new Date().toISOString(),
      postData: { content: postRef.current.value },
      postComments: [],
    };
    
    setPosts((prev) => [newPost, ...prev]);
    postRef.current.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 pb-20">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-brand-500" />
          Social Feed
        </h2>
        
        {/* Post Creation Area */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden p-4">
          <textarea
            ref={postRef}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none focus:ring-0 text-lg text-gray-900 dark:text-white placeholder:text-gray-400 resize-none min-h-[100px]"
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-surface-100 dark:border-surface-700">
            <div className="flex gap-2">
              <button className="p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleSubmitPost}
              className="flex items-center gap-2 px-6 py-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-500/20"
            >
              Post
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} setPosts={setPosts} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, setPosts }: { post: PostProps; setPosts: any }) {
  const [showComments, setShowComments] = useState(false);
  const commentRef = useRef<HTMLInputElement>(null);

  const handleAddComment = () => {
    if (!commentRef.current?.value.trim()) return;
    
    const newComment: CommentProps = {
      commentId: Date.now(),
      commentLikes: 0,
      commentTimeStamp: new Date().toISOString(),
      commentData: commentRef.current.value,
      replies: [],
    };

    setPosts((prev: PostProps[]) => prev.map(p => 
      p.postId === post.postId ? { ...p, postComments: [newComment, ...p.postComments] } : p
    ));
    commentRef.current.value = "";
    setShowComments(true);
  };

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white leading-tight">Anonymous User</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              {formatTimestamp(post.postTimeStamp)}
            </div>
          </div>
        </div>
        
        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{post.postData.content}</p>

        <div className="flex items-center gap-6 pt-2">
          <button className="flex items-center gap-2 text-surface-500 hover:text-red-500 transition-colors group">
            <Heart className="w-5 h-5 group-active:scale-125 transition-transform" />
            <span className="text-sm font-medium">{post.postLikes}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-surface-500 hover:text-brand-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.postComments.length} Comments</span>
          </button>
        </div>
      </div>

      <Collapsible.Root open={showComments} onOpenChange={setShowComments}>
        <Collapsible.Panel className="border-t border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/30 overflow-hidden transition-all duration-300 data-[state=closed]:h-0 data-[state=open]:h-auto">
          <div className="p-5 space-y-6">
            <div className="flex items-center gap-3">
              <input
                ref={commentRef}
                placeholder="Write a comment..."
                className="flex-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button onClick={handleAddComment} className="p-2 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg">
                <Send className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {post.postComments.map((comment) => (
                <CommentItem key={comment.commentId} comment={comment} postId={post.postId} setPosts={setPosts} />
              ))}
            </div>
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
}

function CommentItem({ comment, postId, setPosts }: { comment: CommentProps; postId: number; setPosts: any }) {
  const [showReplies, setShowReplies] = useState(false);
  const replyRef = useRef<HTMLInputElement>(null);

  const handleAddReply = () => {
    if (!replyRef.current?.value.trim()) return;

    const newReply: ReplyProps = {
      replyId: Date.now(),
      replyLikes: 0,
      replyTimeStamp: new Date().toISOString(),
      replyData: replyRef.current.value,
    };

    setPosts((prev: PostProps[]) => prev.map(p => 
      p.postId === postId ? {
        ...p,
        postComments: p.postComments.map(c => 
          c.commentId === comment.commentId ? { ...c, replies: [newReply, ...c.replies] } : c
        )
      } : p
    ));
    replyRef.current.value = "";
    setShowReplies(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3 px-1">
        <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center shrink-0">
          <UserIcon className="w-5 h-5 text-surface-500" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="bg-white dark:bg-surface-800 p-3 rounded-2xl border border-surface-200 dark:border-surface-700">
            <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Commenter</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{comment.commentData}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-surface-500 ml-2">
            <span>{formatTimestamp(comment.commentTimeStamp)}</span>
            <button className="hover:text-brand-500">Like</button>
            <button onClick={() => setShowReplies(!showReplies)} className="hover:text-brand-500">Reply</button>
          </div>
        </div>
      </div>

      <Collapsible.Root open={showReplies} onOpenChange={setShowReplies}>
        <Collapsible.Panel className="ml-11 border-l-2 border-surface-200 dark:border-surface-700 pl-4 space-y-4 overflow-hidden transition-all duration-300 data-[state=closed]:h-0 data-[state=open]:h-auto">
          <div className="flex items-center gap-2 pt-1 pb-2">
            <input
              ref={replyRef}
              placeholder="Write a reply..."
              className="flex-1 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-1.5 text-xs outline-none focus:border-brand-500 transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleAddReply()}
            />
            <button onClick={handleAddReply} className="p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg">
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {comment.replies.map((reply) => (
              <div key={reply.replyId} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4 text-surface-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="bg-white dark:bg-surface-800 p-2.5 rounded-xl border border-surface-200 dark:border-surface-700">
                    <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Replier</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">{reply.replyData}</p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-surface-500 ml-1">
                    <span>{formatTimestamp(reply.replyTimeStamp)}</span>
                    <button className="hover:text-brand-500">Like</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
}
