import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';
import { traduzirErro } from '../utils/errorUtils';

interface EmailConfirmationPageProps {
  email: string;
}

export const EmailConfirmationPage: React.FC<EmailConfirmationPageProps> = ({ email }) => {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage('');
    setError('');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) throw error;

      setResendMessage('Email reenviado com sucesso! Verifique sua caixa de entrada.');
    } catch (err: any) {
      console.error(err);
      setError('Erro ao reenviar: ' + traduzirErro(err.message));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-green-100 max-w-lg w-full text-center">
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-whatsapp" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-darkBlue mb-4">Pagamento Confirmado!</h1>
        <p className="text-gray-600 text-lg mb-6">
          Enviamos um email para <strong className="text-darkBlue">{email}</strong> com o link para ativar sua conta.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5" /> Próximo passo:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800/80 text-sm md:text-base font-medium">
            <li>Abra seu email agora</li>
            <li>Clique no botão <strong>"Confirmar Email"</strong></li>
            <li>Crie sua senha e acesse o conteúdo</li>
          </ol>
        </div>
        
        <p className="text-gray-400 text-sm mb-6">
          Não recebeu? Verifique a pasta de spam ou aguarde alguns minutos.
        </p>

        {resendMessage && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {resendMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 animate-fade-in flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <button 
          onClick={handleResendEmail}
          disabled={isResending}
          className="w-full bg-white border-2 border-gray-200 hover:border-darkBlue text-gray-600 hover:text-darkBlue font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isResending ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {isResending ? 'Reenviando...' : 'Reenviar email de confirmação'}
        </button>
      </div>
    </div>
  );
};