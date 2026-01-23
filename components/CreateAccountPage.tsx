import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Lock, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '../supabase';
import { traduzirErro } from '../utils/errorUtils';

interface CreateAccountPageProps {
  email: string; // Mantido para exibição, mas o usuário já está autenticado via link
  onAccountCreated: () => void;
}

export const CreateAccountPage: React.FC<CreateAccountPageProps> = ({ email, onAccountCreated }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreatePassword = async (e: React.FormEvent) => {
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
      // Como o usuário clicou no link de confirmação, ele já está com sessão ativa.
      // Usamos updateUser para definir a senha definitiva.
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      // Sucesso!
      onAccountCreated();
    } catch (err: any) {
      console.error(err);
      setError(traduzirErro(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-green-100 max-w-md w-full animate-fade-in-up text-center">
        
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-blue-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-darkBlue mb-2">Email Confirmado!</h1>
        <p className="text-gray-500 mb-8">
          Agora crie uma senha segura para acessar seu conteúdo exclusivo.
        </p>
        
        <form onSubmit={handleCreatePassword} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crie uma senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition-colors"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirme a senha</label>
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
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Senha e Acessar'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 text-xs text-gray-400 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Acesso seguro e criptografado.
        </div>
      </div>
    </div>
  );
};