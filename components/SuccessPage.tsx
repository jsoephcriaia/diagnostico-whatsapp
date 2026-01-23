import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface SuccessPageProps {
  onGoToDashboard: () => void;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ onGoToDashboard }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-green-100 text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-whatsapp" />
        </div>
        
        <h1 className="text-3xl font-bold text-darkBlue mb-4">Pagamento Confirmado!</h1>
        <p className="text-gray-600 text-lg mb-8">
          Seu acesso ao Protocolo de Atendimento foi liberado com sucesso.
        </p>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
          <p className="text-sm text-gray-500 uppercase font-semibold mb-2">Agora você tem acesso a:</p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="text-whatsapp">✓</span>
              <span className="text-slateText">Protocolo de 7 Passos</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-whatsapp">✓</span>
              <span className="text-slateText">Gerador de Scripts</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-whatsapp">✓</span>
              <span className="text-slateText">Exemplos por Nicho</span>
            </li>
          </ul>
        </div>

        <button 
          onClick={onGoToDashboard}
          className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-lg shadow-md transition flex items-center justify-center gap-2"
        >
          Acessar Meu Protocolo <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};