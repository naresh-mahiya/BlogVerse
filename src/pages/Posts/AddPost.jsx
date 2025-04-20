import React from "react";
import { Container, PostForm } from "../../components";

const AddPost = () => {
  return (
    <div className="min-h-[300px] bg-gray-900 py-8">
      <Container>
        <div className="bg-gray-800 px-2 pt-8 pb-4 sm:py-8 sm:px-4 rounded-lg shadow-lg">
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
