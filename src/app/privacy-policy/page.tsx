import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy - AI Tools Blog | Intelpedia",
    description: "Privacy policy for Intelpedia - your trusted source for AI tools, image generation techniques, prompting strategies, and artificial intelligence news and tutorials.",
    keywords: ["privacy policy", "AI tools blog", "artificial intelligence", "AI image generation", "AI prompting", "data protection"],
    openGraph: {
      title: "Privacy Policy - AI Tools Blog",
      description: "Privacy policy for Intelpedia - your trusted source for AI tools and artificial intelligence content.",
      url: `${config.baseUrl}/privacy-policy`,
      siteName: "Intelpedia",
      type: "website",
      images: [
        signOgImageUrl({
          title: "Privacy Policy",
          label: "AI Tools Blog",
          brand: config.blog.name,
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy - AI Tools Blog",
      description: "Privacy policy for Intelpedia - your trusted source for AI tools and artificial intelligence content.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const PrivacyPolicyPage = () => {
  const lastUpdated = "June 24, 2025";
  
  return (
    <div className="min-h-screen">      
      <div className="container mx-auto px-5 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Your privacy is important to us. This policy explains how we handle your information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <h2>1. Information We Collect</h2>
            <h3>Automatically Collected Information</h3>
            <ul>
              <li><strong>Analytics Data:</strong> We use analytics tools to understand how visitors interact with our site, including page views, time spent, and general location data.</li>
              <li><strong>Cookies:</strong> We use cookies to enhance your browsing experience and remember your preferences.</li>
              <li><strong>Server Logs:</strong> Our servers automatically log IP addresses, browser types, and referral URLs for security and performance purposes.</li>
            </ul>

            <h3>Information You Provide</h3>
            <ul>
              <li><strong>Comments:</strong> If you leave comments on our blog posts, we collect the information you provide.</li>
              <li><strong>Contact Information:</strong> When you contact us via email, we collect your email address and message content.</li>
              <li><strong>Newsletter Subscription:</strong> If you subscribe to our RSS feed or newsletter, we collect your email address.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information for:</p>
            <ul>
              <li>Providing and improving our blog content and user experience</li>
              <li>Responding to your comments and inquiries</li>
              <li>Analyzing website usage to improve our services</li>
              <li>Sending you updates if you&apos;ve subscribed (you can unsubscribe anytime)</li>
              <li>Preventing spam and maintaining website security</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in these circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> We may share data with trusted service providers who help us operate our website (hosting, analytics, etc.)</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In the event of a merger or sale of our website, user information may be transferred</li>
            </ul>

            <h2>4. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Provide personalized content recommendations</li>
              <li>Enable social media sharing features</li>
            </ul>
            <p>You can control cookies through your browser settings. Disabling cookies may affect some website functionality.</p>

            <h2>5. Third-Party Services</h2>
            <p>Our website may include links to third-party websites and services, including:</p>
            <ul>
              <li><strong>Social Media Platforms:</strong> For content sharing</li>
              <li><strong>Analytics Services:</strong> For website performance monitoring</li>
              <li><strong>Advertising Networks:</strong> For displaying relevant advertisements</li>
              <li><strong>Content Delivery Networks:</strong> For faster website loading</li>
            </ul>
            <p>These third parties have their own privacy policies, and we are not responsible for their practices.</p>

            <h2>6. Data Security</h2>
            <p>We implement appropriate security measures to protect your information, including:</p>
            <ul>
              <li>SSL encryption for data transmission</li>
              <li>Regular security updates and monitoring</li>
              <li>Access controls and authentication measures</li>
              <li>Regular backups and data protection protocols</li>
            </ul>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request information about the data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from communications at any time</li>
            </ul>

            <h2>8. Children&apos;s Privacy</h2>
            <p>Our website is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>

            <h2>9. International Users</h2>
            <p>Our website is hosted and operated from India. If you are accessing our site from outside India, please be aware that your information may be transferred to, stored, and processed in India where our servers are located.</p>

            <h2>10. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this policy periodically.</p>

            <h2>11. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> contact@intelpedia.tech</li>
              <li><strong>Website:</strong> <a href="https://intelpedia.tech">https://intelpedia.tech</a></li>
              <li><strong>Address:</strong> India</li>
            </ul>

            <div className="bg-muted/50 rounded-lg p-6 mt-8">
              <h3 className="mt-0">Quick Summary</h3>
              <p className="mb-0">
                We respect your privacy, use minimal data collection, secure your information, 
                don&apos;t sell your data to third parties, and give you control over your information. 
                For detailed information, please read the full policy above.
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default PrivacyPolicyPage;
