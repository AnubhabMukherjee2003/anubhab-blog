import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Thoughts | Your Blog",
  description: "Writing about design, development, the web industry, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.getItem("user-color-scheme") !== null) {
                document.documentElement.setAttribute("data-user-color-scheme", localStorage.getItem("user-color-scheme"));
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} thoughts`}>
        {children}
      </body>
    </html>
  );
}
