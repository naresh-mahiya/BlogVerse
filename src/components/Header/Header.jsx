import React, { useState } from "react";
import { Container, Logo, LogoutBtn } from "..";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProfile from "../UserProfile/UserProfile";

const Header = () => {
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);

  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility

  const navItems = [
    { name: "Home", path: "/", active: true },
    { name: "Login", path: "/login", active: !authStatus },
    { name: "SignUp", path: "/signup", active: !authStatus },
    { name: "My Posts", path: "/my-posts", active: authStatus },
    { name: "Add Post", path: "/add-post", active: authStatus },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 w-full px-2 z-50 shadow-lg bg-gray-800 text-white">
        <Container className="py-2 sm:py-6">
          <nav className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="mr-6">
              <Link to="/">
                <Logo />
              </Link>
            </div>

            {/* Hamburger Menu (Visible on small screens) */}
            <div className="block  md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white text-2xl px-3  rounded-lg focus:outline-none hover:text-gray-300"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? "✖" : "☰"}
              </button>
            </div>

            {/* Navigation Items */}
            <ul
              className={`md:flex md:space-x-6 absolute md:relative top-16 w-full text-center md:top-0 left-0 md:w-auto bg-gray-800 md:bg-transparent p-6 md:p-0 transition-transform duration-300 space-y-4 md:space-y-0 ${
                isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[-200%] opacity-0 md:translate-y-0 md:opacity-100"
              }`}
            >
              {navItems
                .filter((item) => item.active)
                .map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`block md:inline-block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? "bg-green-500"
                          : "bg-gray-700 hover:bg-[#2dd4bf] "
                      }`}
                      onClick={() => setIsMenuOpen(false)} // Close menu on item click
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              {authStatus && (
                <li>
                  {/* <LogoutBtn /> */}
                  <UserProfile/>
                  
                </li>
              )}
            </ul>
          </nav>
        </Container>
      </header>

      {/* Add spacing to prevent content from overlapping the fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;
