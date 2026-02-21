import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`${inter.className} `}
      >
        {/* header */}
        <main className="min-h-screen">{children}</main>
        {/* fotter */}
        <footer className="bg-muted/50 py-12">
         < div className="container mx-auto py-4 text-center text-gray-200">
          <p>Made with ❤️ by Shubham</p>
         </div>
        </footer>
      </body>
    </html>
  );
}
