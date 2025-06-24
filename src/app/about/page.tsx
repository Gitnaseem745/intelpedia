import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import Markdown from "react-markdown";

const content = `# About Me


Hey, I'm Naseem – the creator behind **Intelpedia**, a digital space where curiosity meets clarity.

I’m a 20-something Indian web developer, lifelong learner, and tech enthusiast who's always had one foot in creativity and the other in logic. After years of exploring code, design, blogging, and the evolving world of AI, I realized I wanted to build more than just websites — I wanted to build **a knowledge ecosystem**.

That’s how Intelpedia was born: a blog crafted not only to **share insights** into the future of AI, tech tools, and digital creativity, but to **simplify complex ideas** into practical, everyday understanding. Whether it's demystifying AI prompts, exploring new tools, or helping creators grow smarter with technology — this site is for learners, doers, and dreamers.

> 📌 On Intelpedia, I aim to deliver:
> - Actionable content for creators and tech enthusiasts
> - SEO-friendly guides on AI, productivity, and digital tools
> - Honest insights, free resources, and personal experiments

### Why I Blog

I believe the internet is a canvas for anyone willing to create. Blogging is my way of documenting my learning, experimenting publicly, and offering value to those on similar journeys — whether you're a student, a side hustler, or a full-time creator. Every article is written with care and a touch of realism, because I'm walking the same path.

This isn't just another blog. It's my open notebook — a place where ideas grow and evolve.

### Let’s Connect

I’m always up for connecting with fellow creators, learners, and curious minds. Whether you're building, exploring, or just starting out, Intelpedia is your home for meaningful insights and creative thinking.

Thanks for stopping by.

**Stay curious,  
Naseem**

📍 _Founder, Intelpedia Blog_  
📧 _Email: contact@intelpedia.tech_  
🌐 _[intelpedia.tech](https://intelpedia.tech)_  
`;

export async function generateMetadata() {
  return {
    title: "About Me - AI Expert & Creator | Intelpedia",
    description: "Meet Naseem, AI enthusiast and creator behind Intelpedia. Specializing in AI tools, prompting techniques, image generation with ChatGPT, Midjourney, and Stable Diffusion.",
    keywords: ["AI expert", "AI enthusiast", "ChatGPT expert", "Midjourney", "Stable Diffusion", "AI prompting", "AI image generation", "artificial intelligence"],
    openGraph: {
      title: "About Me - AI Expert & Creator",
      description: "Meet Naseem, AI enthusiast and creator behind Intelpedia. Specializing in AI tools, prompting techniques, and image generation.",
      url: `${config.baseUrl}/about`,
      siteName: "Intelpedia",
      type: "profile",
      images: [
        signOgImageUrl({
          title: "Naseem - AI Expert",
          label: "About Me",
          brand: config.blog.name,
        }),
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "About Me - AI Expert & Creator",
      description: "Meet Naseem, AI enthusiast and creator behind Intelpedia. Specializing in AI tools and prompting techniques.",
    },
  };
}

const Page = async () => {
  return (
    <div className="container mx-auto px-5">
      <div className="prose lg:prose-lg dark:prose-invert m-auto mt-20 mb-10 blog-content">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
};

export default Page;
