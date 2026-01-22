import React from 'react';
import { MessageCircle, Clock, DollarSign, UserX, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="py-6 px-4 md:px-8 border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-whatsapp" />
          <span className="font-bold text-xl text-darkBlue tracking-tight">Diagnóstico WhatsApp</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-darkBlue mb-6 leading-tight">
            Descubra quanto você perde por mês com <span className="text-red-500">atendimento desorganizado</span> no WhatsApp
          </h1>
          <p className="text-base md:text-lg text-slateText mb-10 max-w-2xl mx-auto font-medium">
            Teste grátis em 2 minutos: veja o valor exato que você deixa na mesa e como recuperar.
          </p>
          
          <button 
            onClick={onStart}
            className="bg-whatsapp hover:bg-whatsappDark text-white text-xl font-bold py-4 px-8 rounded-lg shadow-lg transform transition hover:-translate-y-1 w-full md:w-auto flex items-center justify-center gap-2 mx-auto"
          >
            Fazer Diagnóstico Grátis <ArrowRight className="w-6 h-6" />
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-sm md:text-base text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Leva menos de 2 minutos</span>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="px-4 py-16 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-darkBlue mb-12">
            Isso acontece no seu negócio?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Clock, text: "Clientes mandam mensagem e você demora para responder" },
              { icon: MessageCircle, text: "Conversas longas que não fecham venda" },
              { icon: UserX, text: "Clientes interessados que somem do nada" },
              { icon: DollarSign, text: "Cada atendente responde de um jeito diferente" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-start gap-5">
                <div className="bg-red-50 p-3 rounded-full shrink-0">
                  <item.icon className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-slateText font-medium text-base md:text-lg pt-1">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-red-600 font-bold mt-8 text-lg md:text-xl">
            Se marcou pelo menos 1, você está perdendo dinheiro sem perceber.
          </p>
        </div>
      </section>

      {/* Promise Section */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-10">
            O que você vai descobrir no diagnóstico
          </h2>

          <div className="space-y-5 text-left inline-block mb-10">
            {[
              "Quanto você está perdendo por mês (em reais)",
              "Qual o principal problema do seu atendimento",
              "O que fazer para corrigir isso agora mesmo"
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7 text-whatsapp shrink-0" />
                <span className="text-lg md:text-xl text-slateText">{text}</span>
              </div>
            ))}
          </div>

          <div className="w-full">
             <button 
              onClick={onStart}
              className="bg-darkBlue hover:bg-slate-800 text-white text-lg font-bold py-4 px-10 rounded-lg shadow-md transition w-full md:w-auto"
            >
              Quero Descobrir →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-50 border-t border-gray-200 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Diagnóstico WhatsApp. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};