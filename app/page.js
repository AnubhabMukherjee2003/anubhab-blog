import Link from "next/link";
import fs from "fs";
import path from "path";
import { Fragment } from "react";

import Header from "@/components/Header";
import formatDate from '@/lib/formatdate'; 
import "./page.css"; 

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

  // Group posts by year
  const postsByYear = blogPosts.reduce((acc, post) => {
    const year = new Date(post.publishDate).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  return (
    <div className="thoughts">
      <Header />
      
      <main className="main-content">
        <section className="content">
          <div className="thoughts-list">
            {Object.entries(postsByYear)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .flatMap(([year, posts]) => [
                <h2 key={`year-${year}`} className="dateline">
                  {year}
                </h2>,
                ...posts.map((post) => (
                  <div key={post.slug} className="thought">
                    <Link href={`/${post.slug}`} className="thought-title">
                      <span>
                        {post.title}
                      </span>
                    </Link>
                    <span className="thought-date">
                      {formatDate(post.publishDate)}
                    </span>
                  </div>
                ))
              ])}
          </div>
        </section>
      </main>
      
      <footer className="footer-main">
        <p>© {new Date().getFullYear()} Your Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}
