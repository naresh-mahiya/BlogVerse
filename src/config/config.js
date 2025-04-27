const config = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_DATABASE_ID),
  appwritePostsCollectionId: String(import.meta.env.VITE_POSTS_COLLECTION_ID),
  appwriteLikesCollectionId: String(import.meta.env.VITE_LIKES_COLLECTION_ID),
  appwriteCommentsCollectionId: String(import.meta.env.VITE_COMMENTS_COLLECTION_ID),
  appwriteBucketId: String(import.meta.env.VITE_BUCKET_ID),
  apiKey: String(import.meta.env.VITE_TINY_API_KEY),
  adminId: String(import.meta.env.VITE_ADMIN_ID),
};
export default config;

