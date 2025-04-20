import { Account, Client, ID } from "appwrite";
import config from "../config/config";
export class AuthService {
  client = new Client();
  account;
  constructor() {
    if (!config.appwriteUrl || !config.appwriteProjectId) {
      throw new Error("Appwrite configuration is missing");
    }
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
  }
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        // call another method
        return await this.login({ email, password });
      }
    } catch (error) {
      console.error(`Failed to create account: ${error.message}`);
      return null;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.account.get();
      if (!response) throw new Error();
      return response;
    } catch (error) {
      console.log(`Failed to fetch current user: ${error.message}`);
    }
    return null;
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }
}

const authService = new AuthService();

export default authService;
