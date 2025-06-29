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
      <div className="w-full min-h-screen p-[clamp(0.5rem,3vw,2rem)] ">
        <header className="border border-white rounded-t-lg p-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center mb-4 text-gray-400 font-medium transition-colors duration-200 hover:text-white no-underline focus:outline-2 focus:outline-gray-400 focus:outline-offset-2"
          >
            ← Back to Thoughts
          </Link>
        </header>
        
        <main className="border border-[#444] min-h-[75vh] border-t-0 rounded-b-lg p-4">
          <section className="max-w-4xl mx-auto px-4">
            <article>
              {metadata && (
                <header className="mb-8 pb-6 border-b border-gray-600">
                  <div className="font-mono text-sm text-gray-400 mb-2">{formatDate(metadata.publishDate)}</div>
                  <h1 className="font-semibold leading-[1.2] mb-4 text-white text-3xl">{metadata.title}</h1>
                  <p className="mb-4 text-gray-400 text-lg">{metadata.description}</p>
                </header>
              )}
              <div className="max-w-none text-base leading-relaxed prose-content">
                <Post />
              </div>
            </article>
          </section>
        </main>
        
        <footer className="mt-8 py-4 text-center text-sm text-gray-400">
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
