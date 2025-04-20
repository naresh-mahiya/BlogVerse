import React from "react";
import { Container, PostForm } from "../../components";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = id
    ? useSelector((state) =>
        state.post.data.find((post) => post.$id === id)
      )
    : null;

  if (!id) {
    navigate("/");
    return null;
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
      <p className="text-gray-400 text-lg">Loading post...</p>
    </div>
  );
};

export default EditPost;
