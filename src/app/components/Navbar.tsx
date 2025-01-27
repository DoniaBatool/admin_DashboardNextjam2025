'use client';
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-[#2A254B] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">Avion Private Ltd</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="/settings" className="hover:text-gray-300">
              Settings
            </Link>
            <Link href="/profile" className="hover:text-gray-300">
              Profile
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <Link href="/notifications" className="hover:text-gray-300">
              Notifications
            </Link>
            <Link href="/logout" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
