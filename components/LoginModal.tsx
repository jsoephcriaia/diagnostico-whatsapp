import React, { useState } from 'react';
import { X, Mail, AlertCircle, Loader2, ArrowRight, Lock, KeyRound } from 'lucide-react';
import { supabase } from '../supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewState = 'login' | 'forgot-password';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<ViewState>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos.');
        }
        throw authError;
      }

      // 2. Check if user paid (in leads table)
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('pagou')
        .eq('email', email)
        .maybeSingle();

      if (!lead || !lead.pagou) {
        // Log out immediately if not paid
        await supabase.auth.signOut();
        throw new Error('Pagamento não identificado para este email.');
      }

      // Success - App.tsx subscription handles redirection
      onClose();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao entrar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Digite seu email primeiro.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}`, // Redirects to root, App.tsx handles PASSWORD_RECOVERY event
      });

      if (error) throw error;

      setSuccessMessage('Link de recuperação enviado! Verifique seu email.');
      setTimeout(() => {
        setView('login');
        setSuccessMessage('');
      }, 5000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao enviar email de recuperação.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setView('login');
    setEmail('');
    setPassword('');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 animate-pop-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {view === 'login' ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-darkBlue mb-2">Entrar no Protocolo</h2>
            <p className="text-gray-500 mb-6">
              Digite seu email e senha para acessar.
            </p>

            <form onSubmit={handleLogin} className="text-left space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white text-darkBlue focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white text-darkBlue focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition-all"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
            
            <div className="mt-4 flex flex-col gap-3">
              <button 
                onClick={() => {
                  setView('forgot-password');
                  setError('');
                }}
                className="text-sm text-gray-500 hover:text-darkBlue underline"
              >
                Esqueci minha senha
              </button>
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">ou</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <button 
                onClick={onClose}
                className="text-whatsapp font-bold hover:underline"
              >
                Ainda não tenho conta (Fazer Diagnóstico)
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <KeyRound className="w-8 h-8 text-blue-500" />
            </div>

            <h2 className="text-2xl font-bold text-darkBlue mb-2">Recuperar Senha</h2>
            <p className="text-gray-500 mb-6">
              Digite seu email e enviaremos um link para você redefinir sua senha.
            </p>

            <form onSubmit={handleForgotPassword} className="text-left space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white text-darkBlue focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition-all"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="text-green-600 text-sm flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-darkBlue hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Link de Recuperação'}
              </button>
            </form>

            <button 
              onClick={() => {
                setView('login');
                setError('');
                setSuccessMessage('');
              }}
              className="mt-6 text-sm text-gray-500 hover:text-darkBlue flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Voltar para o login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};