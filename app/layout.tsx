"use client";

import type React from "react"
import { useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  useEffect(() => {
    // Hide the splash screen as soon as the app is ready
    SplashScreen.hide();
  }, []);

  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}
