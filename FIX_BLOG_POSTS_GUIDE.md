# Fix Blog Posts Engagement Attributes

The error you're seeing indicates that the `commentsCount`, `likesCount`, `bookmarksCount`, and `views` attributes don't exist in your `portfolio_blog_posts` collection.

## Quick Fix Options:

### Option 1: Manual Fix via Appwrite Console (Recommended)

1. **Go to Appwrite Console**: https://fra.cloud.appwrite.io/console
2. **Navigate to**: Project → Databases → Your Database → `portfolio_blog_posts` collection
3. **Add these attributes**:

   ```
   Attribute Key: likesCount
   Type: Integer
   Size: Default
   Required: Yes
   Default Value: 0
   Min: 0
   Max: 1000000
   
   Attribute Key: bookmarksCount  
   Type: Integer
   Size: Default
   Required: Yes
   Default Value: 0
   Min: 0
   Max: 1000000
   
   Attribute Key: commentsCount
   Type: Integer
   Size: Default
   Required: Yes
   Default Value: 0
   Min: 0
   Max: 1000000
   
   Attribute Key: views
   Type: Integer
   Size: Default
   Required: Yes
   Default Value: 0
   Min: 0
   Max: 1000000
   ```

### Option 2: Temporary Code Fix

While you add the attributes, update your `portfolioService.js` to handle missing attributes gracefully:

```javascript
// In portfolioService.js - updateBlogPost method
async updateBlogPost(postId, postData) {
  try {
    // Filter out engagement fields if they don't exist yet
    const allowedFields = { ...postData };
    
    // Temporarily remove engagement fields to avoid errors
    delete allowedFields.likesCount;
    delete allowedFields.bookmarksCount;
    delete allowedFields.commentsCount;
    delete allowedFields.views;
    
    return await this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionBlogPosts,
      postId,
      allowedFields
    );
  } catch (error) {
    console.error("Failed to update blog post:", error);
    throw error;
  }
}
```

### Option 3: Create Collections via REST API

If the SDK isn't working, you can use curl commands:

```bash
# Get your API key from Appwrite Console first

# Add likesCount attribute
curl -X POST https://fra.cloud.appwrite.io/v1/databases/68b167ac00260b8be1b2/collections/portfolio_blog_posts/attributes/integer \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: 68b167ac00260b8be1b2" \
  -H "X-Appwrite-Key: YOUR_API_KEY" \
  -d '{
    "key": "likesCount",
    "required": true,
    "min": 0,
    "max": 1000000,
    "default": 0
  }'

# Add bookmarksCount attribute  
curl -X POST https://fra.cloud.appwrite.io/v1/databases/68b167ac00260b8be1b2/collections/portfolio_blog_posts/attributes/integer \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: 68b167ac00260b8be1b2" \
  -H "X-Appwrite-Key: YOUR_API_KEY" \
  -d '{
    "key": "bookmarksCount",
    "required": true,
    "min": 0,
    "max": 1000000,
    "default": 0
  }'

# Add commentsCount attribute
curl -X POST https://fra.cloud.appwrite.io/v1/databases/68b167ac00260b8be1b2/collections/portfolio_blog_posts/attributes/integer \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: 68b167ac00260b8be1b2" \
  -H "X-Appwrite-Key: YOUR_API_KEY" \
  -d '{
    "key": "commentsCount",
    "required": true,
    "min": 0,
    "max": 1000000,
    "default": 0
  }'

# Add views attribute
curl -X POST https://fra.cloud.appwrite.io/v1/databases/68b167ac00260b8be1b2/collections/portfolio_blog_posts/attributes/integer \
  -H "Content-Type: application/json" \
  -H "X-Appwrite-Project: 68b167ac00260b8be1b2" \
  -H "X-Appwrite-Key: YOUR_API_KEY" \
  -d '{
    "key": "views",
    "required": true,
    "min": 0,
    "max": 1000000,
    "default": 0
  }'
```

## After Adding Attributes:

1. **Wait 2-3 minutes** for Appwrite to process the new attributes
2. **Test your blog detail page** - the error should be gone
3. **Verify engagement features work** by trying to like/comment on a post

## Verification:

The attributes are ready when you can see them in:
- Appwrite Console → Database → Collection → Attributes tab
- All show "Available" status (not "Processing")

Once these attributes exist, your blog engagement features will work perfectly!