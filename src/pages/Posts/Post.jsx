import React, { useEffect, useState } from "react";
import config from "../../config/config";
import { Link, useNavigate, useParams } from "react-router-dom";
import fileService from "../../appwrite/file";
import likeService from "../../appwrite/like";
import commentService from "../../appwrite/comment";

import { Button, Container } from "../../components";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../../store/slices/postSlice";
import postService from "../../appwrite/post";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (id) {
          const fetchedPost = await postService.getPost(id);
          setPost(fetchedPost);
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to fetch the post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!post) return;
    async function fetchLikeData() {
      const likes = await likeService.getLikes(post.$id);
      setLikeCount(likes.length);
      setIsLiked(likes.some(like => like.userId === userData.$id));
    }
    async function fetchComments() {
      const comments = await commentService.getComments(post.$id);
      setComments(comments.sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt)));
    }
    if (userData?.$id) fetchLikeData();
    fetchComments();
  }, [post, userData]);

  const handleLike = async () => {
    if (isLiked || !userData?.$id) return;
    setLikeLoading(true); 
    try {
      await likeService.likePost({ postId: post.$id, userId: userData.$id });
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    try {
      await commentService.addComment({
        postId: post.$id,
        userId: userData.$id,
        userName: userData.name,
        content: commentInput.trim(),
      });
      setCommentInput("");
      // Refresh comments
      const comments = await commentService.getComments(post.$id);
      setComments(comments.sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt)));
    } finally {
      setCommentLoading(false);
    }
  };


  const isAuthor =
    (post && userData ? post.userId === userData.$id : false) ||
    userData.$id === config.adminId;

  const deleteHandler = async () => {
    try {
      const status = await dispatch(deletePost(post.$id));
      if (status.meta.requestStatus === "fulfilled") {
        await fileService.deleteFile(post.featuredImage);
        navigate("/my-posts");
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 px-4">
        <Container>
          {/* Responsive Skeleton Image */}
          <div className="w-full mb-16 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
            <Skeleton
              baseColor="#374151"
              highlightColor="#4b5563"
              className="w-full h-full rounded-lg"
            />
          </div>

          {/* Responsive Skeleton Title */}

          <div className="w-full my-4 mb-12 px-6 md:px-10 h-[90px]  md:h-[40px] ">
            <Skeleton
              count={1}
              baseColor="#374151"
              highlightColor="#4b5563"
              className="mx-auto h-full mb-4"
            />
          </div>

          {/* Responsive Skeleton Content */}
          <Skeleton
            count={20}
            height={20}
            baseColor="#374151"
            highlightColor="#4b5563"
            className="mb-2"
          />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return post ? (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <Container>
        <div className="mb-8 relative">
          {/* Responsive Image Container */}
          <div className="w-full h-[300px] sm:h-[400px] md:h-[600px] relative rounded-lg overflow-hidden">
            {!imageLoaded && (
              <Skeleton
                height="100%"
                baseColor="#374151"
                highlightColor="#4b5563"
                className="absolute top-0 left-0 w-full h-full"
              />
            )}
            <img
              src={fileService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-md transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {isAuthor && (
            <div className="flex justify-end mt-4 space-x-2 sm:space-x-4">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" hoverColor="hover:bg-green-600">
                  Edit
                </Button>
              </Link>
              <Button
                bgColor="bg-red-500"
                hoverColor="hover:bg-red-600"
                onClick={deleteHandler}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Author and Time */}
        <div className="text-center mb-2">
          <span className="text-xs text-gray-400 italic">
            Posted by {post.userName || "Unknown"}
          </span>
          {post.$createdAt && (
            <span className="text-xs text-gray-400 italic ml-2">
              | Posted at {new Date(post.$createdAt).toLocaleString()}
            </span>
          )}
        </div>

        {/* Like and Comment icons */}
        <div className="flex items-center justify-center gap-6 mb-4">
          <button
            className="flex items-center space-x-1 group"
            onClick={handleLike}
            disabled={likeLoading || isLiked}
            aria-label="Like post"
          >
            {isLiked ? (
              <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path></svg>
            ) : (
              <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
            )}
            <span className="ml-1 text-sm text-gray-400">{likeCount}</span>
          </button>
          <div className="flex items-center space-x-1">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="ml-1 text-sm text-gray-400">{comments.length}</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-200 mb-4">
            {post.title}
          </h1>
        </div>

        <div className="browser-css prose prose-lg max-w-none   text-justify md:text-left">
          {parse(post.content, {
            replace: (domNode) => {
              if (domNode.type === "tag" && domNode.name === "figure") {
                domNode.attribs.style = "text-align: center; margin: 24px 0;";
              }
              if (domNode.type === "tag" && domNode.name === "p") {
                domNode.attribs.style = "margin: 16px 0; line-height: 1.8;";
              }
              if (domNode.type === "tag" && domNode.name === "p") {
                domNode.attribs.style = "margin: 16px 0; line-height: 1.8;";
              }
              if (domNode.type === "tag" && domNode.name === "strong") {
                domNode.attribs.style = "color:#2dd4bf   ;";
              }
              if (domNode.type === "tag" && domNode.name === "img") {
                domNode.attribs.style =
                  "display: block; margin: 16px auto; max-width: 100%; height: auto;";
              }
              return domNode;
            },
          })}
        </div>
        {/* Comment Section */}
        <div className="max-w-2xl mx-auto mt-10 bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-100">Comments</h2>
          {userData?.$id && (
            <form onSubmit={handleCommentSubmit} className="flex items-center mb-6">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 rounded-l bg-gray-700 text-gray-100 border-none outline-none"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                disabled={commentLoading}
              />
              <button
                type="submit"
                disabled={commentLoading || !commentInput.trim()}
                className="px-4 py-2 rounded-r bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-500"
              >
                {commentLoading ? "Posting..." : "Post"}
              </button>
            </form>
          )}
          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-gray-400 italic">No comments yet.</p>
            )}
            {comments.map(comment => (
              <div key={comment.$id} className="bg-gray-900 rounded p-3">
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-teal-400 mr-2">{comment.userName || "User"}</span>
                  <span className="text-xs text-gray-500">{new Date(comment.$createdAt).toLocaleString()}</span>
                </div>
                <div className="text-gray-200">{comment.content}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-gray-400 text-lg">Post not found.</p>
    </div>
  );
}
