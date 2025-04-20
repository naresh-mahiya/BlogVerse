import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import fileService from "../../appwrite/file";
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

  const isAuthor = post && userData ? post.userId === userData.userId : false;

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
      <div className="min-h-screen bg-gray-900 py-12">
        <Container>
          <Skeleton
            height={600}
            baseColor="#374151"
            highlightColor="#4b5563"
            className="w-full rounded-lg mb-6"
          />
          <Skeleton
            width="60%"
            height={36}
            baseColor="#374151"
            highlightColor="#4b5563"
            className="mx-auto"
          />
          <Skeleton
            height={24}
            count={6}
            baseColor="#374151"
            highlightColor="#4b5563"
            className="mt-6"
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
    <div className="min-h-screen bg-gray-900 py-12">
      <Container>
        <div className="mb-8 relative">
          {/* Container to maintain consistent height */}
          <div className="w-full h-[600px] relative rounded-lg overflow-hidden">
            {!imageLoaded && (
              <Skeleton
                height={600}
                baseColor="#374151"
                highlightColor="#4b5563"
                className="absolute top-0 left-0 w-full h-full"
              />
            )}
            <img
              src={fileService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className={`absolute top-0 left-0 w-full h-full object-contain rounded-lg shadow-md transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {isAuthor && (
            <div className="flex justify-end mt-4 space-x-4">
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

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-200 mb-4">
            {post.title}
          </h1>
        </div>

        <div className="prose prose-lg max-w-none text-gray-300">
          {parse(post.content)}
        </div>
      </Container>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-gray-400 text-lg">Post not found.</p>
    </div>
  );
}
