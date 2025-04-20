import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../index";

// Footer sections configuration
const sections = [
  {
    title: "Company",
    links: [
      { label: "Features", path: "/" },
      { label: "Pricing", path: "/" },
      { label: "Affiliate Program", path: "/" },
      { label: "Press Kit", path: "/" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Account", path: "/" },
      { label: "Help", path: "/" },
      { label: "Contact Us", path: "/" },
      { label: "Customer Support", path: "/" },
    ],
  },
  {
    title: "Legals",
    links: [
      { label: "Terms & Conditions", path: "/" },
      { label: "Privacy Policy", path: "/" },
      { label: "Licensing", path: "/" },
    ],
  },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="container mx-auto px-4">
        {/* Grid Layout */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Branding Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo width="50px" />
            </div>
            <p className="text-sm text-gray-500">
              &copy; {currentYear} DevUI. All rights reserved.
            </p>
          </div>

          {/* Dynamic Navigation Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold uppercase text-gray-400 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="text-base font-medium text-gray-300 hover:text-white transition-colors duration-200"
                      aria-label={`Go to ${link.label}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
