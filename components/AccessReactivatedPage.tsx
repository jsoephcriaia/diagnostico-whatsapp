import React from 'react';
import { ArrowRight, Lock, PartyPopper, RotateCcw } from 'lucide-react';

interface AccessReactivatedPageProps {
  onLogin: () => void;
  onForgotPassword: () => void;
}

export const AccessReactivatedPage: React.FC<AccessReactivatedPageProps> = ({ onLogin, onForgotPassword }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-green-100 max-w-md w-full text-center relative overflow-hidden">
        
        {/* Confetti Background Effect */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400"></div>

        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pop-in">
          <PartyPopper className="w-10 h-10 text-whatsapp" />
        </div>
        
        <h1 className="text-2xl font-bold text-darkBlue mb-4">Seu Acesso foi Reativado!</h1>
        
        <p className="text-gray-600 mb-6">
          Identificamos que você já possui uma conta conosco. Seu acesso ao protocolo foi restaurado com sucesso!
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8 text-left">
          <div className="flex gap-3">
             <Lock className="w-5 h-5 text-green-700 shrink-0 mt-0.5" />
             <div>
                <strong className="block text-green-800 text-sm mb-1">Como acessar:</strong>
                <p className="text-green-700/80 text-sm">
                  Faça login utilizando seu email e sua <strong>senha anterior</strong>.
                </p>
                <p className="text-green-700/60 text-xs mt-2">
                  Se não lembrar a senha, use a opção "Esqueci minha senha" abaixo.
                </p>
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onLogin}
            className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            Fazer Login Agora <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onForgotPassword}
            className="w-full bg-white border-2 border-gray-100 hover:border-gray-300 text-gray-500 hover:text-darkBlue font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Esqueci minha senha
          </button>
        </div>

      </div>
    </div>
  );
};