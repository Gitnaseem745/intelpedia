import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = signOgImageUrl({
    title: "Privacy Policy",
    label: "AI Tools Blog",
    brand: config.blog.name,
  });

  return {
    title: "Privacy Policy - AI Tools Blog | Intelpedia",
    description: "Privacy policy for Intelpedia - learn how we collect, use, and protect your personal information when using our AI tools and artificial intelligence content.",
    keywords: ["privacy policy", "data protection", "AI tools blog", "artificial intelligence", "user privacy", "data collection"],
    authors: [{ name: "Intelpedia" }],
    creator: "Intelpedia",
    publisher: "Intelpedia",
    alternates: {
      canonical: `${config.baseUrl}/privacy-policy`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: "Privacy Policy - AI Tools Blog",
      description: "Privacy policy for Intelpedia - learn how we collect, use, and protect your personal information.",
      url: `${config.baseUrl}/privacy-policy`,
      siteName: config.blog.name,
      locale: 'en_US',
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Intelpedia Privacy Policy",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Privacy Policy - AI Tools Blog",
      description: "Privacy policy for Intelpedia - learn how we collect, use, and protect your personal information.",
      creator: "@intelpedia",
      images: [ogImage],
    },
  };
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-5 py-10">
      <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>
        
        <h2>1. Introduction</h2>
        <p>
          Welcome to Intelpedia (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you visit our website and use our services 
          related to artificial intelligence tools, tutorials, and content.
        </p>

        <h2>2. Information We Collect</h2>
        
        <h3>Information You Provide</h3>
        <ul>
          <li><strong>Contact Information:</strong> Name, email address when you contact us or submit tools</li>
          <li><strong>User Content:</strong> Comments, tool submissions, and other content you provide</li>
          <li><strong>Communications:</strong> Messages you send us through contact forms or email</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <ul>
          <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns</li>
          <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
          <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
          <li><strong>Cookies:</strong> Small data files stored on your device for functionality and analytics</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Provide, maintain, and improve our website and services</li>
          <li>Process tool submissions and moderate content</li>
          <li>Respond to your comments, questions, and customer service requests</li>
          <li>Send you technical notices, updates, and administrative messages</li>
          <li>Monitor and analyze usage patterns to improve user experience</li>
          <li>Protect against fraudulent, unauthorized, or illegal activity</li>
        </ul>

        <h2>4. Information Sharing and Disclosure</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
        <ul>
          <li><strong>Service Providers:</strong> Third-party companies that help us operate our website</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
          <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
        </ul>

        <h2>5. Third-Party Services</h2>
        <p>Our website may use third-party services including:</p>
        <ul>
          <li><strong>Analytics:</strong> Google Analytics for website usage statistics</li>
          <li><strong>Advertising:</strong> Display ads and affiliate links</li>
          <li><strong>Social Media:</strong> Sharing buttons and embedded content</li>
          <li><strong>CDNs:</strong> Content delivery networks for performance</li>
        </ul>
        <p>These services have their own privacy policies governing their use of your information.</p>

        <h2>6. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your 
          personal information against unauthorized access, alteration, disclosure, or destruction. 
          However, no internet transmission is 100% secure.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes 
          outlined in this Privacy Policy, unless a longer retention period is required by law.
        </p>

        <h2>8. Your Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of your personal information</li>
          <li><strong>Correction:</strong> Request correction of inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Portability:</strong> Request transfer of your data</li>
          <li><strong>Objection:</strong> Object to certain processing activities</li>
        </ul>

        <h2>9. Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience. 
          You can control cookie settings through your browser preferences, but this may affect 
          website functionality.
        </p>

        <h2>10. Children&apos;s Privacy</h2>
        <p>
          Our services are not intended for children under 13. We do not knowingly collect 
          personal information from children under 13. If you become aware that a child has 
          provided personal information, please contact us.
        </p>

        <h2>11. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own. 
          We ensure appropriate safeguards are in place for such transfers.
        </p>

        <h2>12. Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. We will notify you of any material 
          changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
        </p>

        <h2>13. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <ul>
          <li><strong>Email:</strong> contact@intelpedia.tech</li>
          <li><strong>Website:</strong> <a href={config.baseUrl}>{config.baseUrl}</a></li>
        </ul>

        <h2>14. Governing Law</h2>
        <p>
          This Privacy Policy is governed by and construed in accordance with applicable data 
          protection laws and regulations.
        </p>
      </article>
    </div>
  );
}
