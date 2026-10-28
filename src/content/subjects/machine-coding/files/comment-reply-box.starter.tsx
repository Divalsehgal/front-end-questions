import { useState } from 'react';

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

export default function CommentReplyBox() {
  // your code
  return <div className="p-6">Start building here</div>;
}
