import conf from "../conf/conf";
import { Client, Account, ID, Database , Storage , Query } from "appwrite";

export class Service {
  clint = new Client()
    databases;
    storage;
    constructor() {
      this.clint
        .setEndpoint(conf.appWriteUrl)
        .setProject(conf.appWriteProjectId);
      this.databases = new Database(this.clint);
      this.storage = new Storage(this.clint);
    }
    // create post
    async createPost(tite , slug , images , content,status , imageId) {
    {
      try {
        return await this.databases.createDocument(
          conf.appWriteDatabaseId,
          conf.appWriteCollectionId,
          ID.unique(),
            slug,
            {
                tite,
                images,
                content,
                status,
                imageId
            },
        );
      } catch (error) {
        console.error("Failed to create post:", error);
        throw error;
      }
    }

  }

  // get post
  async getPost() {
    try {
      return await this.databases.listDocuments(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
          [
            Query.orderDesc("$createdAt"),
            Query.equal("status", 1),
          ]
      );
    } catch (error) {
      console.error("Failed to get posts:", error);
      throw error;
    }
  }

  // get post by slug
  async getPostBySlug(slug) {
    try {
      return await this.databases.getDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug,
      );
    } catch (error) {
      console.error("Failed to get post:", error);
      throw error;
    }
  }
  // UPDATE POST
  async updatePost(slug ,{ title , content , images , status}) {
    try {
      return await this.databases.updateDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug,
        {
          title,
          content,
          images,
          status,
        },
      );
    } catch (error) {
      console.error("Failed to update post:", error);
      throw error;
    }
  }

  // File upload
  async uploadFile(file) {
    try {
      return await this.storage.createFile(
        conf.appWriteStorageBucket,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  }

  // DELETE File
  async deleteFile(fileId) {
    try {
      return await this.storage.deleteFile(
        conf.appWriteStorageBucket,
        fileId,
      );
    } catch (error) {
      console.error("Failed to delete file:", error);
      throw error;
    }
  }

  // get File
  async getFiles(fileId) {
    try {
      return this.storage.getFileView(
          conf.appWriteStorageBucket,
          fileId,
      );
    } catch (error) {
      console.error("Failed to get file:", error);
      throw error;
    }
  }
}




export  default new Service();
