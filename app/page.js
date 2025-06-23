import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";

// Function to check if metadata has required blog fields
function isBlogHeaderData(metadata) {
  return (
    metadata &&
    typeof metadata.title === 'string' &&
    typeof metadata.description === 'string' &&
    typeof metadata.publishDate === 'string'
  );
}

// Function to get all blog posts from markdown folder
export async function getBlogPosts() {
  const contentDirPath = path.join(process.cwd(), "markdown");
  const mdxFiles = fs
    .readdirSync(contentDirPath, { withFileTypes: true })
    .filter((file) => file.isFile() && file.name.endsWith('.mdx'))
    .map((file) => file.name.replace('.mdx', ''));

  const blogs = await Promise.all(
    mdxFiles.map(async (fileName) => {
      console.log(`@/markdown/${fileName}.mdx`);
      try {
        const { metadata } = await import(`@/markdown/${fileName}.mdx`);

        if (isBlogHeaderData(metadata)) {
          return { ...metadata, slug: fileName };
        }

        throw new Error(`Blog metadata missing in ${fileName}.mdx!`);
      } catch (error) {
        console.error(`Error loading ${fileName}.mdx:`, error);
        // Return a fallback metadata object
        return {
          title: fileName,
          description: `Blog post: ${fileName}`,
          slug: fileName,
          publishDate: "Unknown"
        };
      }
    })
  );

  return blogs;
}

export default async function Page() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to the MDX Blog</h1>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Blog Posts:</h2>
        
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <Link 
              key={post.slug}
              href={`/${post.slug}`} 
              className="block p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
            >
              <h3 className="text-xl font-medium mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-3">{post.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{post.publishDate}</span>
                <span className="text-sm text-blue-600 font-medium">Read more →</span>
              </div>
            </Link>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <p className="text-gray-500 text-center py-8">No blog posts found.</p>
        )}
      </div>
    </div>
  );
}
