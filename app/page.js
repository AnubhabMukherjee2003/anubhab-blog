import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";
import './page.css';
import ThemeToggle from "./theme-toggle";


function isBlogHeaderData(metadata) { // Function to check if metadata has required blog fields
  return (
    metadata &&
    typeof metadata.title === 'string' &&
    typeof metadata.description === 'string' &&
    typeof metadata.publishDate === 'string'
  );
}
export async function getBlogPosts() { // Function to get all blog posts from markdown folder
  const contentDirPath = path.join(process.cwd(), "markdown");
  const mdxFiles = fs
    .readdirSync(contentDirPath, { withFileTypes: true })
    .filter((file) => file.isFile() && file.name.endsWith('.mdx'))
    .map((file) => file.name.replace('.mdx', ''));

  const blogs = await Promise.all(
    mdxFiles.map(async (fileName) => {
      try {
        // First try relative path
        const mdxModule = await import(`../markdown/${fileName}.mdx`);
        const { metadata } = mdxModule;

        if (isBlogHeaderData(metadata)) {
          return { ...metadata, slug: fileName };
        }
        
        console.log("Imported but no valid metadata:", fileName, Object.keys(mdxModule));
        throw new Error(`Blog metadata missing in ${fileName}.mdx!`);
      } catch (error) {
        console.error(`Error loading ${fileName}.mdx:`, error);
        return { // Return a fallback metadata object
          title: fileName,
          description: `Blog post: ${fileName}`,
          slug: fileName,
          publishDate: "Unknown"
        };
      }
    })
  );

  // Sort posts by date (newest first)
  const sortedBlogs = blogs.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

  return sortedBlogs;
}

export default async function Page() {
  const blogPosts = await getBlogPosts();

  // Function to format date as ddmmyy - simplified for ISO dates
  const formatDate = (dateString) => {
    if (dateString === "Unknown") return "??????";
    
    try {
      // Create date object - works for ISO format "YYYY-MM-DD"
      const date = new Date(dateString);
      
      // Check if date is valid
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}${month}${year}`;
      }
      
      console.warn(`Could not parse date: ${dateString}`);
      return dateString;
    } catch (error) {
      console.error(`Error formatting date: ${dateString}`, error);
      return dateString;
    }
  };

  return (
    <>
      <ThemeToggle />
      <header className="header-main thoughts">
        <h1 className="ascii-logo">
            <pre>{`████████╗██╗  ██╗ ██████╗ ██╗   ██╗ ██████╗ ██╗  ██╗████████╗███████╗
╚══██╔══╝██║  ██║██╔═══██╗██║   ██║██╔════╝ ██║  ██║╚══██╔══╝██╔════╝
   ██║   ███████║██║   ██║██║   ██║██║  ███╗███████║   ██║   ███████╗
    ██║   ██╔══██║██║   ██║██║   ██║██║   ██║██║   ██║   ██║   ╚════██║
   ██║   ██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝██║  ██║   ██║   ███████║
   ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝`}</pre>
        </h1>
    </header>
    <main className="main-content">
      <section className="content">
        <div className="thoughts-list">
          {blogPosts.map((post) => (
            <div key={post.slug} className="thought-item">
              <div className="dateline">{formatDate(post.publishDate)}</div>
              <div className="thought">
                <Link href={`/${post.slug}`} className="thought-title">
                  <span>{post.title}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
    <footer className="footer-main">
      <p>© 2025 Your Blog. All rights reserved.</p>
    </footer>
    </>
  );
}
