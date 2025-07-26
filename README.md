# IntelPedia - AI Tools Directory & Innovation Hub

[![IntelPedia AI Tools Directory](https://img.shields.io/badge/IntelPedia-AI%20Tools%20Directory-blue?style=for-the-badge)](https://intelpedia.tech)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)

**IntelPedia** is a comprehensive AI tools directory and innovation hub built with Next.js 15, featuring a curated collection of artificial intelligence tools, productivity software, and cutting-edge AI technologies. The platform combines a robust tools database with an integrated blog powered by Wisp CMS.

## 🚀 Live Demo

- **Main Site**: [intelpedia.tech](https://intelpedia.tech)
- **Tools Directory**: [intelpedia.tech/tools](https://intelpedia.tech/tools)
- **Submit Tool**: [intelpedia.tech/submit-tool](https://intelpedia.tech/submit-tool)
- **Admin Dashboard**: [intelpedia.tech/admin](https://intelpedia.tech/admin)

## 🎯 Project Overview

IntelPedia serves as the ultimate destination for discovering, exploring, and sharing AI tools. Built for developers, creators, and AI enthusiasts, it provides a comprehensive platform to find the perfect AI solution for any use case.

## ✨ Key Features

### 🔍 **Comprehensive AI Tools Directory**
- **Curated Collection**: Hand-picked AI tools across 20+ categories
- **Advanced Search**: Full-text search with filtering by tags, pricing, and features
- **Detailed Tool Pages**: In-depth information including features, pricing, and user insights
- **Tool Submission**: Community-driven platform for sharing new AI discoveries
- **Featured Tools**: Highlighted tools for enhanced visibility

### 💰 **Smart Pricing System**
- **Free Tools**: Completely free AI tools with no hidden costs
- **Freemium Models**: Tools with free tiers and premium upgrades
- **Paid Solutions**: Professional AI tools with transparent pricing
- **Price Filtering**: Filter tools by pricing model (Free/Freemium/Paid)

### 🏗️ **Robust Admin Dashboard**
- **Tool Management**: Complete CRUD operations for AI tools
- **Pending Submissions**: Review and approve community submissions
- **Bulk Operations**: Efficiently manage large datasets
- **Real-time Analytics**: Monitor tool submissions and user engagement

### 📝 **Integrated Blog System**
- **AI Content**: Latest AI news, tutorials, and industry insights
- **Wisp CMS Integration**: Professional content management system
- **SEO Optimized**: Full meta tags, structured data, and sitemaps
- **Related Posts**: AI-powered content recommendations

### 🚀 **Performance & SEO**
- **ISR Implementation**: Incremental Static Regeneration for optimal performance
- **Server Components**: Next.js 15 App Router for maximum efficiency
- **Advanced SEO**: Schema.org markup, OpenGraph, and Twitter cards
- **Core Web Vitals**: Optimized for Google's performance metrics

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: System-aware theme switching
- **Shadcn UI**: Modern, accessible component library
- **Progressive Enhancement**: Works without JavaScript

## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router & Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development experience
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn UI](https://ui.shadcn.com/)** - Modern, accessible component library
- **[next/font](https://nextjs.org/docs/app/api-reference/components/font)** - Optimized font loading

### **Backend & Database**
- **[MongoDB](https://mongodb.com/)** - NoSQL database for tool storage
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **Next.js API Routes** - Serverless API endpoints
- **[Zod](https://zod.dev/)** - Runtime type validation

### **Content Management**
- **[Wisp CMS](https://wisp.blog/)** - Headless CMS for blog content
- **Custom API** - RESTful API for tools management
- **Image Upload** - Integrated image handling system

### **Development & Deployment**
- **[ESLint](https://eslint.org/)** - Code quality and consistency
- **[Vercel](https://vercel.com/)** - Deployment and hosting platform
- **ISR** - Incremental Static Regeneration for performance

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (pages)/            # Public pages
│   │   ├── tools/          # Tools directory & detail pages
│   │   ├── submit-tool/    # Tool submission form
│   │   └── blog/           # Blog pages (Wisp CMS)
│   ├── admin/              # Admin dashboard
│   │   └── tools/          # Tool management interface
│   ├── api/                # API endpoints
│   │   ├── tools/          # Tools CRUD operations
│   │   └── auth/           # Authentication endpoints
│   └── (sitemaps)/         # Dynamic sitemap generation
├── components/             # Reusable UI components
│   ├── ui/                 # Shadcn UI components
│   ├── ToolCard.tsx        # Tool display component
│   ├── ToolFilter.tsx      # Advanced filtering system
│   └── PricingDisplay.tsx  # Pricing logic component
├── lib/                    # Utility functions
│   ├── db.ts              # Database connection
│   ├── validations/       # Zod schemas
│   └── utils.ts           # Helper functions
├── models/                 # MongoDB schemas
│   ├── Tool.ts            # Tool data model
│   └── PendingTool.ts     # Pending submissions model
├── hooks/                  # Custom React hooks
│   ├── useTools.ts        # Tool data management
│   └── useToolFiltering.ts # Filter logic
└── config/
    └── adConfig.ts        # Advertisement configuration
```

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Wisp CMS account (for blog functionality)

### 1. Clone & Install

```bash
git clone https://github.com/Gitnaseem745/wisp-nextjs-blog.git
cd wisp-nextjs-blog
npm i --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag is required due to React 19 compatibility with next-themes.

### 2. Environment Setup

Copy the environment file and configure variables:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/intelpedia

# Wisp CMS (for blog)
NEXT_PUBLIC_BLOG_ID=your_wisp_blog_id

# Authentication
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_jwt_secret_key

# Site Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BLOG_DISPLAY_NAME=IntelPedia
NEXT_PUBLIC_BLOG_DESCRIPTION=Your AI Tools & Innovation Hub

# Image & OG Generation
OG_IMAGE_SECRET=your_og_image_secret
REVALIDATION_SECRET=your_revalidation_secret
```

### 3. Database Setup

The application will automatically create the required MongoDB collections on first run. For production, ensure your MongoDB instance is properly configured.

### 4. Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your IntelPedia instance.

### 5. Production Build

```bash
npm run build
npm start
```

## 📋 API Documentation

### Tools API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tools` | Fetch all tools |
| `GET` | `/api/tools/[id]` | Get specific tool |
| `POST` | `/api/tools` | Create new tool |
| `PUT` | `/api/tools/[id]` | Update tool |
| `DELETE` | `/api/tools/[id]` | Delete tool |
| `GET` | `/api/tools/search` | Search tools with filters |
| `POST` | `/api/tools/submit` | Submit tool for review |
| `POST` | `/api/tools/approve` | Approve pending tool |

### Example Tool Data Structure

```typescript
interface Tool {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  siteUrl: string;
  imgUrl?: string;
  features?: Array<{
    name: string;
    details: string;
  }>;
  featured?: boolean;
  isFree?: boolean;
  pricing?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎯 Usage Guide

### For Users

#### **Discovering AI Tools**
1. **Browse Tools**: Visit `/tools` to explore the directory
2. **Filter & Search**: Use advanced filters for pricing, tags, and features
3. **Tool Details**: Click any tool for detailed information and features
4. **Submit Tools**: Share new AI tools via `/submit-tool`

#### **Reading AI Content**
1. **Blog**: Access latest AI insights and tutorials
2. **Categories**: Browse content by AI categories
3. **Related Posts**: Discover similar content automatically

### For Administrators

#### **Dashboard Access**
1. Navigate to `/admin`
2. Enter admin credentials
3. Access the full management dashboard

#### **Tool Management**
1. **Add Tools**: Create new tool entries with full details
2. **Edit Tools**: Update existing tool information
3. **Review Submissions**: Approve or reject community submissions
4. **Featured Tools**: Promote tools for enhanced visibility

#### **Content Management**
1. **Blog Posts**: Manage content through Wisp CMS
2. **SEO Settings**: Configure meta tags and structured data
3. **Analytics**: Monitor tool submissions and user engagement

## 🔧 Advanced Features

### Incremental Static Regeneration (ISR)
- **Performance**: Lightning-fast tool pages with 1-hour revalidation
- **SEO Benefits**: Pre-rendered pages for optimal search engine indexing
- **Fresh Content**: Automatic updates without manual intervention

### Pricing Intelligence
- **Smart Display**: Automatic pricing categorization (Free/Freemium/Paid)
- **Filter System**: Advanced filtering by pricing models
- **Comparison**: Easy pricing comparison across tools

### Enhanced Search
- **Full-Text Search**: Search across titles, descriptions, and features
- **Tag Filtering**: Multi-tag selection for precise results
- **Real-time Results**: Instant search with debounced queries

## 📊 Performance Optimizations

- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Next.js automatic image optimization
- **Font Optimization**: Preloaded custom fonts
- **Bundle Splitting**: Automatic code splitting for optimal loading
- **Caching Strategy**: Multi-layer caching for maximum performance

## 🔐 Security Features

- **Input Validation**: Zod schema validation on all inputs
- **Admin Authentication**: Secure admin dashboard access
- **Rate Limiting**: API rate limiting for abuse prevention
- **Sanitization**: HTML content sanitization for security

## 🚢 Deployment

### Vercel (Recommended)

1. **Fork Repository**: Fork this repository to your GitHub account
2. **Vercel Setup**: Connect your repository to Vercel
3. **Environment Variables**: Configure all required environment variables
4. **Deploy**: Automatic deployment on every push

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Ensure all environment variables are properly set:
- Database connection string
- Wisp CMS configuration
- Authentication secrets
- Domain configuration

## 📖 Documentation

### Available Documentation
- [API Documentation](./src/app/api/README.md) - Complete API reference
- [Admin Dashboard Guide](./docs/ADMIN_DASHBOARD.md) - Dashboard usage
- [ISR Implementation](./docs/ISR_IMPLEMENTATION_GUIDE.md) - Performance optimization
- [Pricing Features](./docs/PRICING_FEATURE_IMPLEMENTATION.md) - Pricing system
- [Featured Tools](./docs/FEATURED_FIELD_IMPLEMENTATION.md) - Tool promotion system

## 🤝 Contributing

We welcome contributions to IntelPedia! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain code consistency with ESLint
- Add tests for new features
- Update documentation for changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Project Details

### IntelPedia – AI Tools Directory & Innovation Hub
Creator, Full-Stack Developer | 2024 – Present
- Built a comprehensive AI tools directory and innovation hub using Next.js 15, TypeScript, and MongoDB.
- Features a curated collection of 200+ AI tools across 20+ categories with advanced search and filtering capabilities.
- Implements ISR (Incremental Static Regeneration) for optimal performance and SEO optimization.
- Integrated Wisp CMS for blog functionality, admin dashboard for tool management, and smart pricing system.
- Includes community-driven tool submission system, featured tools promotion, and real-time analytics.
- Optimized for Core Web Vitals with server components, image optimization, and advanced caching strategies.
- **Website**: [intelpedia.tech](https://intelpedia.tech)
- **Tools Directory**: [intelpedia.tech/tools](https://intelpedia.tech/tools)
- **GitHub**: [github.com/Gitnaseem745/wisp-nextjs-blog](https://github.com/Gitnaseem745/wisp-nextjs-blog)

## �🙋‍♂️ Support & Contact

- **Creator**: [Naseem](https://github.com/Gitnaseem745)
- **Website**: [intelpedia.tech](https://intelpedia.tech)
- **Issues**: [GitHub Issues](https://github.com/Gitnaseem745/wisp-nextjs-blog/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Gitnaseem745/wisp-nextjs-blog/discussions)

## 🌟 Acknowledgments

- **[Wisp CMS](https://wisp.blog/)** - Headless CMS for blog functionality
- **[Shadcn UI](https://ui.shadcn.com/)** - Beautiful component library
- **[Next.js Team](https://nextjs.org/)** - Amazing React framework
- **[Vercel](https://vercel.com/)** - Deployment platform

---

**Built with ❤️ for the AI community by [IntelPedia](https://intelpedia.tech)**
