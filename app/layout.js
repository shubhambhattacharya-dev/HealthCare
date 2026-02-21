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
        <footer className="bg-muted/50 py-12">
         < div className="container mx-auto py-4 text-center text-gray-200">
          <p>Made with ❤️ by Shubham</p>
         </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
