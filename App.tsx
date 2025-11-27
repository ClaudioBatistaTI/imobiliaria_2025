import React, { useState, useEffect, createContext, useContext, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Details } from './pages/Details';
import { User, AuthState } from './types';
import { getSession, loginUser, logoutUser } from './services/storageService';

// Auth Context
interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Simple Auth Page Component (inline to reduce files)
const AuthPage: React.FC<{ onLogin: (email: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(email && password) {
        // Mock auth accepts any password for demo
        onLogin(email);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isRegister ? 'Criar Conta' : 'Bem-vindo de volta'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-secondary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/30">
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="ml-1 text-secondary font-semibold hover:underline"
          >
            {isRegister ? 'Entrar' : 'Cadastre-se'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
  }, []);

  const login = async (email: string) => {
    const loggedUser = await loginUser(email);
    setUser(loggedUser);
    setCurrentPage('home');
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0,0);
  };

  const handlePropertyClick = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('details');
    window.scrollTo(0,0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPropertyClick={handlePropertyClick} />;
      case 'dashboard':
        return user ? <Dashboard /> : <AuthPage onLogin={login} />;
      case 'details':
        return selectedPropertyId ? (
          <Details 
            id={selectedPropertyId} 
            onBack={() => handleNavigate('home')} 
          />
        ) : <Home onPropertyClick={handlePropertyClick} />;
      case 'login':
        return <AuthPage onLogin={login} />;
      default:
        return <Home onPropertyClick={handlePropertyClick} />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
        <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
        <main className="flex-grow">
          {renderPage()}
        </main>
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} ImobVenda AI. Todos os direitos reservados.</p>
            <p className="mt-2">Plataforma demonstrativa desenvolvida com React e Gemini API.</p>
          </div>
        </footer>
      </div>
    </AuthContext.Provider>
  );
}