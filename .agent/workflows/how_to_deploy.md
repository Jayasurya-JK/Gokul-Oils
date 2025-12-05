---
description: How to deploy the application to Netlify
---
# Deploying to Netlify

Follow these steps to deploy your Next.js application to Netlify.

## Prerequisites
- A GitHub/GitLab/Bitbucket account
- A Netlify account
- Git installed locally

## Steps

1. **Push your code to a Git repository**
   - Initialize git if not done: `git init`
   - Add files: `git add .`
   - Commit: `git commit -m "Ready for deploy"`
   - Create a repository on GitHub (or your preferred provider).
   - Link remote: `git remote add origin <your-repo-url>`
   - Push: `git push -u origin main`

2. **Connect to Netlify**
   - Log in to your Netlify dashboard.
   - Click **"Add new site"** > **"Import from an existing project"**.
   - Select your Git provider (e.g., GitHub).
   - Authorize Netlify to access your repositories.
   - Select the `Gokul Oils` (or your repo name) repository.

3. **Configure Build Settings**
   - Netlify should automatically detect it's a Next.js project.
   - **Build Command**: `npm run build`
   - **Publish directory**: `.next` (or leave default)
   - The `netlify.toml` file added to your project will help pre-configure these settings.

4. **Deploy**
   - Click **"Deploy Site"**.
   - Netlify will start building your site. You can view the build logs to check progress.

5. **Domain Setup (Optional)**
   - Once deployed, you can change the site name in "Site settings" > "General" > "Change site name".
   - You can also add a custom domain in "Domain management".

## Troubleshooting
- If the build fails due to ESLint errors, you might need to fix them or temporarily disable linting during build in `next.config.ts` (not recommended for production).
- Ensure all environment variables (if any) are added in Netlify's "Site settings" > "Environment variables".
