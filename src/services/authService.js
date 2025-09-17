import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    // Validate configuration
    if (!conf.appwriteUrl || !conf.appwriteProjectId) {
      console.error('❌ Appwrite configuration missing:', {
        appwriteUrl: conf.appwriteUrl,
        appwriteProjectId: conf.appwriteProjectId
      });
      throw new Error('Appwrite configuration is incomplete. Please check your .env file.');
    }

    try {
      this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
      this.account = new Account(this.client);

      console.log('✅ AuthService initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize AuthService:', error);
      throw error;
    }
  }

  // Create account
  async createAccount(email, password, name) {
    try {
      const response = await this.account.create(ID.unique(), email, password, name);
      
      // Automatically log in after account creation
      if (response) {
        return await this.login(email, password);
      }
      return response;
    } catch (error) {
      console.error("Failed to create account:", error);
      throw error;
    }
  }

  // Login
  async login(email, password) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Failed to login:", error);

      // Handle specific error types
      if (error.code === 429) {
        throw new Error("Too many login attempts. Please wait a few minutes before trying again.");
      } else if (error.code === 401) {
        throw new Error("Invalid email or password. Please check your credentials.");
      } else if (error.code === 400) {
        throw new Error("Invalid request. Please check your email format.");
      }

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
      // First check if there's a valid session
      const hasSession = await this.hasValidSession();
      if (!hasSession) {
        return null;
      }
      
      // If there's a valid session, get user details
      return await this.account.get();
    } catch (error) {
      // Handle specific Appwrite errors
      if (error.code === 401 || error.message?.includes('missing scopes') || error.message?.includes('guests')) {
        // User is not authenticated or has guest role
        return null;
      }
      
      console.error("Failed to get current user:", error);
      return null;
    }
  }

  // Check if user is logged in
  async isLoggedIn() {
    try {
      return await this.hasValidSession();
    } catch (error) {
      return false;
    }
  }

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      return await this.account.updatePrefs(preferences);
    } catch (error) {
      console.error("Failed to update preferences:", error);
      throw error;
    }
  }

  // Get user preferences
  async getPreferences() {
    try {
      const user = await this.getCurrentUser();
      return user?.prefs || {};
    } catch (error) {
      // Don't log authentication-related errors as they're expected for non-logged-in users
      if (!error.message?.includes('missing scopes') && !error.message?.includes('guests')) {
        console.error("Failed to get preferences:", error);
      }
      return {};
    }
  }

  // Update user name
  async updateName(name) {
    try {
      return await this.account.updateName(name);
    } catch (error) {
      console.error("Failed to update name:", error);
      throw error;
    }
  }

  // Update user email
  async updateEmail(email, password) {
    try {
      return await this.account.updateEmail(email, password);
    } catch (error) {
      console.error("Failed to update email:", error);
      throw error;
    }
  }

  // Update user password
  async updatePassword(newPassword, oldPassword) {
    try {
      return await this.account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      console.error("Failed to update password:", error);
      throw error;
    }
  }

  // Create password recovery
  async createRecovery(email, url) {
    try {
      return await this.account.createRecovery(email, url);
    } catch (error) {
      console.error("Failed to create recovery:", error);
      throw error;
    }
  }

  // Complete password recovery
  async updateRecovery(userId, secret, password, passwordAgain) {
    try {
      return await this.account.updateRecovery(userId, secret, password, passwordAgain);
    } catch (error) {
      console.error("Failed to update recovery:", error);
      throw error;
    }
  }

  // Create email verification
  async createVerification(url) {
    try {
      return await this.account.createVerification(url);
    } catch (error) {
      console.error("Failed to create verification:", error);
      throw error;
    }
  }

  // Complete email verification
  async updateVerification(userId, secret) {
    try {
      return await this.account.updateVerification(userId, secret);
    } catch (error) {
      console.error("Failed to update verification:", error);
      throw error;
    }
  }

  // Get all sessions
  async getSessions() {
    try {
      return await this.account.listSessions();
    } catch (error) {
      // Don't log authentication-related errors as they're expected for non-logged-in users
      if (!error.message?.includes('missing scopes') && !error.message?.includes('guests')) {
        console.error("Failed to get sessions:", error);
      }
      throw error;
    }
  }

  // Validate current session (internal helper method)
  async hasValidSession() {
    try {
      const sessions = await this.account.listSessions();
      return sessions && sessions.total > 0;
    } catch (error) {
      // Guest users or unauthenticated users will get scope errors
      if (error.message?.includes('missing scopes') || error.message?.includes('guests')) {
        return false;
      }
      throw error;
    }
  }

  // Delete specific session
  async deleteSession(sessionId) {
    try {
      return await this.account.deleteSession(sessionId);
    } catch (error) {
      console.error("Failed to delete session:", error);
      throw error;
    }
  }

  // Delete all sessions
  async deleteAllSessions() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.error("Failed to delete all sessions:", error);
      throw error;
    }
  }

  // Check if user is admin (based on email or preferences)
  async isAdmin() {
    try {
      const user = await this.getCurrentUser();
      if (!user) return false;
      
      // Check if user email is admin email or has admin preference
      const adminEmails = ['admin@imteaj.dev', 'imteajsajid12@gmail.com']; // Add your admin emails
      return adminEmails.includes(user.email) || user.prefs?.isAdmin === true;
    } catch (error) {
      // Don't log authentication-related errors as they're expected for non-logged-in users
      if (!error.message?.includes('missing scopes') && !error.message?.includes('guests')) {
        console.error("Failed to check admin status:", error);
      }
      return false;
    }
  }

  // Set admin status (only for existing admins)
  async setAdminStatus(isAdmin) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) throw new Error("User not logged in");
      
      // Only allow existing admins to set admin status
      const currentIsAdmin = await this.isAdmin();
      if (!currentIsAdmin) throw new Error("Unauthorized: Only admins can set admin status");
      
      return await this.updatePreferences({ ...currentUser.prefs, isAdmin });
    } catch (error) {
      console.error("Failed to set admin status:", error);
      throw error;
    }
  }
}

export default new AuthService();
