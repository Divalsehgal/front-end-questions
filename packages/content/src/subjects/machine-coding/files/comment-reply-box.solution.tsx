import { useState, type Dispatch, type SetStateAction } from "react";
import { Send, Clock, User as UserIcon } from "lucide-react";

const formatTimestamp = (timestamp: string): string => {
  const diffInMinutes = Math.round((Date.now() - new Date(timestamp).getTime()) / (1000 * 60));
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.round(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return new Date(timestamp).toLocaleDateString();
};

type Reply = {
  replyId: string;
  replyData: string;
  replyTimeStamp: string;
};

type Comment = {
  commentId: string;
  commentData: string;
  commentTimeStamp: string;
  replies: Reply[];
};

type Post = {
  postId: string;
  postTimeStamp: string;
  postData: { content: string };
  postComments: Comment[];
};

type SetPosts = Dispatch<SetStateAction<Post[]>>;

const POSTS: Post[] = [
  {
    postId: "1",
    postData: {
      content: "Just had a great cup of coffee at my favourite cafe.",
    },
    postTimeStamp: "2024-02-09T09:00:00Z",
    postComments: [
      {
        commentId: "1",
        commentData: "I love that cafe too.",
        commentTimeStamp: "2024-02-09T09:05:00Z",
        replies: [
          {
            replyId: "1",
            replyData: "Best one in the neighbourhood.",
            replyTimeStamp: "2024-02-09T09:10:00Z",
          },
        ],
      },
      {
        commentId: "2",
        commentData: "I'm more of a tea person, but that sounds nice.",
        commentTimeStamp: "2024-02-09T09:08:00Z",
        replies: [],
      },
    ],
  },
  {
    postId: "2",
    postData: {
      content: "Just finished reading a really good book. Recommendations welcome.",
    },
    postTimeStamp: "2024-02-09T10:00:00Z",
    postComments: [
      {
        commentId: "1",
        commentData: "Which book was it?",
        commentTimeStamp: "2024-02-09T10:05:00Z",
        replies: [
          {
            replyId: "1",
            replyData: "'The Alchemist' by Paulo Coelho.",
            replyTimeStamp: "2024-02-09T10:10:00Z",
          },
        ],
      },
    ],
  },
];

/** Input + send button; calls onSubmit with trimmed text and ignores empty input. */
function Composer({
  placeholder,
  onSubmit,
  multiline = false,
  label,
}: Readonly<{
  placeholder: string;
  onSubmit: (text: string) => void;
  multiline?: boolean;
  label: string;
}>) {
  const [text, setText] = useState("");

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    onSubmit(value);
    setText("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-end gap-2"
    >
      {multiline ? (
        <textarea
          aria-label={label}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="min-h-[80px] flex-1 resize-none rounded-xl border border-border-subtle bg-surface p-3 text-text-main outline-none placeholder:text-text-muted focus:border-brand-500"
        />
      ) : (
        <input
          aria-label={label}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      )}
      <button
        type="submit"
        disabled={!text.trim()}
        className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-text-inverted hover:bg-brand-600 disabled:opacity-40"
      >
        {multiline ? "Post" : <span className="sr-only">Send</span>}
        <Send className="size-4" aria-hidden />
      </button>
    </form>
  );
}

export default function CommentReplyBox() {
  const [posts, setPosts] = useState<Post[]>(POSTS);

  const addPost = (content: string) => {
    const newPost: Post = {
      postId: crypto.randomUUID(),
      postTimeStamp: new Date().toISOString(),
      postData: { content },
      postComments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft">
        <Composer multiline label="New post" placeholder="What's on your mind?" onSubmit={addPost} />
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} setPosts={setPosts} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, setPosts }: Readonly<{ post: Post; setPosts: SetPosts }>) {
  const [showComments, setShowComments] = useState(false);
  const panelId = `comments-${post.postId}`;

  const addComment = (commentData: string) => {
    const newComment: Comment = {
      commentId: crypto.randomUUID(),
      commentTimeStamp: new Date().toISOString(),
      commentData,
      replies: [],
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.postId === post.postId ? { ...p, postComments: [newComment, ...p.postComments] } : p,
      ),
    );
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-soft">
      <div className="space-y-3 p-5">
        <p className="flex items-center gap-2 text-xs text-text-muted">
          <Clock className="size-3" aria-hidden />
          <time dateTime={post.postTimeStamp}>{formatTimestamp(post.postTimeStamp)}</time>
        </p>
        <p className="whitespace-pre-wrap text-text-main">{post.postData.content}</p>
        <button
          onClick={() => setShowComments((s) => !s)}
          aria-expanded={showComments}
          aria-controls={panelId}
          className="text-sm font-medium text-text-muted hover:text-brand-500"
        >
          {post.postComments.length} {post.postComments.length === 1 ? "comment" : "comments"}
        </button>
      </div>

      {showComments && (
        <div id={panelId} className="space-y-4 border-t border-border-subtle bg-muted p-4">
          <Composer label="Write a comment" placeholder="Write a comment…" onSubmit={addComment} />
          {post.postComments.map((comment) => (
            <CommentItem key={comment.commentId} comment={comment} postId={post.postId} setPosts={setPosts} />
          ))}
        </div>
      )}
    </article>
  );
}

function CommentItem({
  comment,
  postId,
  setPosts,
}: Readonly<{ comment: Comment; postId: string; setPosts: SetPosts }>) {
  const [showReplies, setShowReplies] = useState(false);
  const panelId = `replies-${postId}-${comment.commentId}`;

  const addReply = (replyData: string) => {
    const newReply: Reply = {
      replyId: crypto.randomUUID(),
      replyTimeStamp: new Date().toISOString(),
      replyData,
    };
    // Nested immutable update: new posts array → new post → new comments array → new comment.
    setPosts((prev) =>
      prev.map((p) =>
        p.postId === postId
          ? {
              ...p,
              postComments: p.postComments.map((c) =>
                c.commentId === comment.commentId ? { ...c, replies: [newReply, ...c.replies] } : c,
              ),
            }
          : p,
      ),
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface">
          <UserIcon className="size-5 text-text-muted" aria-hidden />
        </div>
        <div className="flex-1 space-y-1">
          <div className="rounded-2xl border border-border-subtle bg-surface p-3">
            <p className="text-sm text-text-main">{comment.commentData}</p>
          </div>
          <div className="ml-2 flex items-center gap-4 text-xs font-semibold text-text-muted">
            <time dateTime={comment.commentTimeStamp}>{formatTimestamp(comment.commentTimeStamp)}</time>
            <button
              onClick={() => setShowReplies((s) => !s)}
              aria-expanded={showReplies}
              aria-controls={panelId}
              className="hover:text-brand-500"
            >
              {showReplies ? "Hide replies" : `Reply${comment.replies.length ? ` (${comment.replies.length})` : ""}`}
            </button>
          </div>
        </div>
      </div>

      {showReplies && (
        <div id={panelId} className="ml-11 space-y-3 border-l-2 border-border-subtle pl-4">
          <Composer label="Write a reply" placeholder="Write a reply…" onSubmit={addReply} />
          {comment.replies.map((reply) => (
            <div key={reply.replyId} className="rounded-xl border border-border-subtle bg-surface p-2.5">
              <p className="text-xs text-text-main">{reply.replyData}</p>
              <time dateTime={reply.replyTimeStamp} className="mt-1 block text-[11px] text-text-muted">
                {formatTimestamp(reply.replyTimeStamp)}
              </time>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
