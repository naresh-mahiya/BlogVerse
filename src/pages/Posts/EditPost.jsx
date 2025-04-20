import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../../components";
import { useNavigate, useParams } from "react-router-dom";
import postService from "../../appwrite/post";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null); // Manage post data with useState

  useEffect(() => {
    if (id) {
      // Fetch the post data
      const fetchPost = async () => {
        try {
          const fetchedPost = await postService.getPost(id);
          setPost(fetchedPost); // Update post state
        } catch (err) {
          console.error("Failed to fetch post:", err);
        } finally {
          setLoading(false); // Stop loading
        }
      };
      fetchPost();
    } else {
      setLoading(false);
      navigate("/");
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-400 text-lg">Loading post...</p>
      </div>
    );
  }

  return post ? (
    <div className="min-h-screen bg-gray-900 py-12">
      <Container>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-200 mb-6 text-center">
            Edit Post
          </h1>
          <PostForm post={post} />
        </div>
      </Container>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-gray-400 text-lg">Post not found.</p>
    </div>
  );
};

export default EditPost;
