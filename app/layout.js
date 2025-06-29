import "./globals.css";

export const metadata = {
  title: "Thoughts | Anubhab's Blog",
  description: "Writing about development, my journey, and more.",
  keywords: [
    "Anubhab Mukherjee", "Anubhab Mukherjee Blog", "Anubhab Mukherjee Thought",
    "Anubhab Mukherjee Thoughts", "Anubhab Mukherjee Design", "Anubhab Mukherjee Development",
    "Anubhab Mukherjee Web", "Anubhab Mukherjee Web Design", "Anubhab Mukherjee Web Development",
    "Anubhab Mukherjee Frontend", "Anubhab Mukherjee Frontend Development", "Anubhab Mukherjee Frontend Design",
    "Anubhab Mukherjee UI/UX", "Anubhab Mukherjee UI/UX Design", "Anubhab Mukherjee UI/UX Development"
  ],
  openGraph: {
    title: "Thoughts | Anubhab's Blog",
    description: "Writing about development, my journey, and more.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://anubhab-blog.vercel.app/",
    siteName: "Anubhab's Blog",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://anubhab-blog.vercel.app/"}og-image.png`,
        width: 1200,
        height: 630,
        alt: "Anubhab's Blog OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thoughts | Anubhab's Blog",
    description: "Writing about development, my journey, and more.",
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://anubhab-blog.vercel.app/"}og-image.png`
    ],
    creator: "@Anubhab621",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
