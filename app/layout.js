import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import "@/styles/index.scss"
import "@/styles/components/navbar.scss"
import Navbar from "@/components/Navbar";
import { createTheme, ThemeProvider } from "@mui/material";
import LayoutClient from "@/components/LayoutClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Articles Backups",
  description: "Open source backup manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        <Navbar />

        <LayoutClient>
          {children}
        </LayoutClient>

      </body>
    </html>
  );
}
