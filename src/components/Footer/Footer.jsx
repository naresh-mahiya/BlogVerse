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
    <footer className="relative overflow-hidden py-8 bg-gray-900 text-gray-300 border-t border-gray-700">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="-m-6 flex flex-wrap">
          {/* Branding Section */}
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center hover:opacity-80 transition-opacity duration-300">
                <Logo width="50px" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  &copy; {currentYear} DevUI. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Navigation Sections */}
          {sections.map((section, index) => (
            <div key={index} className="w-full p-6 md:w-1/2 lg:w-2/12">
              <div className="h-full">
                <h3 className="tracking-wide mb-4 text-sm font-semibold uppercase text-gray-400">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        className="text-base font-medium text-gray-300 hover:text-white transition-colors duration-200"
                        to={link.path}
                        aria-label={`Go to ${link.label}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
