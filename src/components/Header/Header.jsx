import React from "react";
import { Container, Logo, LogoutBtn } from "..";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);

  const navItems = [
    { name: "Home", path: "/", active: true },
    { name: "Login", path: "/login", active: !authStatus },
    { name: "SignUp", path: "/signup", active: !authStatus },
    { name: "My Posts", path: "/my-posts", active: authStatus },
    { name: "Add Post", path: "/add-post", active: authStatus },
  ];

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 w-full z-50 shadow-lg bg-gray-800 text-white">
        <Container>
          <nav className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="mr-6">
              <Link to="/">
                <Logo />
              </Link>
            </div>

            {/* Navigation Items */}
            <ul className="flex space-x-6">
              {navItems
                .filter((item) => item.active)
                .map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`inline-block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        location.pathname === item.path
                          ? "bg-green-500"
                          : "bg-gray-700 hover:bg-blue-400"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              {authStatus && (
                <li>
                  <LogoutBtn />
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
