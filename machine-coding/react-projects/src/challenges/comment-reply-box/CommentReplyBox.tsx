import React, { useRef, useState } from "react";
import "./index.css";
import POSTS from "./posts.json";
import Accordian from "./components/Accordian";
import { formatTimestamp } from "./helpers";
import { InputBox } from "./components/InputBox";

type PostData = {
  content: string;
};

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
  postData: PostData;
  postComments: CommentProps[];
};

export default function CommentReplyBox() {
  return <Post />;
}

const Post = () => {
  const [posts, setPosts] = useState<PostProps[]>(POSTS);
  const postRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = () => {
    let content;
    if (!postRef.current) {
      return;
    }
    content = postRef.current.value;

    const newPost: PostProps = {
      postLikes: 0,
      postId: Date.now(),
      postTimeStamp: new Date().toISOString(),
      postData: { content },
      postComments: [],
    };
    setPosts((prev) => [...prev, newPost]);
    if (postRef.current) {
      postRef.current.value = "";
    }
  };

  return (
    <div className="container">
      <div className="post-creation">
        <p>This is a facebook type post,comment,reply demo</p>
        <div className="input-box-container">
          <InputBox
            ref={postRef}
            placeholder={"start writing your posts here"}
          />
          <button onClick={handleSubmit}>submit</button>
        </div>
      </div>

      <div className="post-feed">
        {[...posts]
          .sort((a, b) => (b.postTimeStamp > a.postTimeStamp ? 1 : -1))
          .map((post) => {
            const { postData, postComments, postTimeStamp } = post;
            const { content } = postData;
            return (
              <React.Fragment key={post.postId}>
                <div className="post-container" data-postid={post.postId}>
                  <div className="post-content">{content}</div>

                  <Comments
                    postComments={postComments}
                    setPosts={setPosts}
                    postId={post.postId}
                  />
                  <span className="post-date">
                    {formatTimestamp(postTimeStamp)}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
      </div>
    </div>
  );
};

const Comments = ({
  postComments,
  setPosts,
  postId,
}: {
  postComments: CommentProps[];
  setPosts: React.Dispatch<React.SetStateAction<PostProps[]>>;
  postId: number;
}) => {
  const functionProps = {
    title: "see comments",
  };
  const commentRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    let content;
    if (!commentRef.current) {
      return;
    }
    content = commentRef.current.value;
    const newComment: CommentProps = {
      commentLikes: 0,
      commentId: Date.now(),
      commentTimeStamp: new Date().toISOString(),
      commentData: content,
      replies: [],
    };

    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.postId === postId) {
          return {
            ...post,
            postComments: [...post.postComments, newComment],
          };
        }
        return post;
      });
    });

    if (commentRef.current) {
      commentRef.current.value = "";
    }
  };

  return (
    <Accordian childrenProps={functionProps}>
      <div className="comments-container">
        {postComments.length > 0 ? (
          <>
            {postComments.map(
              ({ commentId, commentData, commentTimeStamp, replies }) => {
                return (
                  <React.Fragment key={commentId}>
                    <div className="comment-content">{commentData}</div>
                    <span className="comment-date">
                      {formatTimestamp(commentTimeStamp)}
                    </span>
                    <div className="reply-container">
                      <Reply
                        postId={postId}
                        replies={replies}
                        setPosts={setPosts}
                        commentId={commentId}
                      />
                    </div>
                  </React.Fragment>
                );
              }
            )}
          </>
        ) : (
          <></>
        )}
        <div>
          <InputBox ref={commentRef} placeholder={"start writing a comment"} />
          <button onClick={handleSubmit}>submit</button>
        </div>
      </div>
    </Accordian>
  );
};

const Reply = ({
  replies,
  setPosts,
  commentId,
  postId,
}: {
  replies: ReplyProps[];
  setPosts: React.Dispatch<React.SetStateAction<PostProps[]>>;
  commentId: number;
  postId: number;
}) => {
  const functionProps = {
    title: "see replies",
  };

  const replyRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    let content;
    if (!replyRef.current) {
      return;
    }
    content = replyRef.current.value;
    const newReply: ReplyProps = {
      replyLikes: 0,
      replyId: Date.now(),
      replyData: content,
      replyTimeStamp: new Date().toISOString(),
    };

    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.postId === postId) {
          return {
            ...post,
            postComments: post.postComments.map((comment) => {
              if (comment.commentId === commentId) {
                return {
                  ...comment,
                  replies: [...comment.replies, newReply],
                };
              }
              return comment;
            }),
          };
        }
        return post;
      });
    });

    if (replyRef.current) {
      replyRef.current.value = "";
    }
  };
  return (
    <Accordian childrenProps={functionProps}>
      {replies.length > 0 ? (
        <div className="replies-container">
          {replies.map(({ replyId, replyData, replyTimeStamp }) => {
            return (
              <React.Fragment key={replyId}>
                <div className="reply-content">{replyData}</div>
                <span className="reply-date">
                  {formatTimestamp(replyTimeStamp)}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <></>
      )}
      <div>
        <InputBox ref={replyRef} placeholder={"start writing a reply"} />
        <button onClick={handleSubmit}>submit</button>
      </div>
    </Accordian>
  );
};
