import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';
import { traduzirErro } from '../utils/errorUtils';

interface ResetPasswordPageProps {
  onSuccess: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      // Updates the password for the user currently logged in via the recovery link
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      // Limpar a URL (remove o hash token de recovery) para segurança e estética
      window.history.replaceState({}, document.title, window.location.pathname);

      setIsSuccess(true);
      
      // Wait a moment for the user to see the success message, then redirect
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(traduzirErro(err.message));
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 animate-fade-in-up">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-green-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-whatsapp" />
          </div>
          <h2 className="text-2xl font-bold text-darkBlue mb-2">Senha Alterada!</h2>
          <p className="text-gray-500 mb-6">
            Sua senha foi redefinida com sucesso. Você será redirecionado...
          </p>
          <div className="flex justify-center">
             <Loader2 className="w-6 h-6 text-whatsapp animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full">
        
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <KeyRound className="w-8 h-8 text-blue-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-darkBlue text-center mb-2">Criar Nova Senha</h1>
        <p className="text-gray-500 text-center mb-8">
          Digite sua nova senha abaixo para recuperar o acesso.
        </p>
        
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition-colors"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition-colors"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 animate-pop-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 transform hover:-translate-y-0.5"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Nova Senha'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};