# BlogVibe

**BlogVibe** is a modern blogging platform built with React and Appwrite, offering a seamless experience for writers and readers alike. With its intuitive interface and robust features, BlogVibe makes content creation and sharing effortless.

## Key Features

### User Experience
- **Modern Dark Theme UI**: Sleek and eye-friendly dark mode interface
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Smooth Animations**: Enhanced user experience with subtle transitions
- **Intuitive Navigation**: Easy-to-use interface with clear navigation

### Content Management
- **Rich Text Editor**: Powerful editor with formatting options
- **Image Management**: Upload and manage featured images with lazy loading
- **Post Organization**: Create, edit, and delete posts with ease
- **Comment System**: Engage with readers through comments
- **Like System**: Allow readers to like and interact with posts

### User Features
- **Secure Authentication**: Robust login and signup system
- **User Profiles**: Personalized profile with avatar and information
- **Post Management**: Full control over your content
- **Real-time Updates**: Instant feedback on actions

### Technical Features
- **Appwrite Backend**: Secure and scalable backend infrastructure
- **Redux State Management**: Efficient state handling
- **React Router**: Smooth navigation and routing
- **Tailwind CSS**: Modern and responsive styling

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Appwrite
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Styling**: Tailwind CSS

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/blogvibe.git
   ```

2. **Install dependencies**:
   ```bash
   cd blogvibe
   npm install
   ```

3. **Set up Appwrite**:
   - Create an account at [Appwrite](https://appwrite.io)
   - Create a new project
   - Set up the following services:
     - **Authentication**: Enable Email/Password authentication
     - **Database**: Create a database with the following collections:
       - `posts`: For blog posts
       - `comments`: For post comments
       - `likes`: For post likes
     - **Storage**: Create a bucket for storing post images
     - **Functions**: (Optional) For any server-side operations

4. **Configure environment variables**:
   Create a `.env` file with:
   ```env
   VITE_APPWRITE_URL=your-appwrite-endpoint
   VITE_PROJECT_ID=your-project-id
   VITE_DATABASE_ID=your-database-id
   VITE_BUCKET_ID=your-bucket-id
   VITE_POSTS_COLLECTION_ID=your-posts-collection-id
   VITE_LIKES_COLLECTION_ID=your-likes-collection-id
   VITE_COMMENTS_COLLECTION_ID=your-comments-collection-id
   VITE_TINY_API_KEY=your-tiny-mce-api-key
   VITE_ADMIN_ID=your-admin-UserId

   ```

5. **Start the application**:
   ```bash
   npm start
   ```

## Project Structure

```plaintext
blogvibe/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── store/         # Redux store and slices
│   ├── routes/        # Application routes
│   ├── appwrite/      # Appwrite integration
│   └── config/        # Configuration files
```

## License

This project is licensed under the MIT License.

---

**BlogVibe** - Where stories come to life.
