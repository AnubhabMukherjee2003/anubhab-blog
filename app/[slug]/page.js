import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  try {
    const { slug } = await params
    console.log('Trying to load:', slug)
    
    // Dynamic import with better error handling
    const { default: Post, metadata } = await import(`@/markdown/${slug}.mdx`)
    
    return (
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Blog
          </Link>
        </nav>
        
        <article className="prose prose-lg max-w-none">
          {metadata && (
            <header className="mb-8 pb-6 border-b border-gray-200">
              <h1 className="text-4xl font-bold mb-4">{metadata.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span>{metadata.publishDate}</span>
              </div>
              <p className="text-xl text-gray-700 mt-4">{metadata.description}</p>
            </header>
          )}
          <Post />
        </article>
      </div>
    )
  } catch (error) {
    console.error('Error loading MDX file:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Blog
          </Link>
        </nav>
        
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-600">Error Loading Post</h1>
          <p className="mt-4 text-gray-600">
            Could not load the requested post: {error.message}
          </p>
          <details className="mt-4">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {error.stack}
            </pre>
          </details>
        </div>
      </div>
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
    const { metadata } = await import(`@/markdown/${params.slug}.mdx`);
    return {
      title: metadata.title,
      description: metadata.description,
    };
  } catch (error) {
    notFound();
  }
}
