import { Client, Databases, ID, Query } from "appwrite";
import config from "../config/config";

export class PostService {
  client = new Client();
  databases;
  constructor() {
    if (
      !config.appwriteUrl ||
      !config.appwriteProjectId ||
      !config.appwriteDatabaseId ||
      !config.appwritePostsCollectionId
    ) {
      throw new Error("Appwrite configuration is incomplete.");
    }
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId,userName }) {
    try {
      if (!title || !slug || !content) {
        throw new Error("Title, slug, and content are required.");
      }
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        ID.unique(),
        {
          title,
          slug,
          content,
          featuredImage,
          status,
          userId,
          userName
        }
      );
    } catch (error) {
      console.error(`Failed to create post: ${error.message}`);
      throw new Error("Unable to create the post. Please try again.");
    }
  }

  async updatePost(id, { title,slug, content, featuredImage, status }) {
    try {
      if (!id ||!slug|| !title || !content) {
        throw new Error("Document ID,title, and content are required.");
      }
      return await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        id,
        {
          title,
          slug,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.error(`Failed to update post: ${error.message}`);
      throw new Error("Unable to update the post. Please try again.");
    }
  }

  async deletePost(id) {
    try {
      if (!id) {
        throw new Error("Document ID is required to delete a post.");
      }
      await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        id
      );
      return { success: true, message: "Post deleted successfully." };
    } catch (error) {
      console.error(`Failed to delete post: ${error.message}`);
      return { success: false, message: "Post deletion failed." };
    }
  }

  async getPost(id) {
    try {
      if (!id) {
        throw new Error("Document ID is required to fetch a post.");
      }
      return await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        id
      );
    } catch (error) {
      console.error(`Failed to fetch post: ${error.message}`);
      return null;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwritePostsCollectionId,
        queries
      );
    } catch (error) {
      console.error(`Failed to fetch posts: ${error.message}`);
      throw new Error("Unable to fetch posts. Please try again.");
    }
  }
}

const postService = new PostService();

export default postService;
