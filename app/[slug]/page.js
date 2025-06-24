import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ThemeToggle from "../theme-toggle";
import '../page.css';
import './page.css';

export default async function Page({ params }) {
  try {
    const { slug } = await params
    // Dynamic import with better error handling
    const mdxModule = await import(`../../markdown/${slug}.mdx`);
    const { default: Post, metadata } = mdxModule;
    
    // Format the date in ddmmyy format for consistency
    const formatDate = (dateString) => {
  try {
    if (dateString === "Unknown") return "??????";
    
    // Create date object - works for ISO format "YYYY-MM-DD"
    const date = new Date(dateString);
    
    // Check if date is valid
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}${month}${year}`;
    }
    
    // If we get here, the date was invalid
    console.warn(`Could not parse date: ${dateString}`);
    return "??????";  // Fallback for unparseable dates
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return "??????";  // Fallback for any errors
  }
};
    
    return (
      <>
        <ThemeToggle />
        <header className="header-main">
          <Link 
            href="/" 
            className="back-link"
          >
            ← Back to Thoughts
          </Link>
        </header>
        
        <main className="main-content">
          <section className="content">
            <article className="post-content">
              {metadata && (
                <header className="post-header">
                  <div className="dateline">{formatDate(metadata.publishDate)}</div>
                  <h1 className="post-title">{metadata.title}</h1>
                  <p className="post-description">{metadata.description}</p>
                </header>
              )}
              <div className="post-body">
                <Post />
              </div>
            </article>
          </section>
        </main>
        <footer className="footer-main">
          <p>© 2025 Your Blog. All rights reserved.</p>
        </footer>
      </>
    )
  } catch (error) {
    console.error('Error loading MDX file:', error)
    return (
      <>
        <ThemeToggle />
        <header className="header-main">
          <Link 
            href="/" 
            className="back-link"
          >
            ← Back to Thoughts
          </Link>
        </header>
        
        <main className="main-content">
          <section className="content">
            <div className="error-container">
              <h1 className="error-title">Error Loading Post</h1>
              <p className="error-message">
                Could not load the requested post: {error.message}
              </p>
              <details className="error-details">
                <summary>Error Details</summary>
                <pre className="error-stack">
                  {error.stack}
                </pre>
              </details>
            </div>
          </section>
        </main>
        <footer className="footer-main">
          <p>© 2025 Your Blog. All rights reserved.</p>
        </footer>
      </>
    )
  }
}

// Generate static params for known routes
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'markdown');
  const filenames = fs.readdirSync(postsDirectory);
 
  return filenames.map((filename) => ({
    slug: filename.replace(/\.mdx$/, ''),
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const mdxModule = await import(`../../markdown/${slug}.mdx`);
    const { metadata } = mdxModule;
    return {
      title: metadata.title,
      description: metadata.description,
    };
  } catch (error) {
    notFound();
  }
}
