"use client"
import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { href: '/application/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/application/claims', label: 'Claims', icon: '📦' },
    { href: '/application/upload', label: 'Upload', icon: '📋' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-base-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/application" className="text-xl font-bold text-primary">
            FrostByte
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-base-300 transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-content font-bold">JD</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-base-content/70">john@example.com</p>
            </div>
          </div>

          {/* Hamburger menu button for mobile */}
          <div className="relative md:hidden">
            <button
              onClick={toggleDropdown}
              className="btn btn-square btn-ghost"
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                className="w-6 h-6 stroke-current"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>

            {/* Mobile Dropdown Menu */}
            <div
              className={`absolute right-0 top-full mt-2 w-64 bg-base-100 rounded-lg shadow-xl transition-all duration-300 origin-top-right ${
                isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
              }`}
            >
              {/* User Profile - Mobile */}
              <div className="p-4 border-b border-base-300">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-content font-bold">JD</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">John Doe</p>
                    <p className="text-xs text-base-content/70">john@example.com</p>
                  </div>
                </div>
              </div>

              {/* Navigation Menu - Mobile */}
              <nav className="p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-base-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;