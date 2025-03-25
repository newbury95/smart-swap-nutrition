
import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Layout from "@/components/layout/Layout";

const CookiePolicyPage: React.FC = () => {
  return (
    <Layout
      seo={{
        title: "Cookie Policy | NutriTrack",
        description: "Learn about how we use cookies on NutriTrack to enhance your experience.",
        keywords: ["cookie policy", "privacy", "data protection", "GDPR", "cookies"],
      }}
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-green max-w-none">
          <p className="lead">
            This Cookie Policy explains how NutriTrack ("we", "us", or "our") uses cookies and similar technologies
            to recognize you when you visit our website at nutritrack.com ("Website"). 
            It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
          
          <h2>What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
            Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
            as well as to provide reporting information.
          </p>
          
          <h2>Why do we use cookies?</h2>
          <p>
            We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons
            in order for our Website to operate, and we refer to these as "necessary" cookies. Other cookies also enable us
            to track and target the interests of our users to enhance the experience on our Website. Third parties serve cookies
            through our Website for analytics and other purposes.
          </p>
          
          <h2>Types of cookies we use</h2>
          
          <h3>Necessary cookies</h3>
          <p>
            These cookies are strictly necessary to provide you with services available through our Website and to use some of
            its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Website,
            you cannot refuse them without impacting how our Website functions.
          </p>
          
          <h3>Analytics cookies</h3>
          <p>
            These cookies allow us to count visits and traffic sources, so we can measure and improve the performance of our site.
            They help us know which pages are the most and least popular and see how visitors move around the site.
            All information these cookies collect is aggregated and therefore anonymous.
          </p>
          
          <h3>Marketing cookies</h3>
          <p>
            These cookies track your browsing habits to enable us to show advertising which is more likely to be of interest to you.
            These cookies use information about your browsing history to group you with other users who have similar interests.
            Based on that information, third party advertisers can place cookies to enable them to show advertisements which we think
            will be relevant to your interests while you are on third party websites.
          </p>
          
          <h2>How can you control cookies?</h2>
          <p>
            You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may
            still use our Website though your access to some functionality and areas may be restricted. As the means by which you can
            refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu
            for more information.
          </p>
          
          <h2>How often will we update this Cookie Policy?</h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for
            other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed
            about our use of cookies and related technologies.
          </p>
          
          <h2>Questions and contact information</h2>
          <p>
            If you have any questions about our use of cookies or other technologies, please email us at privacy@nutritrack.com or contact us at:
          </p>
          <address>
            NutriTrack<br />
            123 Health Street<br />
            Fitness City, FC 12345<br />
            United States
          </address>
          
          <hr />
          
          <p className="mt-8">
            <Link to="/privacy" className="text-primary hover:underline flex items-center gap-1">
              View our Privacy Policy <ExternalLink className="w-4 h-4" />
            </Link>
          </p>
          <p>
            <Link to="/terms" className="text-primary hover:underline flex items-center gap-1">
              View our Terms of Service <ExternalLink className="w-4 h-4" />
            </Link>
          </p>
          
          <p className="text-sm text-gray-500 mt-8">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePolicyPage;
