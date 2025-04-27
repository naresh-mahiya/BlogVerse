import { Client, Users } from 'appwrite';
import config from '../config/config';

class UserService {
  constructor() {
    this.client = new Client();
    this.client.setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);
    this.users = new Users(this.client);
  }

  async getUser(userId) {
    try {
      return await this.users.get(userId);
    } catch (error) {
      console.error('Failed to fetch user:', error.message);
      return null;
    }
  }
}

const userService = new UserService();
export default userService;
