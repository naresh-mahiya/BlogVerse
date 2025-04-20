import React, { useEffect, useState } from "react";
import config from "../../config/config";
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

  const isAuthor =
    (post && userData ? post.userId === userData.userId : false) ||
    userData.userId === config.adminId;

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
      </Container>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-gray-400 text-lg">Post not found.</p>
    </div>
  );
}
