import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import Markdown from "react-markdown";

const content = `# About Me

![Naseem](https://your-image-link.com/your-image.jpg)

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
📧 _Email: contact@intelpedia.in_  
🌐 _[intelpedia.in](https://intelpedia.in)_  
`;

export async function generateMetadata() {
  return {
    title: "About Me",
    description: "Learn more about Samantha and her travel adventures",
    openGraph: {
      title: "About Me",
      description: "Learn more about Samantha and her travel adventures",
      images: [
        signOgImageUrl({
          title: "Samantha",
          label: "About Me",
          brand: config.blog.name,
        }),
      ],
    },
  };
}

const Page = async () => {
  return (
    <div className="container mx-auto px-5">
      <Header />
      <div className="prose lg:prose-lg dark:prose-invert m-auto mt-20 mb-10 blog-content">
        <Markdown>{content}</Markdown>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
