import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  Show,
  SignIn,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz app",
  description: "Paste an article, get a summary and a quiz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <ClerkProvider>
            <Show when="signed-out">
              <div className="w-screen h-screen flex justify-center items-center">
                {" "}
                <SignIn routing="hash" />
              </div>

              {/* <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton> */}
            </Show>
            <Show when="signed-in">{children}</Show>
          </ClerkProvider>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
