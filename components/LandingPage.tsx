import React from 'react';
import { MessageCircle, Clock, DollarSign, UserX, ArrowRight, ArrowLeft, Check, Zap, Smartphone, TrendingUp, AlertTriangle, LogIn, Stethoscope } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLoginClick: () => void;
}

// Reusable Phone Component to handle both Mobile (small) and Desktop (large) versions
const PhoneMockup = ({ heightClass, widthClass, className = "" }: { heightClass: string, widthClass: string, className?: string }) => (
  <div className={`relative ${widthClass} z-30 ${className}`}>
    <div className={`bg-darkBlue rounded-[2.5rem] p-3 shadow-2xl border-4 border-gray-800 ${heightClass} relative overflow-hidden ring-4 ring-black/10`}>
      {/* Screen */}
      <div className="bg-[#efe7dd] w-full h-full rounded-[2rem] overflow-hidden relative flex flex-col">
        {/* WhatsApp Header */}
        <div className="bg-[#075E54] p-3 pt-6 flex items-center gap-2 shadow-md z-10 text-white">
          <ArrowLeft className="w-4 h-4" />
          <div className="w-8 h-8 rounded-full bg-gray-300 border border-white/20 overflow-hidden">
            <div className="w-full h-full bg-gray-400 flex items-center justify-center">
              <UserX className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-xs truncate">Cliente Estética</p>
            <p className="text-[9px] text-white/80 truncate">visto por último hoje às 09:30</p>
          </div>
          <Smartphone className="w-4 h-4" />
        </div>

        {/* Chat Area - Wallpaper & Messages */}
        <div className="flex-1 p-3 relative overflow-y-auto phone-scroll flex flex-col gap-3">
          <div className="absolute inset-0 opacity-[0.08] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] pointer-events-none"></div>

          {/* Msg 1: Client */}
          <div className="self-start max-w-[90%] relative opacity-0 animate-pop-in" style={{animationDelay: '0.5s'}}>
            <div className="bg-white p-2 px-3 rounded-lg rounded-tl-none shadow-sm text-xs text-gray-800 chat-tail-in relative z-10">
              Oi, quanto custa a limpeza de pele?
              <span className="text-[9px] text-gray-400 block text-right mt-0.5">09:30</span>
            </div>
          </div>

          {/* Delay Warning */}
          <div className="self-center my-1 opacity-0 animate-fade-in-up" style={{animationDelay: '1.5s'}}>
            <span className="bg-gray-800/60 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 rounded-full shadow-sm font-medium">
              ⏱️ 4 horas depois...
            </span>
          </div>

          {/* Msg 2: Business (Late) */}
          <div className="self-end max-w-[90%] relative opacity-0 animate-pop-in" style={{animationDelay: '2.5s'}}>
            <div className="bg-[#d9fdd3] p-2 px-3 rounded-lg rounded-tr-none shadow-sm text-xs text-gray-800 chat-tail-out relative z-10">
              Olá! O valor é R$ 180. Vamos agendar?
              <span className="text-[9px] text-gray-500 block text-right mt-0.5 flex items-center justify-end gap-1">
                13:30 <span className="text-blue-400 font-bold text-[9px]">✓✓</span>
              </span>
            </div>
          </div>

          {/* Msg 3: Client (Rejection) */}
          <div className="self-start max-w-[90%] relative opacity-0 animate-pop-in" style={{animationDelay: '3.5s'}}>
            <div className="bg-white p-2 px-3 rounded-lg rounded-tl-none shadow-sm text-xs text-gray-800 chat-tail-in relative z-10">
              Ah, obrigada. Como demorou eu já fechei com outra clínica.
              <span className="text-[9px] text-gray-400 block text-right mt-0.5">13:35</span>
            </div>
          </div>

          {/* Loss Alert */}
          <div className="mt-auto mb-1 mx-1 bg-red-500 text-white p-2 rounded-lg shadow-lg border border-red-400 flex items-center gap-2 opacity-0 animate-pop-in" style={{animationDelay: '4.5s'}}>
            <div className="bg-white/20 p-1.5 rounded-full shrink-0">
              <AlertTriangle className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="font-bold text-xs leading-tight">Agendamento Perdido</p>
              <p className="text-[10px] text-white/90">- R$ 180,00 no caixa hoje</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-[#f0f2f5] p-2 flex items-center gap-2 z-10">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400 text-sm">😊</div>
          <div className="flex-1 bg-white h-8 rounded-full border border-gray-200 px-3 flex items-center text-gray-400 text-xs">Mensagem</div>
          <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center shadow-sm">
              <span className="text-white text-sm">🎤</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLoginClick }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden font-sans">
      
      {/* HEADER */}
      <header className="fixed w-full z-50 transition-all duration-200 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-whatsapp text-white p-1.5 rounded-lg shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-darkBlue tracking-tight">
              Diagnóstico WhatsApp para <span className="text-aesthetic-gold">Clínicas de Estética</span>
            </span>
          </div>
          <button 
            onClick={onLoginClick}
            className="hidden md:flex text-sm font-semibold text-darkBlue hover:text-aesthetic-gold transition-colors items-center gap-2 group border border-gray-200 px-5 py-2 rounded-full hover:border-aesthetic-gold/50"
          >
            Login <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* HERO SECTION with Background Image */}
      {/* Aumentei o padding-bottom (lg:pb-64) para garantir que a seção seguinte não cubra o texto */}
      <section className="relative min-h-[100vh] flex items-center pt-28 pb-20 lg:pb-64 overflow-hidden">
        {/* Background Image - Local File: clinica-estetica.jpg */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/clinica-estetica.jpg')" }}
        ></div>
        
        {/* Diagonal Overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(105deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 45%, rgba(255, 255, 255, 0.75) 65%, rgba(255, 255, 255, 0.2) 100%)'
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-20 flex flex-col lg:flex-row items-center">
          
          {/* LEFT: Copy */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 w-full flex flex-col items-center lg:items-start relative z-30">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aesthetic-bg-light border border-aesthetic-gold mb-6 animate-fade-in-up shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aesthetic-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-aesthetic-gold"></span>
              </span>
              <span className="text-xs font-bold text-aesthetic-gold uppercase tracking-wide">Exclusivo para Estética</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-darkBlue leading-[1.1] mb-6 tracking-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Sua clínica está perdendo clientes por demorar no <span className="text-whatsapp inline-block relative">
                WhatsApp?
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-green-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Descubra em 2 minutos quantos agendamentos você perde por mês — e o que fazer para recuperar.
            </p>
            
            {/* MOBILE ONLY MOCKUP */}
            <div className="block lg:hidden w-full flex justify-center mb-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <PhoneMockup 
                heightClass="h-[450px]" 
                widthClass="w-[260px]" 
                className="transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up w-full md:w-auto" style={{animationDelay: '0.4s'}}>
              <button 
                onClick={onStart}
                className="bg-whatsapp hover:bg-whatsappDark text-white text-lg font-bold py-4 px-8 rounded-xl shadow-xl shadow-green-500/30 transform transition hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3 w-full md:w-auto"
              >
                Fazer Diagnóstico da Minha Clínica <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-400 flex items-center justify-center lg:justify-start gap-2 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <Clock className="w-4 h-4" /> Grátis • 2 minutos • Resultado na hora
            </p>
          </div>

          {/* RIGHT: Mockup (Desktop Only) */}
          <div className="hidden lg:flex lg:w-1/2 w-full justify-center lg:justify-end relative pointer-events-none">
            {/* Increased translate-y to push it further down over the next section */}
            <div className="relative transform lg:translate-y-32 z-40 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <PhoneMockup 
                heightClass="h-[750px]" 
                widthClass="w-[370px]" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* PAIN POINTS SECTION */}
      {/* 
         -mt-32 puxa a seção para cima (overlap).
         z-20 garante que fique abaixo do mockup (z-40) mas acima do fundo da hero (z-0/10).
         pt-32 adiciona espaço interno no topo para o conteúdo não bater no mockup/topo da div.
      */}
      <section className="bg-aesthetic-bg py-24 pt-32 px-4 overflow-hidden relative lg:-mt-32 z-20">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-darkBlue mb-4">
              Isso acontece na sua clínica?
            </h2>
            <p className="text-gray-500 text-lg">
              Se você marcar pelo menos 1, está perdendo dinheiro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Cliente pede orçamento de harmonização e você só consegue responder horas depois",
              "Mensagens acumulando: 'quanto custa limpeza de pele?', 'tem horário hoje?', 'fazem botox?'",
              "Sábado e domingo o WhatsApp fica no vácuo — e a concorrente responde",
              "Recepcionista não dá conta: balcão, telefone e WhatsApp ao mesmo tempo",
              "Cliente que perguntou sobre preenchimento há 3 dias... você esqueceu de retornar",
              "Conversas que começam bem mas a cliente some antes de agendar"
            ].map((pain, idx) => (
              <div key={idx} className="group bg-white border border-gray-100 p-6 rounded-2xl hover:border-red-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left flex gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-400 shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <p className="text-gray-600 font-medium leading-relaxed group-hover:text-gray-800">
                  {pain}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-darkBlue mb-4">
              O que você vai descobrir no diagnóstico
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6">
              <div className="w-16 h-16 bg-aesthetic-bg rounded-2xl flex items-center justify-center mb-6 text-aesthetic-gold mx-auto">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-darkBlue text-xl font-bold mb-3">Quanto você está perdendo</h3>
              <p className="text-gray-500 leading-relaxed">
                O valor exato (em reais) que sua clínica deixa de faturar por falhas no atendimento.
              </p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-aesthetic-bg rounded-2xl flex items-center justify-center mb-6 text-aesthetic-gold mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-darkBlue text-xl font-bold mb-3">O principal problema</h3>
              <p className="text-gray-500 leading-relaxed">
                Se é tempo de resposta, falta de script ou falha no follow-up.
              </p>
            </div>

            <div className="p-6">
              <div className="w-16 h-16 bg-aesthetic-bg rounded-2xl flex items-center justify-center mb-6 text-aesthetic-gold mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-darkBlue text-xl font-bold mb-3">Como corrigir</h3>
              <p className="text-gray-500 leading-relaxed">
                O que fazer para transformar essas mensagens em agendamentos reais.
              </p>
            </div>

          </div>
          
          <div className="mt-12 text-center">
             <button 
                onClick={onStart}
                className="bg-whatsapp hover:bg-whatsappDark text-white text-lg font-bold py-4 px-10 rounded-xl shadow-xl transform transition hover:-translate-y-1 hover:shadow-2xl inline-flex items-center gap-3"
              >
                Quero Descobrir →
              </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-darkBlue text-center text-white">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Stethoscope className="w-6 h-6 text-aesthetic-gold" />
          <span className="font-bold text-xl">Diagnóstico WhatsApp Estética</span>
        </div>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed mb-8">
          Ferramenta exclusiva para donos de clínicas de estética, biomédicos e profissionais da saúde estética.
        </p>
        <p className="text-gray-500 text-xs border-t border-gray-800 pt-8 mt-8">
          &copy; {new Date().getFullYear()} Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};