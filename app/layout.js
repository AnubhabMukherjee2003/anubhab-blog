import "./globals.css";

export const metadata = {
  title: "Thoughts | Your Blog",
  description: "Writing about design, development, the web industry, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
