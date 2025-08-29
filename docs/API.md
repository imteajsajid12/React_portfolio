# API Documentation

This document describes the API structure and services used in the Dynamic Portfolio application.

## Services Overview

The application uses Appwrite as the backend service with the following main service classes:

### AuthService (`src/services/authService.js`)

Handles all authentication-related operations.

#### Methods

- `getCurrentUser()` - Get current authenticated user
- `login(email, password)` - Authenticate user
- `logout()` - Sign out current user
- `createAccount(email, password, name)` - Register new user
- `updateName(name)` - Update user's name
- `updateEmail(email, password)` - Update user's email
- `updatePassword(newPassword, oldPassword)` - Change password
- `createRecovery(email, url)` - Initiate password recovery
- `updateRecovery(userId, secret, password, passwordAgain)` - Complete password recovery
- `createVerification(url)` - Send email verification
- `updateVerification(userId, secret)` - Verify email
- `getSessions()` - Get all user sessions
- `deleteSession(sessionId)` - Delete specific session
- `deleteAllSessions()` - Delete all sessions
- `isAdmin()` - Check if user has admin privileges
- `setAdminStatus(isAdmin)` - Set admin status (admin only)

### PortfolioService (`src/services/portfolioService.js`)

Manages all portfolio content operations.

#### Projects

- `getProjects(featured = null)` - Get all projects or filtered by featured status
- `getProject(projectId)` - Get single project by ID
- `createProject(projectData)` - Create new project
- `updateProject(projectId, projectData)` - Update existing project
- `deleteProject(projectId)` - Delete project

#### Skills

- `getSkills(category = null)` - Get all skills or filtered by category
- `getSkill(skillId)` - Get single skill by ID
- `createSkill(skillData)` - Create new skill
- `updateSkill(skillId, skillData)` - Update existing skill
- `deleteSkill(skillId)` - Delete skill

#### Experience

- `getExperiences()` - Get all work experiences
- `getExperience(experienceId)` - Get single experience by ID
- `createExperience(experienceData)` - Create new experience
- `updateExperience(experienceId, experienceData)` - Update existing experience
- `deleteExperience(experienceId)` - Delete experience

#### About

- `getAbout()` - Get about information
- `createAbout(aboutData)` - Create about information
- `updateAbout(aboutId, aboutData)` - Update about information

#### Contact

- `getContacts()` - Get all contact messages
- `getContact(contactId)` - Get single contact message
- `createContact(contactData)` - Create new contact message
- `updateContactStatus(contactId, status)` - Update contact message status

#### File Management

- `uploadFile(file)` - Upload file to storage
- `deleteFile(fileId)` - Delete file from storage
- `getFilePreview(fileId, width, height)` - Get file preview URL
- `getFileView(fileId)` - Get file view URL
- `getFileDownload(fileId)` - Get file download URL

## Custom Hooks

### Authentication Hooks (`src/hooks/useAuth.js`)

- `useAuth()` - Main authentication hook with context
- `useAuthOperations()` - Additional auth operations
- `useAdminAuth()` - Admin-specific operations

### Portfolio Hooks (`src/hooks/usePortfolio.js`)

- `useProjects(featured)` - Manage projects
- `useSkills(category)` - Manage skills
- `useExperience()` - Manage work experience
- `useAbout()` - Manage about information
- `useContacts()` - Manage contact messages

### File Upload Hooks (`src/hooks/useFileUpload.js`)

- `useFileUpload()` - General file upload
- `useImageUpload()` - Image-specific upload with preview
- `useMultipleFileUpload()` - Multiple file upload
- `useDocumentUpload()` - Document upload

## Data Models

### Project Model

```typescript
interface Project {
  $id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  status: 'active' | 'inactive' | 'draft';
  order: number;
  $createdAt: string;
  $updatedAt: string;
}
```

### Skill Model

```typescript
interface Skill {
  $id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'design' | 'version-control';
  proficiency: number; // 0-100
  icon?: string;
  color: string;
  order: number;
  status: 'active' | 'inactive';
  $createdAt: string;
  $updatedAt: string;
}
```

### Experience Model

```typescript
interface Experience {
  $id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  technologies: string[];
  location?: string;
  companyLogo?: string;
  order: number;
  status: 'active' | 'inactive';
  $createdAt: string;
  $updatedAt: string;
}
```

### About Model

```typescript
interface About {
  $id: string;
  name: string;
  title: string;
  bio: string;
  profileImage?: string;
  resume?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  status: 'active' | 'inactive';
  $createdAt: string;
  $updatedAt: string;
}
```

### Contact Model

```typescript
interface Contact {
  $id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  $createdAt: string;
  $updatedAt: string;
}
```

## Error Handling

All services implement consistent error handling:

- Network errors are caught and re-thrown with descriptive messages
- Appwrite errors are parsed and formatted for user display
- Loading states are managed in hooks
- Error boundaries catch unexpected errors

## Security

- All admin routes require authentication
- Role-based access control for sensitive operations
- File upload validation and size limits
- Environment variables for sensitive configuration
- CORS configuration in Appwrite

## Rate Limiting

Appwrite provides built-in rate limiting. Default limits:

- Authentication: 10 requests per minute per IP
- Database: 60 requests per minute per user
- Storage: 60 requests per minute per user

## Caching

- React Query could be added for advanced caching
- Browser caching for static assets
- Appwrite handles server-side caching

## Testing

Recommended testing approach:

1. Unit tests for utility functions
2. Integration tests for services
3. Component tests for UI components
4. E2E tests for critical user flows

Example test structure:
```
tests/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── api/
├── components/
└── e2e/
```
