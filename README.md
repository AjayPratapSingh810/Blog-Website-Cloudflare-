# Blog-Website-Cloudflare-

Blog Website Backend
This is the backend for a blog website, built using Hono and deployed on Cloudflare. The backend provides routes for user authentication (sign-in, sign-up) and blog-related operations like creating, retrieving, bulk retrieving, and updating blog posts. Validation is handled using Zod through a common package, ajay-first-common-app, which is shared between the backend and frontend.

Features
User Authentication: Sign-in and sign-up routes with JWT-based authentication.
Blog Operations: Create, retrieve, bulk retrieve, and update blog posts.
Shared Validation: Type-safe validation using Zod via a common package (ajay-first-common-app), ensuring consistency across the frontend and backend.
Cloudflare Deployment: Optimized for Cloudflare deployment using Hono.
Installation
Clone the Repository:
git clone https://github.com/AjayPratapSingh810/Blog-Website-Cloudflare-.git
cd blog-website-backend

Install Dependencies:
npm install

Install Common Validation Package:
Ensure you have installed the common validation package:
npm install ajay-first-common-app

Usage
Running the Development Server
To start the development server locally:

npm run dev

This will start the server on http://localhost:8787.

Deploying to Cloudflare
To deploy to Cloudflare:

Install Wrangler:
npm install -g wrangler

Deploy using Wrangler:
wrangler publish

API Endpoints
User Authentication
Sign Up
Endpoint: POST /signup
Description: Register a new user.
Request Body:
{
"email": "user@example.com",
"password": "password123",
"name": "John Doe"
}

Sign In
Endpoint: POST /signin
Description: Authenticate a user and return a JWT.
Request Body:
{
"email": "user@example.com",
"password": "password123"
}

Blog Operations
Create Blog Post
Endpoint: POST /blogs
Description: Create a new blog post.
Request Body:
{
"title": "My First Blog",
"content": "This is the content of the blog post."
}

Get Blog Post by ID
Endpoint: GET /blogs/

Description: Retrieve a blog post by its ID.

Get All Blog Posts
Endpoint: GET /blogs/bulk
Description: Retrieve all blog posts.

Update Blog Post
Endpoint: PUT /blogs
Description: Update an existing blog post.
Request Body:
{
"id": "blog_id",
"title": "Updated Title",
"content": "Updated content of the blog post."
}

Validation
This project uses Zod for schema validation. The validation schemas are shared between the backend and frontend through the ajay-first-common-app package. This ensures consistent validation across the entire application.

Example Validation
In the backend, you can import and use the validation schemas as follows:

import { signupInput, signinInput } from "ajay-first-common-app";

Example usage in a route:
blogRouter.post("/signup", async (c) => {
const body = await c.req.json();
const validation = signupInput.safeParse(body);

if (!validation.success) {
return c.json({ errors: validation.error.errors }, 400);
}

// Proceed with signup logic
});

Environment Variables
The following environment variables are required:

DATABASE_URL: The URL of your database.
JWT_SECRET: The secret key for signing JWTs.
Set these variables in your Cloudflare environment.
