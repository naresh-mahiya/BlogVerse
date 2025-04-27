import { Client, Databases, ID, Query } from "appwrite";
import config from "../config/config";

class LikeService {
  constructor() {
    this.client = new Client();
    this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
  }

  async likePost({ postId, userId }) {
    try {
      const res= await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        ID.unique(),
        { postId, userId }
      );
      console.log(res);
      
    } catch (error) {
      throw new Error("Unable to like post.");
    }
  }

  async getLikes(postId) {
    try {
      const res = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        [Query.equal("postId", postId)]
      );
      return res.documents;
    } catch (error) {
      return [];
    }
  }

  async userLiked(postId, userId) {
    try {
      const res = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteLikesCollectionId,
        [Query.equal("postId", postId), Query.equal("userId", userId)]
      );
      return res.documents.length > 0 ? res.documents[0] : null;
    } catch (error) {
      return null;
    }
  }
}

const likeService = new LikeService();
export default likeService;
