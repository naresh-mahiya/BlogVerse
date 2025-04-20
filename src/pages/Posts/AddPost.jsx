import React from "react";
import { Container, PostForm } from "../../components";

const AddPost = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <Container>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-200 mb-6 text-center">
            Create a New Post
          </h1>
          <PostForm />
        </div>
      </Container>
    </div>
  );
};

export default AddPost;
