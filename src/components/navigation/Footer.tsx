
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#00b3a1] text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col items-start">
            <div className="bg-white p-2 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-[#00b3a1]" />
            </div>
            <p className="text-white">
              NutriTrackPro helps you easily track your food calories with our comprehensive tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="mb-2">
              If you have any questions, feel free to{" "}
              <Link to="/contact" className="underline">
                contact us
              </Link>
              .
            </p>
            <p>
              Email:{" "}
              <a href="mailto:support@nutritrackpro.com" className="underline">
                support@nutritrackpro.com
              </a>
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p>© 2025 — NutriTrackPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
