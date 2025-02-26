import type { Metadata } from "next";
import localFont from "next/font/local";

import Header from "./components/header/header";
import "./globals.css";


//localfontの指定
const ZenKakuGothicNew = localFont({
  src: "./../../public/fonts/ZenKakuGothicNew-Regular.ttf",
  variable: "--font-Zen-Go",
  weight: "100 200 300 400 500 600",
});

export const metadata: Metadata = {
  title: "DopingRumne",
  description: "夢を仕事に",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="jp">
      <body
        className={`${ZenKakuGothicNew.className} antialiased bg-outbackground sm:file:bg-beige text-base-black flex justify-center`}
      >
          <Header />
          <div className="w-screen pt-16 min-h-svh sm:w-[375px] sm:min-h-screen bg-mainbackground">
            {children}
          </div>
      </body>
    </html>
  );
}
