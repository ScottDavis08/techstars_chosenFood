import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { href: '/application', label: 'Dashboard', icon: '📊' },
    { href: '/products', label: 'Products', icon: '📦' },
    { href: '/orders', label: 'Orders', icon: '📋' },
    { href: '/customers', label: 'Customers', icon: '👥' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Hamburger menu button for mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-square btn-ghost"
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-base-200 p-4 w-64 shadow-lg z-40 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:block`}
      >
        {/* Logo/Brand */}
        <div className="mb-8 mt-12 lg:mt-0">
          <Link href="/" className="text-xl font-bold text-primary">
            YourApp
          </Link>
        </div>

        {/* Navigation Menu */}
        <ul className="menu w-full">
          {menuItems.map((item) => (
            <li key={item.href} className="mb-1">
              <Link
                href={item.href}
                className={`rounded-lg ${
                  router.pathname === item.href ? 'active' : ''
                }`}
                onClick={() => setIsOpen(false)} // Close sidebar on mobile after clicking
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-base-300">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-content font-bold">JD</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">John Doe</p>
              <p className="text-xs text-base-content/70">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;