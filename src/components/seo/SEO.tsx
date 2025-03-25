
import React from "react";
import { Helmet } from "react-helmet-async";

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Your Fitness Journey | Track Your Nutrition",
  description = "Track your nutrition, set fitness goals, and achieve a healthier lifestyle with our comprehensive nutrition tracking tools.",
  canonicalUrl,
  ogImage = "/og-image.png",
  ogType = "website",
  keywords = ["nutrition tracking", "fitness", "diet", "meal planning", "calorie counter", "health tracking"],
  noIndex = false,
}) => {
  const siteUrl = window.location.origin;
  const pageUrl = canonicalUrl || window.location.href;
  const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEO;
