import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteEndpoint)
      .setProject(conf.appWriteProjectId);
    this.account = new Account(this.client);
  }

  // Create account
  async createAccount(email, password, name) {
    try {
      return await this.account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error("Failed to create account:", error);
      throw error;
    }
  }

  // Login
  async login(email, password) {
    try {
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      return await this.account.deleteSession("current");
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  // Check if user is logged in
  async isLoggedIn() {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}





export default AuthService;
