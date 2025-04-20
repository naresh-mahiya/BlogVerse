import React, { useEffect } from "react";
import { Button, Container, PostCard } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../../store/slices/postSlice";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Home = () => {
  const user = useSelector((state) => state.auth.status);
  const posts = useSelector((state) => state.post.data);
  const loading = useSelector((state) => state.post.loading);
  const error = useSelector((state) => state.post.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) dispatch(getAllPosts());
  }, [dispatch, user]);

  // Handle unauthenticated state
  if (!user) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gray-900 px-4">
        <Container>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-200">
            Please login to read blogs!
          </h1>
          <div className="w-full flex justify-center m-4">
            <Button onClick={() => navigate("/login")}> Login </Button>
          </div>
        </Container>
      </div>
    );
  }

  // Render Skeletons during loading
  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="w-full border border-gray-700 bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg"
      >
        <div className="w-full mb-2 p-4">
          <Skeleton
            height={192}
            baseColor="#374151"
            highlightColor="#4b5563"
            className="w-full rounded-t-lg"
          />
        </div>
        <div className="p-4">
          <Skeleton height={24} baseColor="#374151" highlightColor="#4b5563" />
        </div>
      </div>
    ));
  };

  // Handle error state
  if (error) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gray-900 px-4">
        <Container>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-red-500">
            Failed to load posts. Please try again later.
          </h1>
        </Container>
      </div>
    );
  }

  // Handle empty posts state
  if (!loading && posts.length === 0) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gray-900 px-4">
        <Container>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-200">
            No posts available!
          </h1>
          <div className="text-center mt-4">
            <Button
              onClick={() => navigate("/add-post")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
            >
              Add Post
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  // Render posts or skeletons
  return (
    <div className="min-h-[600px] bg-gray-900 py-8 px-4">
      <Container>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-200 text-center mb-6">
          {loading ? (
            <Skeleton
              width="50%"
              baseColor="#374151"
              highlightColor="#4b5563"
            />
          ) : (
            "Recent Posts"
          )}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? renderSkeletons()
            : posts.map((post) => <PostCard key={post.$id} post={post} />)}
        </div>
      </Container>
    </div>
  );
};

export default Home;
