import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import formatDate from '@/lib/formatdate';
import "./page.css";

export default async function Page({ params }) {
  try {
    const { slug } = await params
    const mdxModule = await import(`../../markdown/${slug}.mdx`);
    const { default: Post, metadata } = mdxModule;
    
    return (
      <div className="w-full min-h-screen p-[clamp(0.5rem,3vw,2rem)] font-[Inter,system-ui,'Segoe_UI',Roboto,sans-serif] font-light leading-relaxed text-[var(--text-color)] bg-[var(--bg-color)]">
        <header className="border border-[var(--border-color)] rounded-t-lg p-8 text-center bg-[var(--bg-color)]">
          <Link 
            href="/" 
            className="inline-flex items-center mb-4 text-[var(--accent-color)] font-medium transition-colors duration-200 hover:text-[var(--text-color)]"
          >
            ← Back to Thoughts
          </Link>
        </header>
        
        <main className="border border-[var(--border-color)] border-t-0 rounded-b-lg p-[var(--content-padding)]">
          <section className="max-w-4xl mx-auto px-[var(--content-padding)]">
            <article>
              {metadata && (
                <header className="mb-8 pb-6 border-b border-[var(--border-color)]">
                  <div className="font-mono text-sm text-[var(--accent-color)] mb-2">{formatDate(metadata.publishDate)}</div>
                  <h1 className="text-3xl font-semibold my-2 mb-4 text-[var(--text-color)]">{metadata.title}</h1>
                  <p className="text-lg text-[var(--accent-color)] mb-4">{metadata.description}</p>
                </header>
              )}
              <div className="prose prose-lg max-w-none text-base leading-relaxed
                prose-headings:text-[var(--text-color)]
                prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4
                prose-h2:text-xl prose-h2:mt-7 prose-h2:mb-3
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                prose-p:mb-5 prose-p:text-[var(--text-color)]
                prose-ul:mb-5 prose-ul:pl-6 prose-ul:list-disc
                prose-ol:mb-5 prose-ol:pl-6 prose-ol:list-decimal
                prose-li:mb-2 prose-li:text-[var(--text-color)]
                prose-code:font-mono prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-md prose-pre:overflow-x-auto prose-pre:my-6 prose-pre:font-mono
                prose-blockquote:border-l-4 prose-blockquote:border-[var(--border-color)] prose-blockquote:pl-4 prose-blockquote:ml-0 prose-blockquote:mr-0 prose-blockquote:italic prose-blockquote:text-[var(--accent-color)]
                prose-a:text-[var(--accent-color)] prose-a:underline hover:prose-a:text-[var(--text-color)]
                prose-strong:text-[var(--text-color)] prose-strong:font-semibold
                prose-em:text-[var(--text-color)] prose-em:italic">
                <Post />
              </div>
            </article>
          </section>
        </main>
        
        <footer className="mt-8 py-4 text-center text-sm text-[var(--accent-color)]">
          <p>© 2025 Your Blog. All rights reserved.</p>
        </footer>
      </div>
    )
  } catch (error) {
    notFound();
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
