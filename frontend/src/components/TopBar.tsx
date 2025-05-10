import { logos } from "@/assets";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleLogoClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-50">
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          <button
            className="flex items-center space-x-3"
            onClick={handleLogoClick}
          >
            {/* Project Icon */}
            <img src={logos.logo} alt="logo" className="w-8 h-8" />
            {/* Project Name */}
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Prompt Profiler
            </h1>
          </button>

          {/* Right side items */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* User Avatar with Dropdown or Sign In Button */}
            <div className="flex ml-auto relative" ref={dropdownRef}>
              {user ? (
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User avatar"
                      className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 transition-colors duration-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 transition-colors duration-200">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {user.email?.[0].toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-full text-sm transition duration-300"
                >
                  Sign In
                </Link>
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && user && (
                <div className="absolute right-0 top-10 mt-4 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
