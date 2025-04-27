import { Client, ID, Storage } from "appwrite";
import config from "../config/config";

export class FileService {
  client = new Client();
  storage;
  constructor() {
    if (
      !config.appwriteUrl ||
      !config.appwriteProjectId ||
      !config.appwriteBucketId
    ) {
      throw new Error("Appwrite configuration is incomplete.");
    }
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.storage = new Storage(this.client);
  }
  async uploadFile(file) {
    try {
      // Optional: Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed.");
      }
      
      return await this.storage.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
      
    } catch (error) {
      console.error(`Failed to upload file: ${error.message}`);
      throw new Error("File upload failed. Please try again.");
    }
  }

  async deleteFile(fileId) {
    try {
      await this.storage.deleteFile(config.appwriteBucketId, fileId);
      return { success: true, message: "File deleted successfully." };
    } catch (error) {
      console.error(`Failed to delete file: ${error.message}`);
      return {
        success: false,
        message: "File deletion failed. File may not exist.",
      };
    }
  }

  getFilePreview(fileId) {
    try {
      // const file= this.storage.getFilePreview(config.appwriteBucketId, fileId);
      const fileUrl = this.storage.getFileDownload(config.appwriteBucketId, fileId);
      return fileUrl;
    } catch (error) {
      console.error(`Failed to get file preview: ${error.message}`);
      throw new Error("File preview could not be retrieved.");
    }
  }
}

const fileService = new FileService();

export default fileService;
