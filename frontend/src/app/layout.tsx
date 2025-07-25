import type { Metadata } from "next";
import { Montserrat, Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/lib/providers";
import Layout from "@/components/Layouts/Layout";
import Toast from "@/components/UI/Toast";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const kantumruy = Kantumruy_Pro({
  variable: "--font-kantumruy",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dubai Smart Accommodation - Find Your Perfect Home",
  description: "Discover the perfect accommodation in Dubai through Dubai Smart Accommodation (DSA). Connect with property owners and service providers for a seamless living experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${kantumruy.variable} antialiased text-black dark:text-white flex flex-col min-h-dvh`}
      >
        <ReduxProvider>
          <Toast />
          <Layout>
            {children}
          </Layout>
        </ReduxProvider>
      </body>
    </html>
  );
}
