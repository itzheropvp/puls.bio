import type { Metadata } from "next";
import { Inter } from "next/font/google";
//@ts-ignore ~~ts nigga should fucking stop throwing random ahh errors.
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "../components/providers";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: ["400", "700"],
});
export const metadata: Metadata = {
  title: "puls.pw",
  description: "Create your personalized link hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <Providers>
          <Toaster 
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#1a1a1f',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
              },
              className: 'sonner-toast',
            }}
            richColors
          />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
