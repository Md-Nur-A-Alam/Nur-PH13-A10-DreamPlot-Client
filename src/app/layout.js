import "./globals.css";
import Navbar from "@/component/Navbar/Navbar";
import Footer from "@/component/Footer/Footer";
import ToastProvider from "./ToastProvider";

export const metadata = {
  title: "DreamPlot - Premium Rental & Booking Platform",
  description: "Find your next luxury studio, villa, or office asset on the most premium booking portal.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <ToastProvider>
          {children}
        </ToastProvider>
        <Footer />
      </body>
    </html>
  );
}
