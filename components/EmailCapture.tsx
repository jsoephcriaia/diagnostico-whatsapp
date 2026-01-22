import React, { useState } from 'react';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';

interface EmailCaptureProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

export const EmailCapture: React.FC<EmailCaptureProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Por favor, digite um email válido.');
      return;
    }
    setError('');
    onSubmit(email);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-whatsapp" />
        </div>

        <h2 className="text-2xl font-bold text-darkBlue mb-2">
          Seu diagnóstico está pronto!
        </h2>
        <p className="text-slateText mb-8">
          Para ver seu resultado detalhado e quanto você está perdendo, me diz onde posso te enviar uma cópia:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              disabled={isLoading}
              className={`w-full p-4 rounded-lg border-2 bg-gray-50 focus:bg-white transition-colors outline-none text-lg ${
                error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-whatsapp'
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Calculando...' : 'Ver Meu Resultado'} 
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
          <Lock className="w-3 h-3" />
          <span>Não enviamos spam. Seus dados estão seguros.</span>
        </div>
      </div>
    </div>
  );
};