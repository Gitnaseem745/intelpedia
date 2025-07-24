import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import Markdown from "react-markdown";
import type { Person, WithContext } from "schema-dts";

const content = `# About Me

Hey, I'm Naseem – the creator behind **Intelpedia**, a digital space where curiosity meets clarity.

I'm a 20-something Indian web developer, lifelong learner, and tech enthusiast who's always had one foot in creativity and the other in logic. After years of exploring code, design, blogging, and the evolving world of AI, I realized I wanted to build more than just websites — I wanted to build **a knowledge ecosystem**.

That's how Intelpedia was born: a blog crafted not only to **share insights** into the future of AI, tech tools, and digital creativity, but to **simplify complex ideas** into practical, everyday understanding. Whether it's demystifying AI prompts, exploring new tools, or helping creators grow smarter with technology — this site is for learners, doers, and dreamers.

> 📌 On Intelpedia, I aim to deliver:
> - Actionable content for creators and tech enthusiasts
> - SEO-friendly guides on AI, productivity, and digital tools
> - Honest insights, free resources, and personal experiments

### Why I Blog

I believe the internet is a canvas for anyone willing to create. Blogging is my way of documenting my learning, experimenting publicly, and offering value to those on similar journeys — whether you're a student, a side hustler, or a full-time creator. Every article is written with care and a touch of realism, because I'm walking the same path.

This isn't just another blog. It's my open notebook — a place where ideas grow and evolve.

### Let's Connect

I'm always up for connecting with fellow creators, learners, and curious minds. Whether you're building, exploring, or just starting out, Intelpedia is your home for meaningful insights and creative thinking.

Thanks for stopping by.

**Stay curious,  
Naseem**

📍 _Founder, Intelpedia Blog_  
📧 _Email: contact@intelpedia.tech_  
🌐 _[intelpedia.tech](https://intelpedia.tech)_  
`;

export async function generateMetadata() {
  const ogImage = signOgImageUrl({
    title: "About Naseem",
    label: "AI Expert & Creator",
    brand: config.blog.name,
  });

  return {
    title: "About Naseem - AI Expert & Creator | Intelpedia",
    description: "Meet Naseem, AI enthusiast and creator behind Intelpedia. Expert in AI tools, ChatGPT prompting, Midjourney art, Stable Diffusion, and artificial intelligence tutorials.",
    keywords: [
      "Naseem", 
      "AI expert", 
      "AI enthusiast", 
      "ChatGPT expert", 
      "Midjourney artist", 
      "Stable Diffusion", 
      "AI prompting expert",
      "AI image generation", 
      "artificial intelligence blogger",
      "tech content creator",
      "web developer",
      "AI tools specialist"
    ],
    authors: [{ name: "Naseem", url: `${config.baseUrl}/about` }],
    creator: "Naseem",
    publisher: "Intelpedia",
    alternates: {
      canonical: `${config.baseUrl}/about`,
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
      title: "About Naseem - AI Expert & Creator",
      description: "Meet Naseem, AI enthusiast and creator behind Intelpedia. Expert in AI tools, prompting techniques, and image generation.",
      url: `${config.baseUrl}/about`,
      siteName: config.blog.name,
      locale: 'en_US',
      type: "profile",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "About Naseem - AI Expert and Creator",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "About Naseem - AI Expert & Creator",
      description: "Meet Naseem, AI enthusiast and creator behind Intelpedia.",
      creator: "@intelpedia",
      images: [ogImage],
    },
  };
}

export default function About() {
  const personSchema: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Naseem",
    jobTitle: "AI Expert & Content Creator",
    description: "AI enthusiast, web developer, and creator behind Intelpedia. Expert in AI tools, ChatGPT prompting, Midjourney art, and artificial intelligence tutorials.",
    url: `${config.baseUrl}/about`,
    sameAs: [
      config.baseUrl,
      "https://intelpedia.tech"
    ],
    worksFor: {
      "@type": "Organization",
      name: "Intelpedia",
      url: config.baseUrl
    },
    knowsAbout: [
      "Artificial Intelligence",
      "AI Tools",
      "ChatGPT",
      "Midjourney",
      "Stable Diffusion",
      "AI Prompting",
      "Web Development",
      "Content Creation"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@intelpedia.tech",
      contactType: "editorial"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="container mx-auto px-5 py-10">
        <article className="prose prose-lg dark:prose-invert max-w-3xl mx-auto">
          <Markdown>{content}</Markdown>
        </article>
      </div>
    </>
  );
}
