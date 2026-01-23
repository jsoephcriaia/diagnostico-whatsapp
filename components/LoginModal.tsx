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
    setError('');

    // Validar campos
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    // Timeout de segurança (10 segundos)
    let timeoutId: any;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Tempo esgotado. Tente novamente.'));
      }, 10000);
    });

    try {
      // Lógica de Login
      const loginLogic = async () => {
        // 1. Limpar sessão anterior (ignorar erros)
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.log('SignOut pré-login ignorado:', err);
        }

        // 2. Fazer login
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (authError) throw authError;
        if (!data.session) throw new Error('Sessão não estabelecida.');

        // 3. Login OK - verificar se pagou na tabela leads
        const { data: lead, error: leadError } = await supabase
          .from('leads')
          .select('pagou')
          .eq('email', email.trim())
          .maybeSingle();

        // Se houver erro de banco ou não pagou
        if (leadError || !lead || !lead.pagou) {
          await supabase.auth.signOut(); // Deslogar imediatamente
          throw new Error('Acesso não liberado. Complete a compra primeiro.');
        }

        return true; // Sucesso total
      };

      // Executa login com timeout
      await Promise.race([loginLogic(), timeoutPromise]);
      
      clearTimeout(timeoutId!);
      
      // Se chegou aqui, sucesso. O App.tsx detectará a sessão, mas garantimos o fechar do modal.
      onClose();

    } catch (err: any) {
      clearTimeout(timeoutId!);
      console.error('Erro no fluxo de login:', err);

      let msg = 'Erro ao fazer login. Tente novamente.';
      
      if (err.message?.includes('Tempo esgotado')) {
        msg = err.message;
      } else if (err.message?.includes('Invalid login credentials')) {
        msg = 'Email ou senha incorretos.';
      } else if (err.message?.includes('Email not confirmed')) {
        msg = 'Email não confirmado. Verifique sua caixa de entrada.';
      } else if (err.message?.includes('Acesso não liberado')) {
        msg = err.message;
      } else if (err.message?.includes('Network request failed')) {
        msg = 'Erro de conexão. Verifique sua internet.';
      }

      setError(msg);

      // Em caso de erro (exceto timeout), garantir que limpamos o estado local
      if (!err.message?.includes('Tempo esgotado')) {
        await supabase.auth.signOut().catch(() => {});
      }
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
        redirectTo: `${window.location.origin}`, // Redirects to root
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
                <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
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
                <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg animate-fade-in">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="text-green-600 text-sm flex items-center gap-2 bg-green-50 p-3 rounded-lg animate-fade-in">
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