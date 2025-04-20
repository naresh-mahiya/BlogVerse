import React from "react";
import fileService from "../../appwrite/file";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <Link
      to={`/post/${post.$id}`}
      className="block  rounded-xl transform transition hover:scale-105 hover:shadow-xl"
    >
      <div className="w-full bg-gray-800 rounded-xl overflow-hidden shadow-md">
        <div className="w-full">
          <img
            className="w-full h-48 object-cover rounded-t-lg"
            src={fileService.getFilePreview(post.featuredImage)}
            alt={post.title}
          />
        </div>
        <div className="p-4 flex items-center justify-center min-h-[120px]">
          <h1
            className="text-lg font-semibold text-gray-100 line-clamp-3"
            title={post.title}
          >
            {post.title}
          </h1>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
