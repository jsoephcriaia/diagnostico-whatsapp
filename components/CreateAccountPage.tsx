import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Lock, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';

interface CreateAccountPageProps {
  email: string;
  onAccountCreated: () => void;
}

export const CreateAccountPage: React.FC<CreateAccountPageProps> = ({ email, onAccountCreated }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAccount = async (e: React.FormEvent) => {
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
      // 1. Sign Up using Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: '', // We could capture name here if passed via props
          }
        }
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          throw new Error('Este email já possui uma conta. Por favor, faça login.');
        }
        throw signUpError;
      }

      // 2. Update leads table to mark account as created
      await supabase
        .from('leads')
        .update({ conta_criada: true })
        .eq('email', email);

      // 3. Auto Login (Supabase signUp usually logs in automatically if email confirm is off, 
      // otherwise we might need to signIn, but for this flow we assume auto-login or immediate transition)
      
      // Force a sign in just in case signUp didn't establish session immediately due to config
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (signInError) throw signInError;

      onAccountCreated();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-green-100 max-w-md w-full animate-fade-in-up">
        
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-whatsapp" />
        </div>
        
        <h1 className="text-2xl font-bold text-darkBlue text-center mb-2">Pagamento Confirmado!</h1>
        <p className="text-gray-500 text-center mb-8">
          Agora crie uma senha segura para acessar o Protocolo de Atendimento.
        </p>
        
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (usado na compra)</label>
            <input 
              type="email" 
              value={email} 
              disabled 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crie uma senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirme a senha</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite novamente"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none"
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
            className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Minha Conta'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Seus dados estão protegidos.
        </div>
      </div>
    </div>
  );
};