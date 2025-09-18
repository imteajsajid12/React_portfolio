# 🚀 Appwrite Portfolio Database Setup Guide

## 🔍 Problem Analysis

You're receiving a `404 Collection not found` error because the required Appwrite collections haven't been created in your database yet. The error indicates:

```json
{
  "message": "Collection with the requested ID could not be found.",
  "code": 404,
  "type": "collection_not_found",
  "version": "1.8.0"
}
```

## 📋 Required Collections

Your portfolio application needs these 11 collections:

### Core Portfolio Collections

1. **`portfolio_projects`** - Project showcase data
2. **`portfolio_skills`** - Technical skills and proficiencies
3. **`portfolio_experience`** - Work experience and career history
4. **`portfolio_about`** - Personal information and bio
5. **`portfolio_contact`** - Contact form submissions
6. **`portfolio_certifications`** - Certificates and achievements

### Blog Collections

7. **`portfolio_blog_categories`** - Blog post categories
8. **`portfolio_blog_posts`** - Blog articles and content
9. **`portfolio_blog_comments`** - User comments on posts
10. **`portfolio_blog_likes`** - Post like tracking
11. **`portfolio_blog_bookmarks`** - User bookmark system

## 🛠️ Setup Methods

### Method 1: Automated Setup (Recommended)

1. **Run the Setup Script**

   ```bash
   cd /Users/imteajsajid/Documents/Development/Learn_reacet/project2/vite-project
   node setup-database-complete.js
   ```

2. **Verify Environment Variables**
   Make sure your `.env` file contains:
   ```env
   VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=68b167ac00260b8be1b2
   ```

### Method 2: Manual Setup via Appwrite Console

#### Step 1: Access Appwrite Console

1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Navigate to your project
3. Go to **Databases** section
4. Select database ID: `68b167ac00260b8be1b2`

#### Step 2: Create Collections

For each collection, follow these steps:

**1. Portfolio Skills Collection (`portfolio_skills`)**

- Collection ID: `portfolio_skills`
- Collection Name: `Portfolio Skills`
- Permissions:
  - Read: Any
  - Create/Update/Delete: Users

**Attributes:**

```
name: String(100) - Required
category: String(100) - Required
proficiency: Integer(0-100) - Optional, Default: 50
icon: String(2000) - Optional
iconType: String(50) - Optional, Default: "lucide"
color: String(20) - Optional, Default: "#3B82F6"
description: String(500) - Optional
yearsOfExperience: Integer - Optional, Default: 0
order: Integer - Optional, Default: 0
status: String(50) - Optional, Default: "active"
featured: Boolean - Optional, Default: false
```

**2. Portfolio Projects Collection (`portfolio_projects`)**

- Collection ID: `portfolio_projects`
- Collection Name: `Portfolio Projects`

**Attributes:**

```
title: String(255) - Required
description: String(2000) - Required
shortDescription: String(500) - Optional
technologies: Array[String(100)] - Optional
image: String(500) - Optional
images: Array[String(500)] - Optional
demoUrl: String(500) - Optional
githubUrl: String(500) - Optional
featured: Boolean - Optional, Default: false
status: String(50) - Optional, Default: "active"
category: String(100) - Optional, Default: "web"
startDate: String(50) - Optional
endDate: String(50) - Optional
client: String(255) - Optional
order: Integer - Optional, Default: 0
views: Integer - Optional, Default: 0
likes: Integer - Optional, Default: 0
```

**3. Portfolio About Collection (`portfolio_about`)**

- Collection ID: `portfolio_about`
- Collection Name: `Portfolio About`

**Attributes:**

```
name: String(255) - Required
title: String(255) - Required
subtitle: String(500) - Optional
bio: String(5000) - Optional
shortBio: String(1000) - Optional
profileImage: String(500) - Optional
backgroundImage: String(500) - Optional
resume: String(500) - Optional
email: String(255) - Optional
phone: String(50) - Optional
location: String(255) - Optional
timezone: String(100) - Optional
availableForWork: Boolean - Optional, Default: true
socialLinks: String(2000) - Optional (JSON format)
languages: Array[String(100)] - Optional
hobbies: Array[String(100)] - Optional
quote: String(500) - Optional
status: String(50) - Optional, Default: "active"
```

**4. Portfolio Experience Collection (`portfolio_experience`)**

- Collection ID: `portfolio_experience`
- Collection Name: `Portfolio Experience`

**Attributes:**

```
company: String(255) - Required
position: String(255) - Required
startDate: String(20) - Required
endDate: String(20) - Optional
current: Boolean - Optional, Default: false
description: Array[String(1000)] - Optional
responsibilities: Array[String(1000)] - Optional
achievements: Array[String(1000)] - Optional
technologies: Array[String(100)] - Optional
location: String(255) - Optional
locationType: String(50) - Optional, Default: "onsite"
companyLogo: String(500) - Optional
companyWebsite: String(500) - Optional
employmentType: String(50) - Optional, Default: "full-time"
order: Integer - Optional, Default: 0
status: String(50) - Optional, Default: "active"
featured: Boolean - Optional, Default: false
```

**5. Portfolio Contact Collection (`portfolio_contact`)**

- Collection ID: `portfolio_contact`
- Collection Name: `Portfolio Contact`

**Attributes:**

```
name: String(255) - Required
email: String(255) - Required
subject: String(500) - Optional
message: String(5000) - Required
phone: String(50) - Optional
company: String(255) - Optional
budget: String(100) - Optional
timeline: String(100) - Optional
projectType: String(100) - Optional
status: String(50) - Optional, Default: "new"
priority: String(50) - Optional, Default: "medium"
replied: Boolean - Optional, Default: false
ipAddress: String(50) - Optional
userAgent: String(500) - Optional
referrer: String(500) - Optional
repliedAt: String(50) - Optional
notes: String(2000) - Optional
```

**6. Portfolio Certifications Collection (`portfolio_certifications`)**

- Collection ID: `portfolio_certifications`
- Collection Name: `Portfolio Certifications`

**Attributes:**

```
name: String(255) - Required
issuer: String(255) - Required
issueDate: String(20) - Required
expiryDate: String(20) - Optional
credentialId: String(255) - Optional
credentialUrl: String(500) - Optional
verificationUrl: String(500) - Optional
image: String(500) - Optional
badge: String(500) - Optional
description: String(1000) - Optional
skills: Array[String(100)] - Optional
category: String(100) - Optional, Default: "certification"
level: String(50) - Optional, Default: "intermediate"
status: String(50) - Optional, Default: "active"
featured: Boolean - Optional, Default: false
order: Integer - Optional, Default: 0
score: String(50) - Optional
```

## 🎯 Quick Fix Commands

### For Initial Setup (404 errors):
```bash
# Navigate to project directory
cd /Users/imteajsajid/Documents/Development/Learn_reacet/project2/vite-project

# Install dependencies if needed
npm install appwrite dotenv

# Run the complete setup
node setup-database-complete.js
```

### For Attribute Type Issues (400 errors):
```bash
# Fix boolean attribute type mismatches
node fix-attribute-types.js
```

### Manual Fix for "current" Attribute Issue:
1. **Go to Appwrite Console**: https://cloud.appwrite.io/console/
2. **Navigate to**: portfolio_experience collection
3. **Delete**: "current" attribute (if it exists as String type)
4. **Create new**: "current" attribute as **Boolean** type
   - Required: No
   - Default: false

## ✅ Verification Steps

After setup, verify collections exist:

1. **Check Appwrite Console**

   - Go to your database in Appwrite Console
   - Verify all 11 collections are created
   - Check that attributes match the schema

2. **Test API Endpoints**

   ```bash
   # Test skills collection
   curl -X GET "https://fra.cloud.appwrite.io/v1/databases/68b167ac00260b8be1b2/collections/portfolio_skills/documents" \
   -H "X-Appwrite-Project: YOUR_PROJECT_ID"
   ```

3. **Check Application**
   - Start your React app
   - Navigate to portfolio sections
   - Verify no more 404 errors in console

## 🚨 Troubleshooting

**If setup fails:**

1. **Check Environment Variables**

   ```bash
   # Verify .env file exists and has correct values
   cat .env | grep APPWRITE
   ```

2. **Verify Appwrite Project Settings**

   - Ensure project ID is correct
   - Check API key permissions
   - Verify database ID exists

3. **Check Network Connection**

   ```bash
   # Test Appwrite endpoint
   curl -I https://fra.cloud.appwrite.io/v1/health
   ```

4. **Manual Collection Creation**
   - If script fails, create collections manually via console
   - Use the attribute schemas provided above

## 📊 Sample Data

After creating collections, add sample data:

**Skills Sample:**

```json
{
  "name": "React",
  "category": "Frontend",
  "proficiency": 90,
  "icon": "FaReact",
  "iconType": "react-icons",
  "color": "#61DAFB",
  "yearsOfExperience": 3,
  "status": "active",
  "featured": true
}
```

**Projects Sample:**

```json
{
  "title": "Portfolio Website",
  "description": "Modern React portfolio with dynamic content management",
  "technologies": ["React", "Tailwind CSS", "Appwrite"],
  "featured": true,
  "status": "active",
  "category": "web"
}
```

## 🔧 Next Steps

1. ✅ Create all collections using the setup script
2. 📝 Add sample data to test functionality
3. 🎨 Customize collection schemas as needed
4. 🚀 Deploy and test your portfolio
5. 📈 Monitor usage and optimize performance

## � Common Issues & Fixes

### Issue 1: "Invalid document structure" - Attribute Type Mismatch

**Error:**
```json
{
  "message": "Invalid document structure: Attribute \"current\" has invalid type. Value must be a valid string and no longer than 255 chars",
  "code": 400,
  "type": "document_invalid_structure"
}
```

**Problem:** The `current` attribute in `portfolio_experience` collection is set as String but your app sends Boolean.

**Solution Options:**

**Option A: Fix in Appwrite Console (Recommended)**
1. Go to your Appwrite Console
2. Navigate to `portfolio_experience` collection
3. Delete the `current` attribute (if it exists as string)
4. Create new `current` attribute:
   - Key: `current`
   - Type: **Boolean** 
   - Required: No
   - Default: `false`

**Option B: Update Your Application Code**
If you can't modify the collection, update your code to send string values:
```javascript
// Instead of: current: true
// Use: current: "true"

// Instead of: current: false  
// Use: current: "false"
```

**Option C: Delete and Recreate Collection**
1. Delete the entire `portfolio_experience` collection
2. Run the setup script again to create it with correct types

### Issue 2: Other Type Mismatches

Similar issues may occur with these attributes if created incorrectly:
- `featured` (should be Boolean, not String)
- `availableForWork` (should be Boolean, not String)  
- `replied` (should be Boolean, not String)

**Prevention:** Always use the exact attribute types specified in this guide.

## �📞 Support

If you continue having issues:

- Check Appwrite documentation: [https://appwrite.io/docs](https://appwrite.io/docs)
- Verify your project permissions and API keys
- Ensure all environment variables are correctly set
- Verify attribute types match exactly what your code expects
