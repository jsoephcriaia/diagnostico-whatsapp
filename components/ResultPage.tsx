import React from 'react';
import { AlertTriangle, TrendingUp, BookOpen, MessageSquare, CheckCircle, ExternalLink, AlertOctagon } from 'lucide-react';
import { CalculationResult } from '../types';

interface ResultPageProps {
  result: CalculationResult;
  onCheckout: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ result, onCheckout }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header Result */}
      <div className="bg-darkBlue pt-12 pb-24 px-4 text-center">
        <h1 className="text-white text-2xl md:text-3xl font-semibold opacity-90 mb-2">Diagnóstico Finalizado</h1>
        <p className="text-gray-300 text-sm md:text-base">Baseado nas suas respostas</p>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-16 space-y-8">
        
        {/* Section 1: Impact (Hierarquia Invertida) */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <div className="p-6 md:p-8 text-center">
            <h2 className="text-lg md:text-xl text-slateText font-medium mb-4">Você está perdendo aproximadamente:</h2>
            
            {/* Annual (Main Highlight) */}
            <div className="text-4xl md:text-6xl font-extrabold text-red-600 mb-2 tracking-tight">
              {formatCurrency(result.annualLoss)} <span className="text-xl md:text-2xl font-bold text-gray-400">/ano</span>
            </div>
            
            {/* Monthly (Secondary) */}
            <p className="text-gray-500 bg-red-50 inline-block px-4 py-2 rounded-full text-base md:text-lg font-medium mt-2">
              Isso dá {formatCurrency(result.monthlyLoss)} por mês
            </p>
          </div>
        </div>

        {/* Section 2: Diagnosis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <h3 className="font-bold text-darkBlue text-xl">Seu principal problema</h3>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
            <h4 className="font-bold text-orange-800 text-lg mb-2">
              {result.mainProblem === 'tempo_resposta' 
                ? 'Tempo de Resposta Lento' 
                : 'Falta de Processo de Venda'}
            </h4>
            <p className="text-orange-900/80 leading-relaxed text-base md:text-lg">
              {result.mainProblem === 'tempo_resposta' 
                ? 'Clientes estão indo para o concorrente enquanto esperam sua resposta. A velocidade é o fator #1 para vendas no WhatsApp.'
                : 'Você conversa muito mas fecha pouco. Falta um script validado que conduza o cliente do "oi" até o pagamento.'}
            </p>
          </div>
        </div>

        {/* Section 3: Social Proof/Data */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 md:p-8 flex gap-4">
          <TrendingUp className="w-10 h-10 text-blue-600 shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 text-xl mb-2">O que os dados mostram</h3>
            <p className="text-blue-800/80 text-base md:text-lg leading-relaxed">
              Negócios que respondem em <strong>menos de 5 minutos</strong> convertem até <strong>3x mais</strong> que os que demoram mais de 2 horas.
            </p>
            <p className="text-xs md:text-sm text-blue-400 mt-3 uppercase tracking-wide font-semibold">Fonte: Harvard Business Review</p>
          </div>
        </div>

        {/* Section 4: Solution */}
        <div className="space-y-6 pt-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-3">Como resolver isso agora</h2>
            <p className="text-slateText text-base md:text-lg">
              Existe um <strong>protocolo de 7 passos</strong> que organiza seu atendimento e recupera esse dinheiro perdido.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
             {[
               { icon: BookOpen, text: "Os 7 passos do atendimento que converte" },
               { icon: MessageSquare, text: "Gerador de Scripts personalizados" },
               { icon: ExternalLink, text: "Exemplos prontos para seu nicho" },
               { icon: TrendingUp, text: "Aumento imediato de conversão" }
             ].map((item, idx) => (
               <div key={idx} className="p-5 flex items-center gap-4">
                 <CheckCircle className="w-6 h-6 text-whatsapp shrink-0" />
                 <span className="text-slateText font-medium text-base md:text-lg">{item.text}</span>
               </div>
             ))}
          </div>
          
          <p className="text-center text-sm md:text-base text-gray-500 italic">
            Você implementa hoje mesmo, sem precisar de equipe extra.
          </p>
        </div>

        {/* Section 5: Offer Card (Sticky on Mobile via Container) */}
        <div className="bg-darkBlue rounded-2xl p-1 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-whatsapp to-whatsappDark p-6 md:p-8 text-white text-center rounded-xl">
             <h3 className="text-2xl font-bold mb-2">Protocolo de Atendimento</h3>
             <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-blue-100 line-through text-xl">R$ 97</span>
                <span className="text-5xl font-extrabold">R$ 49</span>
             </div>
             
             <button 
              onClick={onCheckout}
              className="w-full bg-white text-whatsappDark font-bold text-xl py-4 rounded-lg shadow-lg hover:bg-gray-100 transition-colors mb-4 uppercase tracking-wide"
             >
               Quero Resolver Agora →
             </button>

             <p className="text-white/80 text-sm font-medium">
               🔒 7 dias de garantia. Risco zero.
             </p>
          </div>
        </div>
        
        {/* Urgency Text */}
        <div className="pb-8 flex items-start justify-center gap-2 text-red-600">
          <AlertOctagon className="w-6 h-6 shrink-0 mt-0.5" />
          <p className="text-center font-bold text-lg md:text-xl leading-tight">
             Enquanto você decide, os {formatCurrency(result.monthlyLoss)} continuam sendo perdidos...
          </p>
        </div>

      </div>

      {/* Sticky Bottom Button for Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button 
          onClick={onCheckout}
          className="w-full bg-whatsapp text-white font-bold py-3 rounded-lg shadow-md text-lg"
        >
          Parar de Perder Dinheiro
        </button>
      </div>
    </div>
  );
};