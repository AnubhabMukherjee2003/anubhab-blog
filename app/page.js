import Link from "next/link";
import fs from "fs";
import path from "path";
import { Fragment } from "react";

import Header from "@/components/Header";
import formatDate from '@/lib/formatdate'; 

export async function getBlogPosts() {
  // Function to get all blog posts from markdown folder
  const contentDirPath = path.join(process.cwd(), "markdown");
  const mdxFiles = fs
    .readdirSync(contentDirPath, { withFileTypes: true })
    .filter((file) => file.isFile() && file.name.endsWith(".mdx"))
    .map((file) => file.name.replace(".mdx", ""));

  const blogs = await Promise.all(
    mdxFiles.map(async (fileName) => {
      try {
        const mdxModule = await import(`../markdown/${fileName}.mdx`); // First try relative path
        const { metadata } = mdxModule;

        if (
          metadata &&
          typeof metadata.title === "string" &&
          typeof metadata.description === "string" &&
          typeof metadata.publishDate === "string"
        ) {
          return { ...metadata, slug: fileName };
        }

        console.log(
          "Imported but no valid metadata:",
          fileName,
          Object.keys(mdxModule)
        );
        throw new Error(`Blog metadata missing in ${fileName}.mdx!`);
      } catch (error) {
        console.error(`Error loading ${fileName}.mdx:`, error);
        return {
          // Return a fallback metadata object
          title: fileName,
          description: `Blog post: ${fileName}`,
          slug: fileName,
          publishDate: "Unknown",
        };
      }
    })
  );

  // Sort posts by date (newest first)
  const sortedBlogs = blogs.sort(
    (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
  );
  return sortedBlogs;
}

export default async function Page() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="min-h-screen flex flex-col w-full p-[clamp(0.5rem,3vw,2rem)]">
      <header className="flex-none" style={{ flexBasis: '20%' }}>
        <Header />
      </header>
      <main className="flex-1 border border-[#444] " style={{ flexBasis: '70%' }}>
        <div className="border-t-0 rounded-b-lg p-4 h-full flex flex-col">
          <section className="max-w-3xl mx-auto px-2 sm:px-6 flex-1 flex flex-col justify-center">
            <div className="grid gap-2 md:grid-cols-[minmax(80px,10vw)_1fr] md:gap-6">
              {blogPosts.map((post) => (
                <Fragment key={post.slug}>
                  <span className="text-xs md:text-sm font-semibold text-[#999] uppercase tracking-wider pt-3 md:pt-4 md:pl-2 md:text-right md:col-span-1">
                    {formatDate(post.publishDate)}
                  </span>
                  <div className="py-2 md:py-4 border-b border-transparent md:col-span-1 group">
                    <Link
                      href={`/${post.slug}`}
                      className="block font-medium text-base md:text-lg text-white "
                    >
                      <span className="relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-0.5 after:bg-[#999] after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full">
                        {post.title}
                      </span>
                    </Link>
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
        </div>
      </main>
      <footer className="border border-[#444] flex-none mt-8 py-4 text-center text-xs text-[#999]" style={{ flexBasis: '10%' }}>
        <p>© {new Date().getFullYear()} Your Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}
