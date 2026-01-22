import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ClerkProvider } from '@clerk/nextjs'
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: "Clean Studio",
  description: "Buy cool products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider> 
      <html lang="en">
        <body className="flex min-h-full flex-col bg-white">
          <Navbar />
          <NextTopLoader 
            color="#000000"     
            height={2}          
            showSpinner={false} 
            shadow={false}      
            easing="ease"       
            speed={300}         
          />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider> 
  );
}
