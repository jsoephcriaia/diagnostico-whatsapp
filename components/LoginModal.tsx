import React, { useState } from 'react';
import { X, Mail, AlertCircle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'not_found'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      // 1. Verificar se o email existe e pagou
      const { data: lead, error: leadError } = await supabase
        .from('leads')
        .select('email, pagou')
        .eq('email', email)
        .maybeSingle();

      if (leadError) throw leadError;

      // Se não achou o lead ou não pagou
      if (!lead || !lead.pagou) {
        setStatus('not_found');
        return;
      }

      // 2. Enviar Magic Link
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          // Redireciona para a raiz, o App.tsx gerencia o estado baseado na sessão
          emailRedirectTo: window.location.origin 
        }
      });

      if (authError) throw authError;

      setStatus('success');
    } catch (error: any) {
      console.error('Erro no login:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Ocorreu um erro. Tente novamente.');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setEmail('');
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

        {/* State: IDLE or LOADING */}
        {(status === 'idle' || status === 'loading' || status === 'error') && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <Mail className="w-8 h-8 text-whatsapp" />
            </div>
            
            <h2 className="text-2xl font-bold text-darkBlue mb-2">Acessar Área do Aluno</h2>
            <p className="text-gray-500 mb-6">
              Digite o email utilizado na compra para receber seu link de acesso exclusivo.
            </p>

            <form onSubmit={handleSendLink} className="text-left space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition-all text-lg"
                  autoFocus
                />
              </div>

              {status === 'error' && (
                <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <> <Loader2 className="w-5 h-5 animate-spin" /> Verificando... </>
                ) : (
                  <> Enviar Link de Acesso <ArrowRight className="w-5 h-5" /> </>
                )}
              </button>
            </form>
            
            <p className="text-xs text-gray-400 mt-4">
              Não precisa de senha. Nós enviamos um link mágico para seu email.
            </p>
          </div>
        )}

        {/* State: SUCCESS */}
        {status === 'success' && (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
               <CheckCircle className="w-10 h-10 text-whatsapp" />
            </div>
            <h2 className="text-2xl font-bold text-darkBlue mb-4">Link Enviado!</h2>
            <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
              <p className="text-gray-600 text-sm mb-1">Enviamos o acesso para:</p>
              <p className="font-bold text-darkBlue break-all">{email}</p>
            </div>
            <p className="text-gray-500 mb-8 text-sm">
              Verifique sua caixa de entrada (e a pasta de spam/lixo eletrônico). Clique no link do email para entrar direto.
            </p>
            <button 
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-darkBlue font-bold py-3 rounded-xl transition-colors"
            >
              Fechar
            </button>
          </div>
        )}

        {/* State: NOT FOUND */}
        {status === 'not_found' && (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-darkBlue mb-4">Acesso Não Encontrado</h2>
            <p className="text-gray-500 mb-6">
              O email <strong>{email}</strong> não consta como aluno ou o pagamento ainda não foi confirmado.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={resetForm}
                className="w-full bg-darkBlue hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Tentar outro email
              </button>
              <button 
                onClick={onClose}
                className="w-full bg-white border-2 border-whatsapp text-whatsapp hover:bg-green-50 font-bold py-3 rounded-xl transition-colors"
              >
                Quero fazer o diagnóstico
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};