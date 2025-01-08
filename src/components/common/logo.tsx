import React from 'react';
import { BeakerIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function Logo() {
  const { user } = useAuth();
  const targetPath = user ? '/prototypes' : '/';

  return (
    <Link 
      to={targetPath}
      className="flex items-center hover:opacity-90 transition-opacity"
    >
      <BeakerIcon className="h-8 w-8 text-blue-600" />
      <span className="ml-2 text-xl font-semibold dark:text-white">Sprint</span>
      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">beta</span>
    </Link>
  );
}