import type { Metadata } from "next";
import { Inter, Roboto_Slab } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import AddedToCartModal from "@/components/AddedToCartModal";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-playfair", // Keeping the variable name to reuse existing Tailwind classes
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Gokul Oils - Cold Pressed, Pure, Traditional",
  description: "Experience the authentic taste of tradition with Gokul Oils. 100% wood-pressed, chemical-free oils.",
  icons: {
    icon: '/icons/Goful logo G.png',
    shortcut: '/icons/Goful logo G.png',
    apple: '/icons/Goful logo G.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${inter.variable} ${robotoSlab.variable} antialiased flex flex-col min-h-screen`}
      >
        <CartProvider>
          <AuthProvider>
            <Header />
            <CartDrawer />
            <AddedToCartModal />
            <AuthModal />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <MobileNav />
            <WhatsAppButton />
            <SpeedInsights />
          </AuthProvider>
        </CartProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NCBVWZVDT0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-NCBVWZVDT0');
          `}
        </Script>
      </body>
    </html>
  );
}
