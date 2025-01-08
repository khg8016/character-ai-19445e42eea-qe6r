import React from 'react';
import { Search, User2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../auth/AuthContext';

interface MainMenuProps {
  onProfileClick: () => void;
}

export function MainMenu({ onProfileClick }: MainMenuProps) {
  const { user } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link 
        to="/prototypes"
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <Search className="w-5 h-5 inline-block mr-2" />
        Prototypes
      </Link>
      
      {user && (
        <>
          <Link
            to="/profile/prototypes"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <Package className="w-5 h-5 inline-block mr-2" />
            My Prototypes
          </Link>
          <button
            onClick={onProfileClick}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <User2 className="w-5 h-5 inline-block mr-2" />
            Profile
          </button>
        </>
      )}
      
      <ThemeToggle />
    </nav>
  );
}