
import React from "react";
import TopBanner from "@/components/navigation/TopBanner";
import Footer from "@/components/navigation/Footer";

interface LayoutProps {
  children: React.ReactNode;
  showTopBanner?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showTopBanner = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showTopBanner && <TopBanner />}
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
