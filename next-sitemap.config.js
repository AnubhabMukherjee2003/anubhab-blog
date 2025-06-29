// next-sitemap.config.js
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://anubhab-blog.vercel.app/",
  generateRobotsTxt: true, // (Optional) Generates a robots.txt file
  sitemapSize: 7000, // Number of URLs per sitemap file
}