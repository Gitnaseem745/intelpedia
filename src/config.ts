const buildConfig = () => {
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID;
  if (!blogId) throw new Error("NEXT_PUBLIC_BLOG_ID is missing");
  
  const name = process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME || "Intelpedia";
  const copyright = process.env.NEXT_PUBLIC_BLOG_COPYRIGHT || "Intelpedia";
  const defaultTitle = process.env.NEXT_DEFAULT_METADATA_DEFAULT_TITLE || "Intelpedia - Your Source for Knowledge";
  const defaultDescription = process.env.NEXT_PUBLIC_BLOG_DESCRIPTION || "Welcome to Intelpedia - Your source for technology insights and digital innovation.";

  return {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    blog: {
      name,
      copyright,
      metadata: {
        title: {
          absolute: defaultTitle,
          default: defaultTitle,
          template: `%s - ${name}`,
        },
        description: defaultDescription,
      },
    },
    ogImageSecret:
      process.env.OG_IMAGE_SECRET ||
      "secret_used_for_signing_and_verifying_the_og_image_url",
    wisp: {
      blogId,
    },
  };
};

export const config = buildConfig();
