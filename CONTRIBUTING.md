# Contributing to IntelPedia

Thank you for your interest in contributing to IntelPedia! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env.local` and configure your environment variables
5. Start the development server: `npm run dev`

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use ESLint configuration provided
- Maintain consistent formatting
- Add JSDoc comments for public APIs

### Commit Messages
- Use clear, descriptive commit messages
- Follow conventional commits format when possible
- Example: `feat: add tool filtering by pricing model`

### Pull Requests
1. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes thoroughly
4. Commit your changes
5. Push to your fork
6. Create a pull request

### Testing
- Test all new features manually
- Ensure existing functionality is not broken
- Test responsive design on different screen sizes

## Types of Contributions

### 🐛 Bug Reports
- Use the issue template
- Include steps to reproduce
- Provide browser/environment details

### ✨ Feature Requests
- Describe the feature clearly
- Explain the use case
- Consider backward compatibility

### 📖 Documentation
- Improve existing documentation
- Add missing documentation
- Fix typos and grammar

### 🛠️ Code Contributions
- New features
- Bug fixes
- Performance improvements
- Refactoring

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (local or cloud)

### Environment Setup
1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

2. Configure your MongoDB connection
3. Set up Wisp CMS blog ID (optional for development)
4. Configure GitHub token for image uploads (optional)

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Celebrate diverse perspectives

## Questions?

Feel free to open an issue for:
- Questions about the codebase
- Feature discussions
- General help

Thank you for contributing to IntelPedia! 🚀
