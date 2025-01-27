'use client';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Left Section */}
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Admin Dashboard. All rights reserved.
          </p>

          {/* Right Section */}
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a
              href="#"
              className="text-sm hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm hover:text-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
