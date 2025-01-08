import { ArrowLeft, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Character } from '../../types/database';
import { ChatHeader } from '../chat/ChatHeader';
import { useSidebar } from '../../contexts/SidebarContext';

interface ChatLayoutProps {
  children: React.ReactNode;
  character: Character;
}

export function ChatLayout({ children, character }: ChatLayoutProps) {
  const navigate = useNavigate();
  const { isOpen, toggle } = useSidebar();

  return (
    <div className="flex h-screen bg-[#1a1b1e]">
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <div className="bg-[#25262b] border-b border-gray-800 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            {!isOpen && (
              <button
                onClick={toggle}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2c2d32] transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2c2d32] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <ChatHeader characterName={character.name} />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}