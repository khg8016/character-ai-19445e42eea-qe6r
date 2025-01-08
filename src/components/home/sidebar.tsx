import { useState, useEffect } from 'react';
import { Home, Plus, LogOut, ChevronDown, Mail, X, Coins, Receipt, MessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSupabase } from '../../hooks/useSupabase';
import { useSidebar } from '../../contexts/SidebarContext';
import { useChatHistory } from '../../hooks/useChatHistory';
import { useCredits } from '../../hooks/useCredits';
import { formatRelativeTime } from '../../utils/dateUtils';
import { ProfileImage } from '../common/ProfileImage';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const { isOpen, close } = useSidebar();
  const { chats, loading } = useChatHistory();
  const { credits } = useCredits();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUserEmail(user?.email || null);
      });
    }
  }, [supabase]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      close();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-20 w-64 bg-[#25262b] border-r border-gray-800 flex flex-col">
      <div className="flex items-center justify-between p-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-white"
          onClick={handleLinkClick}
        >
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <span>Character AI Hyungu</span>
        </Link>
        <button
          onClick={close}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2c2d32] transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="px-4 space-y-1">
        <Link
          to="/"
          onClick={handleLinkClick}
          className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200
            ${location.pathname === '/'
              ? 'bg-[#2c2d32] text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-[#2c2d32]'}`}
        >
          <Home className="h-5 w-5 mr-3" />
          홈
        </Link>
        
        <Link
          to="/characters/new"
          onClick={handleLinkClick}
          className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200
            ${location.pathname === '/characters/new'
              ? 'bg-[#2c2d32] text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-[#2c2d32]'}`}
        >
          <Plus className="h-5 w-5 mr-3" />
          새 캐릭터 만들기
        </Link>

        <Link
          to="/my-credits"
          onClick={handleLinkClick}
          className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200
            ${location.pathname === '/my-credits'
              ? 'bg-[#2c2d32] text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-[#2c2d32]'}`}
        >
          <Coins className="h-5 w-5 mr-3" />
          <div className="flex-1 flex items-center justify-between">
            <span>내 크레딧</span>
            <span className="text-sm font-medium text-blue-400">
              {credits.toLocaleString()}
            </span>
          </div>
        </Link>

        <Link
          to="/orders"
          onClick={handleLinkClick}
          className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200
            ${location.pathname === '/orders'
              ? 'bg-[#2c2d32] text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-[#2c2d32]'}`}
        >
          <Receipt className="h-5 w-5 mr-3" />
          주문 내역
        </Link>
      </nav>

      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <div className="mb-4">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            최근 대화
          </h3>
        </div>
        {loading ? (
          <div className="text-sm text-gray-500 px-3">Loading...</div>
        ) : (
          <ul className="space-y-1">
            {chats.map((chat) => (
              <li key={chat.id}>
                <Link
                  to={`/chat/${chat.character.id}?chat=${chat.id}`}
                  onClick={handleLinkClick}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${location.pathname.includes(chat.character.id)
                      ? 'bg-[#2c2d32] text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-[#2c2d32]'}`}
                >
                  <div className="flex-shrink-0 relative">
                    <div className="w-8 h-8 bg-[#2c2d32] rounded-full ring-2 ring-gray-800 flex items-center justify-center overflow-hidden">
                      <ProfileImage
                        src={chat.character.avatar_url}
                        alt={chat.character.name}
                        size="sm"
                        objectFit="contain"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#25262b]" />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="font-medium truncate">{chat.character.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {formatRelativeTime(chat.created_at)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative border-t border-gray-800 p-4">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-[#2c2d32] transition-all duration-200"
        >
          <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-400">
              {userEmail?.[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-white font-medium truncate">내 계정</p>
                <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {userEmail}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        </button>

        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#2c2d32] rounded-lg shadow-lg border border-gray-800 overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#35363c] transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  );
}