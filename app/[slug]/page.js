import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import formatDate from '@/lib/formatdate';

export default async function Page({ params }) {
  try {
    const { slug } = await params
    const mdxModule = await import(`../../markdown/${slug}.mdx`);
    const { default: Post, metadata } = mdxModule;
    
    return (
      <div className="w-full min-h-screen p-[clamp(0.5rem,3vw,2rem)] font-['Inter',system-ui,'Segoe_UI',Roboto,sans-serif] text-base font-light leading-relaxed text-[var(--text-color)] bg-[var(--bg-color)]">
        <header className="border border-[var(--border-color)] rounded-t-lg p-8 text-center bg-[var(--bg-color)]">
          <Link 
            href="/" 
            className="inline-flex items-center mb-4 text-[var(--accent-color)] font-medium transition-colors duration-200 hover:text-[var(--text-color)] no-underline focus:outline-2 focus:outline-[var(--accent-color)] focus:outline-offset-2"
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
                  <h1 className="font-semibold leading-[1.2] mb-4 text-[var(--text-color)]" style={{ fontSize: 'var(--font-3xl)' }}>{metadata.title}</h1>
                  <p className="mb-4 text-[var(--accent-color)]" style={{ fontSize: 'var(--font-lg)' }}>{metadata.description}</p>
                </header>
              )}
              <div className="max-w-none text-base leading-relaxed prose-content">
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
