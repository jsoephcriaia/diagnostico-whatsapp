import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Lock, LogOut, ChevronRight, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

interface AuthenticatedHeaderProps {
  currentPage?: string;
  onNavigateToDashboard: () => void;
  onLogout: () => void;
}

export const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({
  currentPage,
  onNavigateToDashboard,
  onLogout
}) => {
  const [userEmail, setUserEmail] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // Password Reset State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        return;
      }
      const storedEmail = localStorage.getItem('userEmail') || localStorage.getItem('emailCompra');
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    };
    getUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      return;
    }

    setIsSavingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPasswordSuccess('Senha alterada com sucesso!');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);

    } catch (err: any) {
      setPasswordError(err.message || 'Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const openPasswordModal = () => {
    setIsUserMenuOpen(false);
    setIsPasswordModalOpen(true);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
            <button
              onClick={onNavigateToDashboard}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <div className="bg-whatsapp w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                P
              </div>
              <span className={`font-bold text-darkBlue ${currentPage ? 'hidden md:block' : 'block'}`}>
                Protocolo de Atendimento
              </span>
            </button>

            {currentPage && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-whatsapp truncate">
                  {currentPage}
                </span>
              </>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-1 pr-3 py-1 transition-all hover:bg-gray-50 hover:border-gray-300 ${isUserMenuOpen ? 'ring-2 ring-gray-100' : ''}`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#c9a87c] to-[#d4a59a] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {userInitial}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in origin-top-right">
                <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100 break-all bg-gray-50/50">
                  <span className="block text-xs text-gray-400 mb-0.5">Logado como:</span>
                  {userEmail}
                </div>
                
                <div className="py-1">
                  <button 
                    onClick={openPasswordModal}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Lock className="w-4 h-4 text-gray-400" /> 
                    Alterar senha
                  </button>
                  
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> 
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Spacer to compensate fixed header */}
      <div className="h-16"></div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsPasswordModalOpen(false)}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-pop-in">
            <button 
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-darkBlue mb-1">Alterar Senha</h2>
              <p className="text-gray-500">Digite sua nova senha abaixo.</p>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nova senha</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite novamente"
                  className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition-all"
                  required
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {passwordError}
                </div>
              )}
              
              {passwordSuccess && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
                   <CheckCircle2 className="w-4 h-4 shrink-0" />
                   {passwordSuccess}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSavingPassword}
                className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isSavingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Nova Senha'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};