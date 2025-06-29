import Link from "next/link";
import fs from "fs";
import path from "path";

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
      
      <main className="border border-[var(--border-color)] border-t-0 rounded-b-lg p-[var(--content-padding)]">
        <section className="max-w-[1200px] mx-auto px-[var(--content-padding)]">
          <div className="grid gap-6 md:grid-cols-[minmax(auto,10vw)_1fr] md:gap-[var(--content-padding)]">
            {Object.entries(postsByYear)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .flatMap(([year, posts]) => [
                <h2 
                  key={`year-${year}`} 
                  className="mt-0 mb-4 flex gap-2 items-center font-sans text-sm font-semibold text-[var(--accent-color)] col-span-1 uppercase tracking-wider md:after:content-[''] md:after:flex-1 md:after:h-px md:after:block md:after:bg-[var(--border-color)] md:after:ml-4 max-md:col-span-full max-md:after:content-[''] max-md:after:flex-1 max-md:after:h-px max-md:after:block max-md:after:bg-[var(--border-color)] max-md:after:ml-4 max-md:text-xs max-md:mb-3"
                >
                  {year}
                </h2>,
                ...posts.map((post) => (
                  <div 
                    key={post.slug} 
                    className="mt-0 mb-2 py-3 border-b border-transparent transition-all duration-200 ease-in-out hover:border-[var(--border-color)] hover:translate-x-1 col-span-1 md:col-start-2 max-md:col-span-full max-md:py-2 max-md:mb-1"
                  >
                    <Link 
                      href={`/${post.slug}`} 
                      className="font-medium leading-[1.3] text-lg block transition-colors duration-200 ease-in-out text-[var(--text-color)] hover:text-[var(--accent-color)] max-md:text-base"
                    >
                      <span className="relative before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-0 before:h-0.5 before:bg-[var(--accent-color)] before:transition-all before:duration-300 before:ease-in-out hover:before:w-full">
                        {post.title}
                      </span>
                    </Link>
                    <span className="block text-xs text-[var(--accent-color)] mt-1">
                      {formatDate(post.publishDate)}
                    </span>
                  </div>
                ))
              ])}
          </div>
        </section>
      </main>
      
      <footer className="mt-8 py-4 text-center text-sm text-[var(--accent-color)]">
        <p>© {new Date().getFullYear()} Your Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}
