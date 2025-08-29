# Dynamic Portfolio with Admin Dashboard

A modern, dynamic portfolio website built with React, Vite, and Appwrite. Features a comprehensive admin dashboard for content management, real-time preview, and file uploads.

## 🚀 Features

### Portfolio Features

- **Dynamic Content**: All content is managed through Appwrite database
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes
- **Smooth Animations**: Framer Motion animations throughout
- **Contact Form**: Functional contact form with Appwrite integration
- **SEO Optimized**: Meta tags and structured data

### Admin Dashboard Features

- **Secure Authentication**: Admin login with role-based access
- **Project Management**: CRUD operations for portfolio projects
- **Skills Management**: Organize skills by categories with proficiency levels
- **Experience Management**: Timeline-based work experience management
- **About Section**: Personal information and social links management
- **Contact Messages**: View and manage contact form submissions
- **File Upload**: Image and document upload with preview
- **Real-time Preview**: Preview changes before publishing
- **Responsive Dashboard**: Mobile-friendly admin interface

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Appwrite (BaaS)
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Routing**: React Router DOM
- **State Management**: Custom hooks with React Context

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Appwrite account and project setup

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vite-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Appwrite**

   - Create an Appwrite account at [appwrite.io](https://appwrite.io)
   - Create a new project
   - Note down your project details

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Appwrite credentials:

   ```env
   # Appwrite Configuration
   VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_PROJECT_NAME=your_project_name
   VITE_APPWRITE_DATABASE_ID=your_database_id

   # Portfolio Collections
   VITE_APPWRITE_COLLECTION_PROJECTS=portfolio_projects
   VITE_APPWRITE_COLLECTION_SKILLS=portfolio_skills
   VITE_APPWRITE_COLLECTION_EXPERIENCE=portfolio_experience
   VITE_APPWRITE_COLLECTION_ABOUT=portfolio_about
   VITE_APPWRITE_COLLECTION_CONTACT=portfolio_contact

   # Storage
   VITE_APPWRITE_STORAGE_BUCKET=your_bucket_id
   ```

5. **Set up Appwrite Database**

   Create the following collections in your Appwrite database:

   **portfolio_projects**

   ```json
   {
     "title": "string",
     "description": "string",
     "technologies": "string[]",
     "image": "string",
     "demoUrl": "string",
     "githubUrl": "string",
     "featured": "boolean",
     "status": "string",
     "order": "integer"
   }
   ```

   **portfolio_skills**

   ```json
   {
     "name": "string",
     "category": "string",
     "proficiency": "integer",
     "icon": "string",
     "color": "string",
     "order": "integer",
     "status": "string"
   }
   ```

   **portfolio_experience**

   ```json
   {
     "company": "string",
     "position": "string",
     "startDate": "string",
     "endDate": "string",
     "current": "boolean",
     "description": "string[]",
     "technologies": "string[]",
     "location": "string",
     "companyLogo": "string",
     "order": "integer",
     "status": "string"
   }
   ```

   **portfolio_about**

   ```json
   {
     "name": "string",
     "title": "string",
     "bio": "string",
     "profileImage": "string",
     "resume": "string",
     "location": "string",
     "email": "string",
     "phone": "string",
     "website": "string",
     "socialLinks": "object",
     "status": "string"
   }
   ```

   **portfolio_contact**

   ```json
   {
     "name": "string",
     "email": "string",
     "subject": "string",
     "message": "string",
     "status": "string",
     "createdAt": "string"
   }
   ```

6. **Create Storage Bucket**

   - Create a storage bucket in Appwrite
   - Update the bucket ID in your `.env` file

7. **Set up Authentication**
   - Enable email/password authentication in Appwrite
   - Create an admin user account

## 🚀 Running the Application

1. **Development mode**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

2. **Build for production**

   ```bash
   npm run build
   ```

3. **Preview production build**
   ```bash
   npm run preview
   ```

## 📱 Usage

### Public Portfolio

- Visit the homepage to view the portfolio
- Navigate through different sections using the navigation menu
- Use the contact form to send messages
- Toggle between light and dark themes

### Admin Dashboard

1. **Access the admin panel**

   - Go to `/admin/login`
   - Use your admin credentials to log in

2. **Manage Content**

   - **Projects**: Add, edit, and delete portfolio projects
   - **Skills**: Organize skills by categories with proficiency levels
   - **Experience**: Manage work experience timeline
   - **About**: Update personal information and social links
   - **Messages**: View and respond to contact form submissions

3. **Preview Changes**
   - Use the "Preview" button to see changes in real-time
   - Test responsive design with different viewport sizes
   - Open live site to compare with current version

## 🔒 Security

- Admin routes are protected with authentication
- Role-based access control for admin features
- Secure file upload with validation
- Environment variables for sensitive data

## 🎨 Customization

### Styling

- Tailwind CSS for utility-first styling
- Dark mode support with CSS variables
- Responsive design breakpoints
- Custom animations with Framer Motion

### Content

- All content is managed through the admin dashboard
- No need to modify code for content updates
- Dynamic image handling with Appwrite Storage

## 📚 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   └── auth/            # Authentication components
├── hooks/               # Custom React hooks
├── services/            # Appwrite service classes
├── portfolio/           # Main portfolio component
└── conf/                # Configuration files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the Appwrite console for errors
2. Verify environment variables are correct
3. Ensure all collections are properly configured
4. Check browser console for client-side errors

For additional help, please open an issue in the repository.
