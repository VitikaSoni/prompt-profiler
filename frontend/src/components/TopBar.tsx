import { logos } from "@/assets";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const TopBar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-3">
            {/* Project Icon */}
            <img src={logos.logo} alt="logo" className="w-8 h-8" />
            {/* Project Name */}
            <h1 className="text-xl font-semibold bg-gradient-to-r from-[#192b53] to-[#4d6eb4] bg-clip-text text-transparent">
              Prompt Profiler
            </h1>
          </div>

          {/* User Avatar with Dropdown */}
          <div className="flex ml-auto relative" ref={dropdownRef}>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="cursor-pointer"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User avatar"
                  className="w-12 h-12 rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    {user?.email?.[0].toUpperCase() || "?"}
                  </span>
                </div>
              )}
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-10 mt-4 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
