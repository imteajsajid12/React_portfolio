import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";
export class AuthService {
  client = new Client();
  Account;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);
    this.Account = new Account(this.client);
  }

  //create account

  async createAccount(email, password, name) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await this.Account.create(ID.unique(), email, password, name);
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await this.Account.createEmailSession(email, password);
    } catch (error) {
      throw error;
    }
  }
  //logout
  async logout() {
       // eslint-disable-next-line no-useless-catch
    try {
      return await this.Account.deleteSession("current");
    } catch (error) {
        console.log(error);
      throw error;
    }
  }
  //currentUser
  async currentUser() {
       // eslint-disable-next-line no-useless-catch
    try {
      return await this.Account.get();
    } catch (error) {
        console.log(error)
      throw error;
    }
  }
}





export default AuthService;
