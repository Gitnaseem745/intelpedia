# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 🚨 For Critical/High Severity Issues:
- **DO NOT** create a public issue
- Email directly to: security@intelpedia.tech (or create a private security issue)
- Include detailed description and steps to reproduce
- We will respond within 24-48 hours

### 📝 For Low/Medium Severity Issues:
- Create an issue with the "security" label
- Provide clear description of the vulnerability
- Include potential impact assessment

## Security Best Practices

### For Contributors:
- Never commit sensitive data (API keys, passwords, tokens)
- Use environment variables for all secrets
- Follow secure coding practices
- Keep dependencies updated

### For Users/Deployers:
- Use strong, unique passwords for admin access
- Rotate API keys and secrets regularly
- Keep MongoDB connection secure
- Use HTTPS in production
- Regularly update dependencies

## Common Security Considerations

### Environment Variables
Always use `.env.local` for sensitive configuration:
```bash
# ❌ Never commit these
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
GITHUB_TOKEN=github_pat_xxxxx
JWT_SECRET=your-secret-key

# ✅ Use example templates instead
MONGODB_URI=your_mongodb_connection_string
GITHUB_TOKEN=your_github_token
JWT_SECRET=your_jwt_secret
```

### Admin Authentication
- Use strong passwords (minimum 12 characters)
- Consider implementing 2FA for production
- Regularly rotate admin credentials
- Monitor admin access logs

### API Security
- All API routes validate input using Zod schemas
- Rate limiting is implemented for abuse prevention
- CORS is properly configured
- Input sanitization prevents XSS attacks

### Database Security
- MongoDB connection uses authentication
- Input validation prevents injection attacks
- Sensitive data is properly hashed (passwords)
- Regular backups recommended

## Disclosure Timeline

1. **Day 0**: Vulnerability reported
2. **Day 1-2**: Initial response and assessment
3. **Day 3-7**: Investigation and fix development
4. **Day 7-14**: Testing and validation
5. **Day 14+**: Public disclosure (after fix is deployed)

## Security Updates

Security updates will be:
- Released as patch versions
- Announced in release notes
- Documented in CHANGELOG
- Communicated via GitHub Security Advisories

## Contact

For security-related questions or concerns:
- Security Issues: Create a private security advisory on GitHub
- General Questions: Use GitHub Discussions with "security" tag
- Response Time: 24-48 hours for critical issues

Thank you for helping keep IntelPedia secure! 🔒
