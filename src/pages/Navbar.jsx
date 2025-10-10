import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  // React state
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const location = useLocation();
  const pathname = location.pathname;

  // collapse control
  const handleToggle = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // determine active link
  const getActiveClass = (path) => {
    if (pathname === path) return "active";
    if (window.location.pathname.endsWith(path)) return "active";
    return "";
  };

  // 🔆 Theme Handling (converted from your JS)
  const applyTheme = (selectedTheme) => {
    const body = document.body;
    const isDark = selectedTheme === "dark";

    if (isDark) {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
    } else {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
    }

    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  // load theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    applyTheme(storedTheme);
  }, []);

  // toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <a href="/Home.html" className="navbar-brand" id="navbarBrand">
          <div className="logo-wrapper">
            <img src="./logo.png" className="logo"/> 
          </div>
          <span className="navbar-brand-text">Phish</span>
          <span className="navbar-brand-text-light">Lens</span>
        </a>

        {/* Hamburger Button */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Section */}
        <div
          className={`navbar-collapse ${isOpen ? "show" : "collapse"}`}
          id="navbarNav"
        >
          <div className="navbar-nav ms-auto">
            <a
              href="/Home.html"
              className={`nav-link ${getActiveClass("Home.html")}`}
              onClick={closeMenu}
            >
              Home
            </a>
            <a
              href="/About.html"
              className={`nav-link ${getActiveClass("About.html")}`}
              onClick={closeMenu}
            >
              About
            </a>
            <a
              href="/Contact.html"
              className={`nav-link ${getActiveClass("Contact.html")}`}
              onClick={closeMenu}
            >
              Contact
            </a>
            <Link
              className={`nav-link ${getActiveClass("/signin")} btn btn-primary ms-lg-2`}
              to="/signin"
              onClick={closeMenu}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
