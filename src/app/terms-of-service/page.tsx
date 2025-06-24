import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms of Service - AI Tools Blog | Intelpedia",
    description: "Terms of service for Intelpedia - your comprehensive guide to AI tools, image generation techniques, prompting strategies, and artificial intelligence news.",
    keywords: ["terms of service", "AI tools blog", "artificial intelligence", "AI image generation", "AI prompting", "blog terms"],
    openGraph: {
      title: "Terms of Service - AI Tools Blog",
      description: "Terms of service for Intelpedia - your comprehensive guide to AI tools and artificial intelligence content.",
      url: `${config.baseUrl}/terms-of-service`,
      siteName: "Intelpedia",
      type: "website",
      images: [
        signOgImageUrl({
          title: "Terms of Service",
          label: "AI Tools Blog",
          brand: config.blog.name,
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Terms of Service - AI Tools Blog",
      description: "Terms of service for Intelpedia - your comprehensive guide to AI tools and artificial intelligence content.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const TermsOfServicePage = () => {
  const lastUpdated = "June 24, 2025";
  
  return (
    <div className="min-h-screen">
      
      <div className="container mx-auto px-5 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using our website and services.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Intelpedia (&quot;the Website&quot;), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2>2. Website Description</h2>
            <p>
              Intelpedia is a technology blog focused on artificial intelligence, AI tools, AI image generation, 
              AI prompting techniques, AI advancement news, and related technology topics. We provide educational 
              content, tutorials, reviews, and insights about AI and emerging technologies.
            </p>

            <h2>3. User Conduct</h2>
            <h3>Acceptable Use</h3>
            <p>You agree to use our website only for lawful purposes and in a way that does not infringe the rights of others. You must not:</p>
            <ul>
              <li>Post offensive, defamatory, or inappropriate content in comments</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to scrape our content without permission</li>
              <li>Spread malware, viruses, or other harmful code</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate others or provide false information</li>
              <li>Spam or abuse our contact forms or comment systems</li>
            </ul>

            <h3>Comments and User Content</h3>
            <p>When you post comments or other content on our website, you:</p>
            <ul>
              <li>Grant us the right to use, modify, and display your content</li>
              <li>Confirm that your content is original or properly attributed</li>
              <li>Take responsibility for the accuracy and legality of your content</li>
              <li>Agree to our moderation policies</li>
            </ul>

            <h2>4. Intellectual Property Rights</h2>
            <h3>Our Content</h3>
            <p>All content on Intelpedia, including articles, images, designs, and code, is protected by copyright and other intellectual property laws. You may:</p>
            <ul>
              <li><strong>Read and Share:</strong> View and share our content for personal, non-commercial use</li>
              <li><strong>Link:</strong> Link to our articles from other websites</li>
              <li><strong>Quote:</strong> Quote small portions of our content with proper attribution</li>
            </ul>

            <h3>Prohibited Uses</h3>
            <p>You may not:</p>
            <ul>
              <li>Republish our content without permission</li>
              <li>Use our content for commercial purposes without a license</li>
              <li>Remove copyright notices or attribution</li>
              <li>Claim our content as your own work</li>
            </ul>

            <h2>5. Disclaimers and Limitations</h2>
            <h3>Content Accuracy</h3>
            <p>
              While we strive to provide accurate and up-to-date information about AI tools and technologies, 
              we make no warranties about the completeness, reliability, or accuracy of this information. 
              Technology evolves rapidly, and information may become outdated.
            </p>

            <h3>AI Tool Reviews and Recommendations</h3>
            <p>
              Our reviews and recommendations about AI tools are based on our experience and research. 
              Results may vary, and we encourage you to evaluate tools based on your specific needs. 
              We may receive compensation for some recommendations, which will be clearly disclosed.
            </p>

            <h3>External Links</h3>
            <p>
              Our website contains links to external websites and AI tools. We are not responsible for 
              the content, privacy policies, or practices of these external sites. Use them at your own discretion.
            </p>

            <h2>6. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our <a href="/privacy-policy">Privacy Policy</a> 
              to understand how we collect, use, and protect your information.
            </p>

            <h2>7. Advertising and Affiliate Links</h2>
            <p>Our website may contain:</p>
            <ul>
              <li><strong>Display Advertisements:</strong> From advertising networks</li>
              <li><strong>Affiliate Links:</strong> We may earn commissions from purchases made through our links</li>
              <li><strong>Sponsored Content:</strong> Clearly marked sponsored posts or reviews</li>
            </ul>
            <p>All affiliate relationships and sponsored content will be clearly disclosed.</p>

            <h2>8. Age Restrictions</h2>
            <p>
              Our website is intended for users aged 13 and older. Users under 18 should have parental 
              supervision when using AI tools or services mentioned on our site.
            </p>

            <h2>9. Modifications to Service</h2>
            <p>We reserve the right to:</p>
            <ul>
              <li>Modify or discontinue any part of our website</li>
              <li>Update these terms of service</li>
              <li>Change our content policies</li>
              <li>Suspend or terminate user access for violations</li>
            </ul>
            <p>We will notify users of significant changes through our website or email.</p>

            <h2>10. Liability Limitations</h2>
            <p>
              Intelpedia and its authors shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including loss of profits, data, or use, incurred by you 
              or any third party, whether in an action of contract or tort, arising from your use of the website 
              or any AI tools or services mentioned on our site.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India, 
              without regard to its conflict of law provisions. Any legal action or proceeding arising 
              under these terms will be brought exclusively in the courts of India.
            </p>

            <h2>12. Contact Information</h2>
            <p>If you have questions about these terms of service, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> contact@intelpedia.tech</li>
              <li><strong>Website:</strong> <a href="https://intelpedia.tech">https://intelpedia.tech</a></li>
              <li><strong>Address:</strong> India</li>
            </ul>

            <h2>13. Severability</h2>
            <p>
              If any provision of these terms is found to be unenforceable or invalid, that provision 
              will be limited or eliminated to the minimum extent necessary so that the rest of the 
              terms will remain in full force and effect.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 mt-8">
              <h3 className="mt-0">Quick Summary</h3>
              <p className="mb-0">
                Use our site respectfully, don&apos;t copy our content without permission, 
                understand that AI information changes rapidly, we may earn from recommendations, 
                and we&apos;re not responsible for external AI tools or their outcomes. 
                For complete terms, please read the full agreement above.
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default TermsOfServicePage;
