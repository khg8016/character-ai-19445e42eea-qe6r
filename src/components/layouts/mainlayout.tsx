import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sidebar } from '../home/Sidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useSupabase } from '../../hooks/useSupabase';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CharacterSearch } from '../search/CharacterSearch';

interface MainLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
}

export function MainLayout({ children, showSearch = false }: MainLayoutProps) {
  const { isOpen, toggle } = useSidebar();
  const { supabase } = useSupabase();
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isMainPage = location.pathname === '/';

  useEffect(() => {
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });
    }
  }, [supabase]);

  return (
    <div className="flex min-h-screen bg-[#1a1b1e]">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <header className="sticky top-0 z-10 bg-[#1a1b1e]">
          <div className="flex flex-col sm:flex-row items-center h-auto sm:h-16 px-4 py-4 sm:py-0">
            <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
              {!isOpen && (
                <button
                  onClick={toggle}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2c2d32] transition-colors"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-6 w-6" />
                </button>
              )}
              
              {!isMainPage && (
                <button
                  onClick={() => navigate('/')}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2c2d32] transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}

              {isMainPage && user && (
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-gray-200 hidden sm:inline">들어오신 것을 환영합니다.</span>
                    <span className="text-sm font-medium text-white truncate">{user.email}</span>
                  </div>
                </div>
              )}
            </div>
            
            {showSearch && (
              <div className="w-full sm:w-auto sm:ml-auto">
                <CharacterSearch />
              </div>
            )}
          </div>
        </header>
        
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}