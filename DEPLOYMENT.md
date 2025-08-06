# Deployment Guide

This guide covers deploying IntelPedia to various platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Gitnaseem745/intelpedia)

### Manual Deployment

1. **Fork the Repository**
   ```bash
   # Clone your fork
   git clone https://github.com/yourusername/intelpedia.git
   cd intelpedia
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Connect to Vercel**
   ```bash
   npx vercel
   ```

4. **Configure Environment Variables**
   In your Vercel dashboard, add the following environment variables:
   
   **Required:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `NEXT_PUBLIC_BLOG_ID` - Your Wisp CMS blog ID
   - `ADMIN_PASSWORD` - Bcrypt hashed admin password
   - `JWT_SECRET` - Secret for JWT tokens
   
   **Optional:**
   - `GITHUB_TOKEN` - For image uploads
   - `NEXT_PUBLIC_GA_ID` - Google Analytics ID
   - `REVALIDATION_SECRET` - For ISR revalidation
   - `OG_IMAGE_SECRET` - For OG image generation

5. **Deploy**
   ```bash
   npx vercel --prod
   ```

## 🛠️ Other Platforms

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy

### Railway

1. Connect your GitHub repository to Railway
2. Railway will auto-detect Next.js
3. Add environment variables in Railway dashboard
4. Deploy

### Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t intelpedia .
docker run -p 3000:3000 --env-file .env.local intelpedia
```

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Wisp CMS
NEXT_PUBLIC_BLOG_ID=your-wisp-blog-id

# Authentication
ADMIN_PASSWORD=$2a$12$hashedpassword
JWT_SECRET=your-jwt-secret-key

# Site Config
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NEXT_PUBLIC_BLOG_DISPLAY_NAME=Your Site Name
```

### Optional Environment Variables

```bash
# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# GitHub Integration
GITHUB_TOKEN=github_pat_xxxxxxxxxxxxx

# Advanced Features
REVALIDATION_SECRET=your-revalidation-secret
OG_IMAGE_SECRET=your-og-image-secret

# SEO
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string from "Connect" button
6. Use connection string in `MONGODB_URI`

### Local MongoDB

```bash
# Install MongoDB
brew install mongodb/brew/mongodb-community # macOS
# or follow instructions for your OS

# Start MongoDB
brew services start mongodb-community

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/intelpedia
```

## 📝 Content Management Setup

### Wisp CMS Setup

1. Create account at [Wisp](https://wisp.blog)
2. Create a new blog
3. Get your Blog ID from settings
4. Add Blog ID to `NEXT_PUBLIC_BLOG_ID`

### Admin Setup

1. Generate bcrypt hash for your password:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('yourpassword', 12))"
   ```

2. Add hashed password to `ADMIN_PASSWORD`

3. Generate JWT secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Add to `JWT_SECRET`

## 🔍 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Tools directory is accessible
- [ ] Admin dashboard works with your credentials
- [ ] Blog posts are loading (if Wisp is configured)
- [ ] Search functionality works
- [ ] Mobile responsiveness is working
- [ ] SEO meta tags are correct
- [ ] Analytics tracking works (if configured)

## 🚨 Troubleshooting

### Common Issues

**Build Fails:**
- Check all required environment variables are set
- Verify MongoDB connection string is correct
- Ensure Node.js version is 18+

**Admin Login Not Working:**
- Verify `ADMIN_PASSWORD` is bcrypt hashed
- Check `JWT_SECRET` is set
- Clear browser cache and cookies

**Database Connection Issues:**
- Verify MongoDB URI format
- Check database user permissions
- Ensure IP whitelist includes your deployment platform

**Images Not Loading:**
- Check GitHub token permissions
- Verify image repository exists
- Update image paths in next.config.mjs

## 📞 Support

If you encounter issues:
1. Check the [troubleshooting section](./README.md#troubleshooting) in README
2. Search [existing issues](https://github.com/Gitnaseem745/intelpedia/issues)
3. Create a new issue with detailed information
4. Join [discussions](https://github.com/Gitnaseem745/intelpedia/discussions) for community help
