import { Client, Databases, ID, Query } from "appwrite";
import config from "../config/config";

class CommentService {
  constructor() {
    this.client = new Client();
    this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
  }

  async addComment({ postId, userId, userName, content }) {
    try {
      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCommentsCollectionId,
        ID.unique(),
        { postId, userId, userName, content }
      );
    } catch (error) {
      throw new Error("Unable to add comment.");
    }
  }

  async getComments(postId) {
    try {
      const res = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCommentsCollectionId,
        [Query.equal("postId", postId)]
      );
      return res.documents;
    } catch (error) {
      return [];
    }
  }
}

const commentService = new CommentService();
export default commentService;
