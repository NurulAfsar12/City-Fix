import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import Logo from "../Logo/Logo";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content rounded-2xl py-12 mt-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and description */}
        <div>
          <Logo size={50} text="CityFIX" />
          <p className="mt-4 text-neutral-content/80">
            CityFIX helps citizens report public infrastructure issues quickly
            and track their resolution efficiently. Improving city services, one
            report at a time.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-neutral-content font-bold text-lg mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-primary transition-colors">
                Home
              </a>
            </li>
            <li>
              <a
                href="/all-issues"
                className="hover:text-primary transition-colors"
              >
                All Issues
              </a>
            </li>
            <li>
              <a
                href="/top-issues"
                className="hover:text-primary transition-colors"
              >
                Top Issues
              </a>
            </li>
            <li>
              <a href="/city-map" className="hover:text-primary transition-colors">
                City Map
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-neutral-content font-bold text-lg mb-4">
            Contact
          </h3>
          <p>Email: support@cityfix.com</p>
          <p>Phone: +880 123 456 789</p>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="text-neutral-content hover:text-primary transition-colors"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="text-neutral-content hover:text-primary transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="text-neutral-content hover:text-primary transition-colors"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="#"
              className="text-neutral-content hover:text-primary transition-colors"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="#"
              className="text-neutral-content hover:text-primary transition-colors"
            >
              <FaGithub size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-neutral-content/20 pt-4 text-center text-neutral-content/60 text-sm">
        &copy; {new Date().getFullYear()} CityFIX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
