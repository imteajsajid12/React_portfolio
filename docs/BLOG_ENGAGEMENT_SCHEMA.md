# Blog Engagement Database Schema

This document outlines the database schema for blog engagement features including comments, likes, and bookmarks.

## Collections Overview

### 1. Blog Comments Collection (`portfolio_blog_comments`)

**Purpose**: Store user comments on blog posts with support for threaded replies and moderation.

**Attributes**:
```json
{
  "postId": {
    "type": "string",
    "size": 255,
    "required": true,
    "description": "Reference to the blog post ID"
  },
  "parentId": {
    "type": "string", 
    "size": 255,
    "required": false,
    "description": "Parent comment ID for threaded replies, null for top-level comments"
  },
  "authorName": {
    "type": "string",
    "size": 100,
    "required": true,
    "description": "Display name of the comment author"
  },
  "authorEmail": {
    "type": "string",
    "size": 255,
    "required": true,
    "description": "Email address of the comment author (for notifications)"
  },
  "authorWebsite": {
    "type": "string",
    "size": 255,
    "required": false,
    "description": "Optional website URL of the comment author"
  },
  "content": {
    "type": "string",
    "size": 2000,
    "required": true,
    "description": "The comment text content"
  },
  "status": {
    "type": "string",
    "size": 20,
    "required": true,
    "default": "pending",
    "description": "Comment moderation status: pending, approved, rejected, spam"
  },
  "isReply": {
    "type": "boolean",
    "required": true,
    "default": false,
    "description": "Whether this comment is a reply to another comment"
  },
  "likes": {
    "type": "integer",
    "required": true,
    "default": 0,
    "description": "Number of likes this comment has received"
  },
  "ipAddress": {
    "type": "string",
    "size": 45,
    "required": false,
    "description": "IP address of the commenter (for spam prevention)"
  },
  "userAgent": {
    "type": "string",
    "size": 500,
    "required": false,
    "description": "Browser user agent (for spam prevention)"
  }
}
```

**Indexes**:
- `postId` (for fetching comments by post)
- `status` (for filtering by moderation status)
- `parentId` (for fetching replies)
- Combined index: `postId + status` (for efficient post comment queries)

### 2. Blog Likes Collection (`portfolio_blog_likes`)

**Purpose**: Track user likes on blog posts to prevent duplicate likes and provide analytics.

**Attributes**:
```json
{
  "postId": {
    "type": "string",
    "size": 255,
    "required": true,
    "description": "Reference to the blog post ID"
  },
  "sessionId": {
    "type": "string",
    "size": 255,
    "required": false,
    "description": "Browser session ID for anonymous users"
  },
  "userId": {
    "type": "string",
    "size": 255,
    "required": false,
    "description": "User ID for authenticated users"
  },
  "ipAddress": {
    "type": "string",
    "size": 45,
    "required": true,
    "description": "IP address of the user (fallback identifier)"
  },
  "userAgent": {
    "type": "string",
    "size": 500,
    "required": false,
    "description": "Browser user agent"
  },
  "likedAt": {
    "type": "datetime",
    "required": true,
    "description": "Timestamp when the like was created"
  }
}
```

**Indexes**:
- `postId` (for counting likes per post)
- `sessionId` (for checking if user already liked)
- `userId` (for authenticated user like tracking)
- Combined index: `postId + sessionId` (prevent duplicate likes)
- Combined index: `postId + userId` (prevent duplicate likes for auth users)
- Combined index: `postId + ipAddress` (fallback duplicate prevention)

### 3. Blog Bookmarks Collection (`portfolio_blog_bookmarks`)

**Purpose**: Allow users to bookmark blog posts for later reading.

**Attributes**:
```json
{
  "postId": {
    "type": "string",
    "size": 255,
    "required": true,
    "description": "Reference to the blog post ID"
  },
  "sessionId": {
    "type": "string",
    "size": 255,
    "required": false,
    "description": "Browser session ID for anonymous users"
  },
  "userId": {
    "type": "string",
    "size": 255,
    "required": false,
    "description": "User ID for authenticated users"
  },
  "title": {
    "type": "string",
    "size": 255,
    "required": true,
    "description": "Cached blog post title for quick access"
  },
  "slug": {
    "type": "string",
    "size": 255,
    "required": true,
    "description": "Cached blog post slug for navigation"
  },
  "category": {
    "type": "string",
    "size": 100,
    "required": false,
    "description": "Cached blog post category"
  },
  "tags": {
    "type": "string",
    "size": 500,
    "required": false,
    "description": "Comma-separated list of tags"
  },
  "bookmarkedAt": {
    "type": "datetime",
    "required": true,
    "description": "Timestamp when the bookmark was created"
  },
  "notes": {
    "type": "string",
    "size": 1000,
    "required": false,
    "description": "User's personal notes about this bookmark"
  }
}
```

**Indexes**:
- `postId` (for counting bookmarks per post)
- `sessionId` (for user bookmark lists)
- `userId` (for authenticated user bookmarks)
- Combined index: `sessionId + bookmarkedAt` (user bookmark history)
- Combined index: `userId + bookmarkedAt` (auth user bookmark history)
- Combined index: `postId + sessionId` (prevent duplicate bookmarks)
- Combined index: `postId + userId` (prevent duplicate bookmarks for auth users)

## Security & Privacy

### Permissions
```json
{
  "blog_comments": {
    "create": ["users", "guests"],
    "read": ["users", "guests"],
    "update": ["users"], // Only for moderation
    "delete": ["users"]  // Only for moderation
  },
  "blog_likes": {
    "create": ["users", "guests"],
    "read": ["users", "guests"],
    "update": [],
    "delete": ["users", "guests"] // Allow unlike
  },
  "blog_bookmarks": {
    "create": ["users", "guests"],
    "read": ["users", "guests"], // Users can only see their own
    "update": ["users", "guests"], // Update notes
    "delete": ["users", "guests"]
  }
}
```

### Rate Limiting
- Comments: 5 per hour per IP/session
- Likes: 50 per hour per IP/session
- Bookmarks: 20 per hour per IP/session

### Spam Prevention
- Store IP address and User Agent
- Implement honeypot fields in forms
- Content filtering for common spam patterns
- Manual moderation queue for comments

## Implementation Notes

### Session Management
For anonymous users, generate a browser session ID using:
```javascript
const sessionId = localStorage.getItem('blogSessionId') || 
  (() => {
    const id = crypto.randomUUID();
    localStorage.setItem('blogSessionId', id);
    return id;
  })();
```

### Denormalization Strategy
- Cache like counts and bookmark counts in the blog posts collection
- Update counts asynchronously to avoid blocking user interactions
- Implement eventual consistency with periodic count reconciliation

### Real-time Updates
- Use Appwrite Realtime API to show live comment updates
- Update like/bookmark counts in real-time for better UX
- Show typing indicators for comment forms

## Migration Scripts

### Creating Collections
```javascript
// Run these commands in Appwrite console or via SDK
await databases.createCollection(databaseId, 'portfolio_blog_comments', 'Blog Comments');
await databases.createCollection(databaseId, 'portfolio_blog_likes', 'Blog Likes'); 
await databases.createCollection(databaseId, 'portfolio_blog_bookmarks', 'Blog Bookmarks');
```

### Initial Data
```javascript
// Set default status for existing comments to 'approved'
// Initialize like/bookmark counts to 0 for existing posts
```