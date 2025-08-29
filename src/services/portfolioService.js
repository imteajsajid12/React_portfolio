import conf from "../conf/conf";
import { Client, Databases, Storage, Query, ID } from "appwrite";

export class PortfolioService {
  client = new Client();
  databases;
  storage;

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
      this.databases = new Databases(this.client);
      this.storage = new Storage(this.client);

      console.log('✅ PortfolioService initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize PortfolioService:', error);
      throw error;
    }
  }

  // ==================== PROJECTS MANAGEMENT ====================
  
  async createProject(projectData) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionProjects,
        ID.unique(),
        {
          title: projectData.title,
          description: projectData.description,
          technologies: projectData.technologies, // Array of strings
          image: projectData.image, // File ID from storage
          demoUrl: projectData.demoUrl,
          githubUrl: projectData.githubUrl,
          featured: projectData.featured || false,
          status: projectData.status || "active",
          order: projectData.order || 0
        }
      );
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  }

  async getProjects(featured = null) {
    try {
      const queries = [Query.orderAsc("order")];
      if (featured !== null) {
        queries.push(Query.equal("featured", featured));
      }
      // Only filter by status if it's not null/undefined
      queries.push(Query.notEqual("status", "deleted"));

      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionProjects,
        queries
      );
    } catch (error) {
      console.error("Failed to get projects:", error);
      throw error;
    }
  }

  async getProject(projectId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionProjects,
        projectId
      );
    } catch (error) {
      console.error("Failed to get project:", error);
      throw error;
    }
  }

  async updateProject(projectId, projectData) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionProjects,
        projectId,
        projectData
      );
    } catch (error) {
      console.error("Failed to update project:", error);
      throw error;
    }
  }

  async deleteProject(projectId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionProjects,
        projectId
      );
    } catch (error) {
      console.error("Failed to delete project:", error);
      throw error;
    }
  }

  // ==================== SKILLS MANAGEMENT ====================
  
  async createSkill(skillData) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionSkills,
        ID.unique(),
        {
          name: skillData.name,
          category: skillData.category, // frontend, backend, database, devops, design, etc.
          proficiency: skillData.proficiency, // 1-100
          icon: skillData.icon, // Icon name or file ID
          color: skillData.color, // Hex color code
          order: skillData.order || 0,
          status: skillData.status || "active"
        }
      );
    } catch (error) {
      console.error("Failed to create skill:", error);
      throw error;
    }
  }

  async getSkills(category = null) {
    try {
      const queries = [Query.orderAsc("order")];
      if (category) {
        queries.push(Query.equal("category", category));
      }
      queries.push(Query.equal("status", "active"));

      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionSkills,
        queries
      );
    } catch (error) {
      console.error("Failed to get skills:", error);
      throw error;
    }
  }

  async updateSkill(skillId, skillData) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionSkills,
        skillId,
        skillData
      );
    } catch (error) {
      console.error("Failed to update skill:", error);
      throw error;
    }
  }

  async deleteSkill(skillId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionSkills,
        skillId
      );
    } catch (error) {
      console.error("Failed to delete skill:", error);
      throw error;
    }
  }

  // ==================== EXPERIENCE MANAGEMENT ====================
  
  async createExperience(experienceData) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionExperience,
        ID.unique(),
        {
          company: experienceData.company,
          position: experienceData.position,
          startDate: experienceData.startDate,
          endDate: experienceData.endDate,
          current: experienceData.current || false,
          description: experienceData.description, // Array of strings
          technologies: experienceData.technologies, // Array of strings
          location: experienceData.location,
          companyLogo: experienceData.companyLogo, // File ID
          order: experienceData.order || 0,
          status: experienceData.status || "active"
        }
      );
    } catch (error) {
      console.error("Failed to create experience:", error);
      throw error;
    }
  }

  async getExperiences() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionExperience,
        [
          Query.orderDesc("startDate"),
          Query.equal("status", "active")
        ]
      );
    } catch (error) {
      console.error("Failed to get experiences:", error);
      throw error;
    }
  }

  async updateExperience(experienceId, experienceData) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionExperience,
        experienceId,
        experienceData
      );
    } catch (error) {
      console.error("Failed to update experience:", error);
      throw error;
    }
  }

  async deleteExperience(experienceId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionExperience,
        experienceId
      );
    } catch (error) {
      console.error("Failed to delete experience:", error);
      throw error;
    }
  }

  // ==================== ABOUT INFORMATION MANAGEMENT ====================
  
  async createAbout(aboutData) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionAbout,
        ID.unique(),
        {
          name: aboutData.name,
          title: aboutData.title,
          bio: aboutData.bio,
          profileImage: aboutData.profileImage, // File ID
          resume: aboutData.resume, // File ID
          location: aboutData.location,
          email: aboutData.email,
          phone: aboutData.phone,
          website: aboutData.website,
          socialLinks: aboutData.socialLinks, // Object with github, linkedin, twitter, etc.
          status: "active"
        }
      );
    } catch (error) {
      console.error("Failed to create about info:", error);
      throw error;
    }
  }

  async getAbout() {
    try {
      const result = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionAbout,
        [Query.equal("status", "active")]
      );
      return result.documents[0] || null;
    } catch (error) {
      console.error("Failed to get about info:", error);
      throw error;
    }
  }

  async updateAbout(aboutId, aboutData) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionAbout,
        aboutId,
        aboutData
      );
    } catch (error) {
      console.error("Failed to update about info:", error);
      throw error;
    }
  }

  // ==================== CONTACT INFORMATION MANAGEMENT ====================
  
  async createContact(contactData) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionContact,
        ID.unique(),
        {
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
          status: "unread",
          createdAt: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error("Failed to create contact message:", error);
      throw error;
    }
  }

  async getContacts() {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionContact,
        [Query.orderDesc("$createdAt")]
      );
    } catch (error) {
      console.error("Failed to get contact messages:", error);
      throw error;
    }
  }

  async updateContactStatus(contactId, status) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionContact,
        contactId,
        { status }
      );
    } catch (error) {
      console.error("Failed to update contact status:", error);
      throw error;
    }
  }

  // ==================== FILE MANAGEMENT ====================

  async uploadFile(file) {
    try {
      return await this.storage.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error("Failed to upload file:", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.storage.deleteFile(
        conf.appwriteBucketId,
        fileId
      );
    } catch (error) {
      console.error("Failed to delete file:", error);
      throw error;
    }
  }

  getFilePreview(fileId, width = 400, height = 400) {
    try {
      return this.storage.getFilePreview(
        conf.appwriteBucketId,
        fileId,
        width,
        height
      );
    } catch (error) {
      console.error("Failed to get file preview:", error);
      throw error;
    }
  }

  getFileView(fileId) {
    try {
      return this.storage.getFileView(
        conf.appwriteBucketId,
        fileId
      );
    } catch (error) {
      console.error("Failed to get file view:", error);
      throw error;
    }
  }

  getFileDownload(fileId) {
    try {
      return this.storage.getFileDownload(
        conf.appwriteBucketId,
        fileId
      );
    } catch (error) {
      console.error("Failed to get file download:", error);
      throw error;
    }
  }
}

export default new PortfolioService();
