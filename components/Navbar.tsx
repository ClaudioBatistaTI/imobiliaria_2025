import React from 'react';
import { User, LogOut, PlusCircle, Home } from 'lucide-react';
import { useAuth } from '../App';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => onNavigate('home')}
        >
          <Home className="text-secondary" size={24} />
          <span className="text-xl font-bold tracking-tight">Imob<span className="text-secondary">Venda</span></span>
        </div>

        <div className="flex items-center space-x-6">
          <button 
            onClick={() => onNavigate('home')}
            className={`hover:text-secondary transition-colors ${currentPage === 'home' ? 'text-secondary font-medium' : 'text-gray-300'}`}
          >
            Imóveis
          </button>

          {user ? (
            <>
              <button 
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center space-x-1 hover:text-secondary transition-colors ${currentPage === 'dashboard' ? 'text-secondary font-medium' : 'text-gray-300'}`}
              >
                <PlusCircle size={18} />
                <span>Meus Anúncios</span>
              </button>
              <div className="flex items-center space-x-3 border-l border-gray-700 pl-4">
                <div className="text-sm text-right hidden md:block">
                  <p className="font-medium text-white leading-none">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <button 
                  onClick={logout}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => onNavigate('login')}
              className="bg-secondary hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <User size={16} />
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};