import React, { useState } from 'react';
import { Menu, X, Search, User2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../auth/AuthContext';

interface MobileMenuProps {
  onProfileClick: () => void;
}

export function MobileMenu({ onProfileClick }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const handleItemClick = (callback: () => void) => {
    setIsOpen(false);
    callback();
  };

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-2 right-0 w-64 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <Link
              to="/prototypes"
              className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Search className="w-5 h-5 mr-3" />
              Prototypes
            </Link>
            
            {user && (
              <>
                <Link
                  to="/profile/prototypes"
                  className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <Package className="w-5 h-5 mr-3" />
                  My Prototypes
                </Link>
                <button
                  onClick={() => handleItemClick(onProfileClick)}
                  className="flex items-center w-full px-4 py-3 text-left text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <User2 className="w-5 h-5 mr-3" />
                  Profile
                </button>
              </>
            )}
            
            <div className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
              <ThemeToggle />
              <span className="ml-3">Theme</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}