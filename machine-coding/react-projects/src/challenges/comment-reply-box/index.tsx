import { useRef, useState } from "react";
import POSTS from "./posts.json";
import { Send, Clock, User as UserIcon } from "lucide-react";
import { Collapsible } from "@base-ui/react/collapsible";
import { formatTimestamp } from "../../utils/formatTimeStamp";

type ReplyProps = {
  replyId: string;
  replyData: string;
  replyTimeStamp: string;
};

type CommentProps = {
  commentId: string;
  commentData: string;
  commentTimeStamp: string;
  replies: ReplyProps[];
};

type PostProps = {
  postId: string;
  postTimeStamp: string;
  postData: { content: string };
  postComments: CommentProps[];
};

export default function CommentReplyBox() {
  const [posts, setPosts] = useState<PostProps[]>(POSTS);
  const postRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmitPost = () => {
    if (!postRef.current?.value.trim()) return;

    const newPost: PostProps = {
      postId: crypto.randomUUID(),
      postTimeStamp: new Date().toISOString(),
      postData: { content: postRef.current.value },
      postComments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    postRef.current.value = "";
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 pb-20">
      <div className="space-y-4">
        {/* Post Creation Area */}
        <div className="border-subtle overflow-hidden rounded-2xl border bg-surface p-4 shadow-soft">
          <textarea
            ref={postRef}
            placeholder="What's on your mind?"
            className="min-h-[100px] w-full resize-none border-none bg-transparent text-lg text-text-main placeholder:text-text-muted focus:ring-0"
          />
          <div className="border-subtle mt-4 flex items-center justify-between border-t pt-4">
            <button
              onClick={handleSubmitPost}
              className="flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2 font-semibold text-text-inverted shadow-hard shadow-brand-500/20 transition-all hover:bg-brand-600 active:scale-95"
            >
              Post
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} setPosts={setPosts} />
        ))}
      </div>
    </div>
  );
}

function PostCard({
  post,
  setPosts,
}: Readonly<{ post: PostProps; setPosts: any }>) {
  const [showComments, setShowComments] = useState(false);
  const commentRef = useRef<HTMLInputElement>(null);

  const handleAddComment = () => {
    if (!commentRef.current?.value.trim()) return;

    const newComment: CommentProps = {
      commentId: crypto.randomUUID(),
      commentTimeStamp: new Date().toISOString(),
      commentData: commentRef.current.value,
      replies: [],
    };

    setPosts((prev: PostProps[]) =>
      prev.map((p) =>
        p.postId === post.postId
          ? { ...p, postComments: [newComment, ...p.postComments] }
          : p,
      ),
    );
    commentRef.current.value = "";
    setShowComments(true);
  };

  return (
    <div className="border-subtle animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-2xl border bg-surface shadow-soft duration-500">
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <Clock className="size-3" />
          {formatTimestamp(post.postTimeStamp)}
        </div>

        <p className="whitespace-pre-wrap text-text-main">
          {post.postData.content}
        </p>

        <div className="flex items-center gap-6 pt-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-text-muted transition-colors hover:text-brand-500"
          >
            <span className="text-sm font-medium">
              {post.postComments.length} Comments
            </span>
          </button>
        </div>
      </div>

      <Collapsible.Root open={showComments} onOpenChange={setShowComments}>
        <Collapsible.Panel className="border-subtle overflow-hidden border-t bg-muted transition-all duration-300 data-[state=closed]:h-0 data-[state=open]:h-auto">
          <div className="flex items-center gap-3 p-3">
            <input
              ref={commentRef}
              placeholder="Write a comment..."
              className="border-subtle flex-1 rounded-xl border bg-surface px-4 py-2 text-sm transition-all outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              className="rounded-lg p-2 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10"
            >
              <Send className="size-5" />
            </button>
          </div>

          <div className="space-y-6">
            {post.postComments.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                postId={post.postId}
                setPosts={setPosts}
              />
            ))}
          </div>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
}

function CommentItem({
  comment,
  postId,
  setPosts,
}: Readonly<{ comment: CommentProps; postId: string; setPosts: any }>) {
  const [showReplies, setShowReplies] = useState(false);
  const replyRef = useRef<HTMLInputElement>(null);

  const handleAddReply = () => {
    if (!replyRef.current?.value.trim()) return;

    const newReply: ReplyProps = {
      replyId: crypto.randomUUID(),
      replyTimeStamp: new Date().toISOString(),
      replyData: replyRef.current.value,
    };

    setPosts((prev: PostProps[]) =>
      prev.map((p) =>
        p.postId === postId
          ? {
              ...p,
              postComments: p.postComments.map((c) =>
                c.commentId === comment.commentId
                  ? { ...c, replies: [newReply, ...c.replies] }
                  : c,
              ),
            }
          : p,
      ),
    );
    replyRef.current.value = "";
    setShowReplies(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3 px-1">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <UserIcon className="size-5 text-text-muted" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="border-subtle rounded-2xl border bg-surface p-3">
            <p className="mb-1 text-sm font-bold text-text-main">Commenter</p>
            <p className="text-sm text-text-main/80">{comment.commentData}</p>
          </div>
          <div className="ml-2 flex items-center gap-4 text-xs font-semibold text-text-muted">
            <span>{formatTimestamp(comment.commentTimeStamp)}</span>
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="hover:text-brand-500"
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      <Collapsible.Root open={showReplies} onOpenChange={setShowReplies}>
        <Collapsible.Panel className="border-subtle ml-11 space-y-4 overflow-hidden border-l-2 pl-4 transition-all duration-300 data-[state=closed]:h-0 data-[state=open]:h-auto">
          <div className="flex items-center gap-2 pt-1 pb-2">
            <input
              ref={replyRef}
              placeholder="Write a reply..."
              className="border-subtle flex-1 rounded-xl border bg-surface px-4 py-1.5 text-xs transition-all outline-none focus:border-brand-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddReply()}
            />
            <button
              onClick={handleAddReply}
              className="rounded-lg p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10"
            >
              <Send className="size-4" />
            </button>
          </div>

          <div className="space-y-4">
            {comment.replies.map((reply) => (
              <div key={reply.replyId} className="flex gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted">
                  <UserIcon className="size-4 text-text-muted" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="border-subtle rounded-xl border bg-surface p-2.5">
                    <p className="mb-0.5 text-xs font-bold text-text-main">
                      Replier
                    </p>
                    <p className="text-xs text-text-muted">{reply.replyData}</p>
                  </div>
                  <div className="text-tiny ml-1 flex items-center gap-3 font-semibold text-text-muted">
                    <span>{formatTimestamp(reply.replyTimeStamp)}</span>
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
