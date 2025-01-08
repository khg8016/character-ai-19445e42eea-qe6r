import React from 'react';
import { LogOut, Wallet, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { Logo } from './common/Logo';
import { MainMenu } from './navigation/MainMenu';
import { MobileMenu } from './navigation/MobileMenu';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface HeaderProps {
  onAuthClick: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
      console.error('Error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-end flex-1 space-x-4">
            <MainMenu onProfileClick={() => navigate('/profile/settings')} />
            <MobileMenu onProfileClick={() => navigate('/profile/settings')} />
            
            {/* Action Buttons */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                {profile?.user_level === 'Expert' && (
                  <button
                    onClick={() => navigate('/expert/dashboard')}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 
                             text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
                             transition-colors shadow-sm"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Expert Dashboard
                  </button>
                )}
                <button
                  onClick={() => navigate('/credits')}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 
                           text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                           transition-colors shadow-sm"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Buy Credits
                </button>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 
                           text-sm font-medium text-gray-700 dark:text-gray-200 
                           bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                           transition-colors shadow-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={onAuthClick}
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white 
                           font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onAuthClick}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 
                           text-sm font-medium text-white bg-coral-500 hover:bg-coral-600 
                           transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}