import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ui/themeProvider";
import Headers from "../components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "MediMeet-Doctor Appointment Booking App",
  description: "Connect with doctors anutime,anywhere with MediMeet",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: "dark" }}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} `}
      >
          <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                  >
        {/* header */}
        <Headers/>
        <main className="min-h-screen">{children}</main>
        {/* fotter */}
       <footer className="relative bg-muted/50 py-12 overflow-hidden">

  {/* subtle glow */}
  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-400/5 pointer-events-none"></div>

  <div className="relative container mx-auto px-4 text-center">

    <p className="text-muted-foreground text-sm tracking-wide">
      Made with{" "}
      <span className="text-emerald-400 animate-pulse">❤️</span>{" "}
      by{" "}
      <span className="font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Shubham
      </span>
    </p>

    <div className="mt-4 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>

    <p className="mt-4 text-xs text-muted-foreground/70">
      © {new Date().getFullYear()} Healthcare Platform. All rights reserved.
    </p>

  </div>
</footer>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
