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
      const queries = [Query.equal("status", "active")];
      if (category) {
        queries.push(Query.equal("category", category));
      }
      // Order by creation date instead of order field until collection is properly set up
      queries.push(Query.orderDesc("$createdAt"));

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
      // Prepare data for saving - stringify socialLinks if it's an object
      const socialLinksToSave = aboutData.socialLinks && typeof aboutData.socialLinks === 'object'
        ? JSON.stringify(aboutData.socialLinks)
        : aboutData.socialLinks;
        
      const result = await this.databases.createDocument(
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
          socialLinks: socialLinksToSave, // JSON string for storage
          status: "active"
        }
      );
      
      // Parse socialLinks back to object for return
      if (result.socialLinks && typeof result.socialLinks === 'string') {
        try {
          result.socialLinks = JSON.parse(result.socialLinks);
        } catch (parseError) {
          console.warn("Failed to parse socialLinks JSON:", parseError);
          result.socialLinks = {};
        }
      }
      
      return result;
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
      const aboutData = result.documents[0] || null;
      
      // Parse socialLinks JSON string if it exists
      if (aboutData && aboutData.socialLinks) {
        try {
          aboutData.socialLinks = typeof aboutData.socialLinks === 'string' 
            ? JSON.parse(aboutData.socialLinks) 
            : aboutData.socialLinks;
        } catch (parseError) {
          console.warn("Failed to parse socialLinks JSON:", parseError);
          aboutData.socialLinks = {};
        }
      }
      
      return aboutData;
    } catch (error) {
      console.error("Failed to get about info:", error);
      throw error;
    }
  }

  async updateAbout(aboutId, aboutData) {
    try {
      // Prepare data for saving - stringify socialLinks if it's an object
      const dataToSave = { ...aboutData };
      if (dataToSave.socialLinks && typeof dataToSave.socialLinks === 'object') {
        dataToSave.socialLinks = JSON.stringify(dataToSave.socialLinks);
      }
      
      const result = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionAbout,
        aboutId,
        dataToSave
      );
      
      // Parse socialLinks back to object for return
      if (result.socialLinks && typeof result.socialLinks === 'string') {
        try {
          result.socialLinks = JSON.parse(result.socialLinks);
        } catch (parseError) {
          console.warn("Failed to parse socialLinks JSON:", parseError);
          result.socialLinks = {};
        }
      }
      
      return result;
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
      console.log('🔧 Upload Configuration:', {
        bucketId: conf.appwriteBucketId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
      
      if (!conf.appwriteBucketId) {
        throw new Error('Storage bucket ID is not configured. Please check VITE_APPWRITE_STORAGE_BUCKET in your environment variables.');
      }
      
      const result = await this.storage.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
      
      console.log('✅ File uploaded successfully:', result);
      return result;
    } catch (error) {
      console.error("❌ Failed to upload file:", error);
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

  // ==================== CERTIFICATIONS MANAGEMENT ====================

  async createCertification(certificationData) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionCertifications,
        ID.unique(),
        {
          title: certificationData.title,
          issuer: certificationData.issuer,
          description: certificationData.description,
          issueDate: certificationData.issueDate,
          expiryDate: certificationData.expiryDate,
          credentialId: certificationData.credentialId,
          verificationUrl: certificationData.verificationUrl,
          certificateImage: certificationData.certificateImage,
          skills: certificationData.skills || [],
          featured: certificationData.featured || false,
          status: certificationData.status || "active",
          order: certificationData.order || 0
        }
      );
    } catch (error) {
      console.error("Failed to create certification:", error);
      throw error;
    }
  }

  async getCertifications(featured = null) {
    try {
      const queries = [Query.orderAsc("order")];
      if (featured !== null) {
        queries.push(Query.equal("featured", featured));
      }
      queries.push(Query.notEqual("status", "deleted"));

      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionCertifications,
        queries
      );
    } catch (error) {
      console.error("Failed to get certifications:", error);
      throw error;
    }
  }

  async getCertification(certificationId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionCertifications,
        certificationId
      );
    } catch (error) {
      console.error("Failed to get certification:", error);
      throw error;
    }
  }

  async updateCertification(certificationId, certificationData) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionCertifications,
        certificationId,
        certificationData
      );
    } catch (error) {
      console.error("Failed to update certification:", error);
      throw error;
    }
  }

  async deleteCertification(certificationId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionCertifications,
        certificationId
      );
    } catch (error) {
      console.error("Failed to delete certification:", error);
      throw error;
    }
  }

  // ==================== BLOG CATEGORIES MANAGEMENT ====================

  async createBlogCategory(categoryData) {
    try {
      const documentData = {
        name: categoryData.name,
        slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryData.description,
        color: categoryData.color || '#3B82F6',
        icon: categoryData.icon,
        status: categoryData.status || 'active'
        // Removed order field until collection is properly set up
      };

      console.log('Creating blog category with data:', documentData);
      console.log('Collection ID:', conf.appwriteCollectionBlogCategories);

      const result = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogCategories,
        ID.unique(),
        documentData
      );

      console.log('Blog category created successfully:', result);
      return result;
    } catch (error) {
      console.error("Failed to create blog category:", error);
      console.error("Database ID:", conf.appwriteDatabaseId);
      console.error("Collection ID:", conf.appwriteCollectionBlogCategories);
      console.error("Category data:", categoryData);
      throw error;
    }
  }

  async getBlogCategories() {
    try {
      const queries = [Query.equal("status", "active")];
      // Order by creation date instead of order field until collection is properly set up
      queries.push(Query.orderDesc("$createdAt"));

      console.log('Fetching blog categories with queries:', queries);
      console.log('Collection ID:', conf.appwriteCollectionBlogCategories);

      const result = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogCategories,
        queries
      );

      console.log('Blog categories fetched successfully:', result.documents?.length || 0, 'items');
      return result;
    } catch (error) {
      console.error("Failed to get blog categories:", error);
      console.error("Database ID:", conf.appwriteDatabaseId);
      console.error("Collection ID:", conf.appwriteCollectionBlogCategories);
      throw error;
    }
  }

  async getBlogCategory(categoryId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogCategories,
        categoryId
      );
    } catch (error) {
      console.error("Failed to get blog category:", error);
      throw error;
    }
  }

  async updateBlogCategory(categoryId, categoryData) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogCategories,
        categoryId,
        categoryData
      );
    } catch (error) {
      console.error("Failed to update blog category:", error);
      throw error;
    }
  }

  async deleteBlogCategory(categoryId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogCategories,
        categoryId
      );
    } catch (error) {
      console.error("Failed to delete blog category:", error);
      throw error;
    }
  }

  // ==================== BLOG POSTS MANAGEMENT ====================

  async createBlogPost(postData) {
    try {
      const documentData = {
        title: postData.title,
        slug: postData.slug || postData.title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: postData.excerpt,
        // content: postData.content, // Temporarily removed until collection has content field
        featuredImage: postData.featuredImage,
        categoryId: postData.categoryId,
        tags: postData.tags || [],
        status: postData.status || 'draft',
        featured: postData.featured || false,
        readTime: postData.readTime || 5,
        views: postData.views || 0,
        publishedAt: postData.status === 'published' ? new Date().toISOString() : null,
        order: postData.order || 0
      };

      console.log('Creating blog post with data:', documentData);
      console.log('Collection ID:', conf.appwriteCollectionBlogPosts);

      const result = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogPosts,
        ID.unique(),
        documentData
      );

      console.log('Blog post created successfully:', result);
      return result;
    } catch (error) {
      console.error("Failed to create blog post:", error);
      console.error("Database ID:", conf.appwriteDatabaseId);
      console.error("Collection ID:", conf.appwriteCollectionBlogPosts);
      console.error("Post data:", postData);
      throw error;
    }
  }

  async getBlogPosts(categoryId = null, status = 'published') {
    try {
      const queries = [Query.orderDesc("publishedAt")];

      if (categoryId) {
        queries.push(Query.equal("categoryId", categoryId));
      }

      if (status) {
        queries.push(Query.equal("status", status));
      }

      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogPosts,
        queries
      );
    } catch (error) {
      console.error("Failed to get blog posts:", error);
      throw error;
    }
  }

  async getBlogPost(postId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogPosts,
        postId
      );
    } catch (error) {
      console.error("Failed to get blog post:", error);
      throw error;
    }
  }

  async getBlogPostBySlug(slug) {
    try {
      const queries = [Query.equal("slug", slug)];
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogPosts,
        queries
      );
      return response.documents[0] || null;
    } catch (error) {
      console.error("Failed to get blog post by slug:", error);
      throw error;
    }
  }

  async updateBlogPost(postId, postData) {
    try {
      // Update publishedAt if status changes to published
      if (postData.status === 'published' && !postData.publishedAt) {
        postData.publishedAt = new Date().toISOString();
      }

      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogPosts,
        postId,
        postData
      );
    } catch (error) {
      // Temporary fix: If error is about unknown attributes, retry without engagement fields
      if (error.message?.includes('Unknown attribute') && 
          (error.message?.includes('commentsCount') || 
           error.message?.includes('likesCount') || 
           error.message?.includes('bookmarksCount') || 
           error.message?.includes('likes') ||
           error.message?.includes('bookmarks') ||
           error.message?.includes('comments') ||
           error.message?.includes('views'))) {
        
        console.warn('⚠️ Engagement attributes not found in blog posts collection. Updating without engagement fields.');
        console.log('📝 Please add these attributes to your blog posts collection:');
        console.log('   - commentsCount (integer, default: 0)');
        console.log('   - likesCount (integer, default: 0)');
        console.log('   - bookmarksCount (integer, default: 0)');
        console.log('   - views (integer, default: 0)');
        console.log('   - likes (integer, default: 0) [legacy field]');
        console.log('   - bookmarks (integer, default: 0) [legacy field]');
        console.log('   - comments (integer, default: 0) [legacy field]');
        
        // Remove all possible engagement fields and retry
        const filteredData = { ...postData };
        delete filteredData.commentsCount;
        delete filteredData.likesCount;
        delete filteredData.bookmarksCount;
        delete filteredData.views;
        delete filteredData.likes;
        delete filteredData.bookmarks;
        delete filteredData.comments;
        
        // If there's still data to update, retry
        if (Object.keys(filteredData).length > 0) {
          return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionBlogPosts,
            postId,
            filteredData
          );
        }
        
        // If only engagement fields were being updated, return success
        return { success: true, message: 'Engagement fields skipped - attributes not found' };
      }
      
      console.error("Failed to update blog post:", error);
      throw error;
    }
  }

  async deleteBlogPost(postId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogPosts,
        postId
      );
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      throw error;
    }
  }

  async incrementBlogPostViews(postId) {
    try {
      const post = await this.getBlogPost(postId);
      return await this.updateBlogPost(postId, {
        views: (post.views || 0) + 1
      });
    } catch (error) {
      console.error("Failed to increment blog post views:", error);
      throw error;
    }
  }

  // ==================== BLOG ENGAGEMENT ====================

  // Blog Likes
  async toggleBlogPostLike(postId, sessionId, userId = null) {
    try {
      // Check if already liked
      const queries = [
        Query.equal("postId", postId),
        Query.equal("sessionId", sessionId)
      ];

      const existingLikes = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogLikes,
        queries
      );

      if (existingLikes.documents.length > 0) {
        // Unlike - remove the like
        await this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionBlogLikes,
          existingLikes.documents[0].$id
        );

        // Decrement post likes count
        const post = await this.getBlogPost(postId);
        const currentLikes = Math.max(0, (post.likesCount || post.likes || 0) - 1);
        await this.updateBlogPost(postId, { likesCount: currentLikes });

        return { liked: false, likes: currentLikes };
      } else {
        // Like - add the like
        await this.databases.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionBlogLikes,
          ID.unique(),
          {
            postId,
            sessionId,
            userId,
            type: 'like'
          }
        );

        // Increment post likes count
        const post = await this.getBlogPost(postId);
        const currentLikes = (post.likesCount || post.likes || 0) + 1;
        await this.updateBlogPost(postId, { likesCount: currentLikes });

        return { liked: true, likes: currentLikes };
      }
    } catch (error) {
      // Handle collection not found errors gracefully
      if (error.message?.includes('Collection with the requested ID could not be found')) {
        console.warn("Blog likes collection not found. Feature disabled:", error.message);
        return { liked: false, likes: 0 }; // Return safe defaults
      }
      console.error("Failed to toggle blog post like:", error);
      return { liked: false, likes: 0 }; // Return safe defaults instead of throwing
    }
  }

  async checkBlogPostLike(postId, sessionId) {
    try {
      const queries = [
        Query.equal("postId", postId),
        Query.equal("sessionId", sessionId)
      ];

      const likes = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogLikes,
        queries
      );

      return likes.documents.length > 0;
    } catch (error) {
      // Handle collection not found errors gracefully
      if (error.message?.includes('Collection with the requested ID could not be found')) {
        console.warn("Blog likes collection not found. Feature disabled:", error.message);
        return false;
      }
      console.error("Failed to check blog post like:", error);
      return false;
    }
  }

  // Blog Bookmarks
  async toggleBlogPostBookmark(postId, sessionId, userId = null) {
    try {
      // Check if already bookmarked
      const queries = [
        Query.equal("postId", postId),
        Query.equal("sessionId", sessionId)
      ];

      const existingBookmarks = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogBookmarks,
        queries
      );

      if (existingBookmarks.documents.length > 0) {
        // Remove bookmark
        await this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionBlogBookmarks,
          existingBookmarks.documents[0].$id
        );

        // Decrement post bookmarks count
        const post = await this.getBlogPost(postId);
        const currentBookmarks = Math.max(0, (post.bookmarksCount || 0) - 1);
        await this.updateBlogPost(postId, { bookmarksCount: currentBookmarks });

        return { bookmarked: false, bookmarks: currentBookmarks };
      } else {
        // Add bookmark
        await this.databases.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionBlogBookmarks,
          ID.unique(),
          {
            postId,
            sessionId,
            userId
          }
        );

        // Increment post bookmarks count
        const post = await this.getBlogPost(postId);
        const currentBookmarks = (post.bookmarksCount || 0) + 1;
        await this.updateBlogPost(postId, { bookmarksCount: currentBookmarks });

        return { bookmarked: true, bookmarks: currentBookmarks };
      }
    } catch (error) {
      console.error("Failed to toggle blog post bookmark:", error);
      throw error;
    }
  }

  async checkBlogPostBookmark(postId, sessionId) {
    try {
      const queries = [
        Query.equal("postId", postId),
        Query.equal("sessionId", sessionId)
      ];

      const bookmarks = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogBookmarks,
        queries
      );

      return bookmarks.documents.length > 0;
    } catch (error) {
      // Handle collection not found errors gracefully
      if (error.message?.includes('Collection with the requested ID could not be found')) {
        console.warn("Blog bookmarks collection not found. Feature disabled:", error.message);
        return false;
      }
      console.error("Failed to check blog post bookmark:", error);
      return false;
    }
  }

  // Blog Comments
  async createBlogComment(commentData) {
    try {
      const comment = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogComments,
        ID.unique(),
        {
          ...commentData,
          status: 'approved' // Auto-approve for now, can add moderation later
        }
      );

      // Increment post comments count
      const post = await this.getBlogPost(commentData.postId);
      const currentComments = (post.commentsCount || 0) + 1;
      await this.updateBlogPost(commentData.postId, { commentsCount: currentComments });

      return comment;
    } catch (error) {
      console.error("Failed to create blog comment:", error);
      throw error;
    }
  }

  async getBlogComments(postId, status = 'approved') {
    try {
      const queries = [
        Query.equal("postId", postId),
        Query.equal("status", status),
        Query.orderDesc("$createdAt")
      ];

      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogComments,
        queries
      );
    } catch (error) {
      // Handle collection not found errors gracefully
      if (error.message?.includes('Collection with the requested ID could not be found')) {
        console.warn("Blog comments collection not found. Feature disabled:", error.message);
        return { documents: [] }; // Return empty structure matching expected format
      }
      console.error("Failed to get blog comments:", error);
      return { documents: [] }; // Return empty structure on any error
    }
  }

  async updateBlogComment(commentId, commentData) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogComments,
        commentId,
        commentData
      );
    } catch (error) {
      console.error("Failed to update blog comment:", error);
      throw error;
    }
  }

  async deleteBlogComment(commentId, postId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionBlogComments,
        commentId
      );

      // Decrement post comments count
      const post = await this.getBlogPost(postId);
      const currentComments = Math.max(0, (post.commentsCount || 0) - 1);
      await this.updateBlogPost(postId, { commentsCount: currentComments });

      return true;
    } catch (error) {
      console.error("Failed to delete blog comment:", error);
      throw error;
    }
  }



  // Session management for anonymous users
  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  getSessionId() {
    let sessionId = localStorage.getItem('blog_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('blog_session_id', sessionId);
    }
    return sessionId;
  }
}

export default new PortfolioService();
