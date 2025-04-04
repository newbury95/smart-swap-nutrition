
import React from "react";
import TopBanner from "@/components/navigation/TopBanner";
import Footer from "@/components/navigation/Footer";
import SEO from "@/components/seo/SEO";
import CookieConsent from "@/components/cookies/CookieConsent";

interface LayoutProps {
  children: React.ReactNode;
  showTopBanner?: boolean;
  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: "website" | "article";
    keywords?: string[];
    noIndex?: boolean;
  };
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showTopBanner = true,
  seo
}) => {
  return (
    <>
      <SEO {...seo} />
      <div className="flex flex-col min-h-screen">
        {showTopBanner && <TopBanner />}
        <main className="flex-grow" itemScope itemType="https://schema.org/WebPage">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </>
  );
};

export default Layout;
