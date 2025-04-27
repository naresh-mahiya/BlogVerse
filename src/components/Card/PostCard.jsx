import React, { useEffect, useState } from "react";
import fileService from "../../appwrite/file";
import likeService from "../../appwrite/like";
import commentService from "../../appwrite/comment";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const PostCard = ({ post }) => {
  const userId = useSelector((state) => state.auth.userData.$id);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    async function fetchLikeData() {
      const likes = await likeService.getLikes(post.$id);
      setLikeCount(likes.length);
      setIsLiked(likes.some(like => like.userId === userId));
    }
    async function fetchCommentData() {
      const comments = await commentService.getComments(post.$id);
      setCommentCount(comments.length);
      setComments(comments);
    }
    if (userId) fetchLikeData();
    fetchCommentData();
  }, [post.$id, userId]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) return;
    setLikeLoading(true);
    try {
      await likeService.likePost({ postId: post.$id, userId });
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComments((prev) => !prev);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      await commentService.addComment({ postId: post.$id, userId, content: commentText });
      setCommentText("");
      // Refresh comments
      const comments = await commentService.getComments(post.$id);
      setComments(comments);
      setCommentCount(comments.length);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="block rounded-xl transform transition hover:scale-105 hover:shadow-xl bg-gray-800 overflow-hidden shadow-md">
      <Link
        to={`/post/${post.$id}`}
        className="w-full"
        tabIndex={-1}
        aria-label={post.title}
      >
        <div className="w-full">
          <img
            className="w-full h-48 object-cover rounded-t-lg"
            src={fileService.getFilePreview(post.featuredImage)}
            alt={post.title}
          />
        </div>
        <div className="p-4 flex flex-col items-center justify-center min-h-[120px]">
          <h1
            className="text-lg font-semibold text-gray-100 line-clamp-3"
            title={post.title}
          >
            {post.title}
          </h1>
          <p className="mt-2 text-xs text-gray-400 italic">
            Posted by {post.userName || "Unknown"}
          </p>
        </div>
      </Link>
      {/* Like and Comment icons */}
      <div className="flex items-center justify-between px-4 pb-3">
        {/* Like */}
        <button
          className="flex items-center space-x-1 group"
          onClick={handleLike}
          disabled={likeLoading}
          aria-label="Like post"
          tabIndex={0}
        >
          {isLiked ? (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path></svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
          )}
          <span className="ml-1 text-xs text-gray-400">{likeCount}</span>
        </button>
        {/* Comment */}
        <button
          className="flex items-center space-x-1 group"
          onClick={handleCommentIconClick}
          aria-label="Show comments"
          tabIndex={0}
        >
          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="ml-1 text-xs text-gray-400">{commentCount}</span>
        </button>
      </div>
      {/* Comment Section */}
      {showComments && (
        <div className="px-4 pb-4">
          <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              className="flex-1 px-2 py-1 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none"
              placeholder="Add a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              disabled={commentLoading}
            />
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={commentLoading}
            >
              {commentLoading ? "Posting..." : "Post"}
            </button>
          </form>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {comments.length === 0 ? (
              <div className="text-xs text-gray-400">No comments yet.</div>
            ) : (
              comments.map((comment, idx) => (
                <div key={comment.$id || idx} className="bg-gray-700 rounded p-2 text-xs text-gray-100 mb-1">
                  <span className="font-semibold text-blue-300 mr-2">{comment.userName || "User"}:</span>
                  {comment.content}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
