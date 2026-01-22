import React from 'react';
import { MessageCircle, Clock, DollarSign, UserX, ArrowRight, ArrowLeft, Check, Zap, Smartphone, TrendingUp, AlertTriangle, LogIn } from 'lucide-react';

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
            <p className="font-semibold text-xs truncate">Cliente Novo</p>
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
              Oi, vi o anúncio. Quanto custa?
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
              Olá! O valor é R$ 250. Vamos agendar?
              <span className="text-[9px] text-gray-500 block text-right mt-0.5 flex items-center justify-end gap-1">
                13:30 <span className="text-blue-400 font-bold text-[9px]">✓✓</span>
              </span>
            </div>
          </div>

          {/* Msg 3: Client (Rejection) */}
          <div className="self-start max-w-[90%] relative opacity-0 animate-pop-in" style={{animationDelay: '3.5s'}}>
            <div className="bg-white p-2 px-3 rounded-lg rounded-tl-none shadow-sm text-xs text-gray-800 chat-tail-in relative z-10">
              Ah, obrigado. Como demorou eu já fechei com outro.
              <span className="text-[9px] text-gray-400 block text-right mt-0.5">13:35</span>
            </div>
          </div>

          {/* Loss Alert */}
          <div className="mt-auto mb-1 mx-1 bg-red-500 text-white p-2 rounded-lg shadow-lg border border-red-400 flex items-center gap-2 opacity-0 animate-pop-in" style={{animationDelay: '4.5s'}}>
            <div className="bg-white/20 p-1.5 rounded-full shrink-0">
              <AlertTriangle className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="font-bold text-xs leading-tight">Venda Perdida</p>
              <p className="text-[10px] text-white/90">- R$ 250,00 no caixa hoje</p>
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
      
      {/* Background Gradients (Aura Effect) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-green-200/40 via-teal-100/20 to-transparent rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
        <div className="absolute top-[10%] left-[-20%] w-[700px] h-[700px] bg-gradient-to-tr from-blue-100/40 to-transparent rounded-full blur-[100px] mix-blend-multiply opacity-60"></div>
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-green-50/50 rounded-full blur-[100px] opacity-50"></div>
      </div>

      {/* Header */}
      <header className="relative z-30 py-6 px-4 md:px-8 max-w-7xl mx-auto w-full flex justify-center md:justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-whatsapp text-white p-2 rounded-lg shadow-lg shadow-green-500/20">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-darkBlue tracking-tight">Diagnóstico WhatsApp</span>
        </div>
        <button 
          onClick={onLoginClick}
          className="hidden md:flex text-sm font-semibold text-darkBlue hover:text-whatsapp transition-colors items-center gap-2 group bg-white border border-gray-200 px-5 py-2.5 rounded-full shadow-sm hover:shadow-md"
        >
          Login <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </header>

      {/* HERO SECTION Split Layout */}
      <section className="relative z-20 pt-0 pb-0 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* LEFT: Copy - Center on mobile, Left on Desktop */}
          <div className="lg:w-1/2 text-center lg:text-left z-20 mb-12 lg:mb-0 lg:-mt-32 w-full flex flex-col items-center lg:items-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-green-100 mb-6 animate-fade-in-up shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-whatsapp"></span>
              </span>
              <span className="text-xs font-bold text-whatsappDark uppercase tracking-wide">Para Negócios Locais</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-darkBlue leading-[1.1] mb-6 tracking-tight animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Pare de perder dinheiro no <span className="text-whatsapp inline-block relative">
                WhatsApp
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-green-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              A maioria dos negócios perde <strong>30% das vendas</strong> por demorar a responder ou não saber conduzir a conversa. Descubra seu prejuízo exato agora.
            </p>
            
            {/* MOBILE ONLY MOCKUP - Positioned Above Button, Reduced Size */}
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
                Fazer Diagnóstico Grátis <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-400 flex items-center justify-center lg:justify-start gap-2 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <Clock className="w-4 h-4" /> Leva menos de 2 minutos
            </p>
          </div>

          {/* RIGHT: Mockup (Desktop Only) */}
          <div className="hidden lg:flex lg:w-1/2 w-full justify-center lg:justify-end relative pointer-events-none">
            <div className="relative transform lg:translate-y-52 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <PhoneMockup 
                heightClass="h-[750px]" 
                widthClass="w-[370px]" 
              />
            </div>
          </div>

        </div>
      </section>

      {/* PERSUASION STRIP */}
      <section className="bg-darkBlue relative py-12 lg:-mt-40 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 pr-0 lg:pr-8 text-center lg:text-left">
             <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4">
               Descubra os gargalos invisíveis que estão drenando seu lucro diário e receba o <span className="text-whatsapp">script exato</span> para corrigir isso <span className="text-whatsapp">hoje mesmo!</span>
             </h3>
          </div>
          {/* Spacer for the desktop phone overlapping on the right */}
          <div className="lg:w-1/2 hidden lg:block"></div>
        </div>
      </section>

      {/* FEATURES SECTION (Light Mode) */}
      <section className="bg-gray-50 py-24 px-4 overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-darkBlue mb-4">
              O que você vai descobrir
            </h2>
            <p className="text-gray-500 text-lg">
              Uma análise completa baseada em dados reais do seu negócio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-whatsapp transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center lg:text-left">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-whatsapp group-hover:text-white text-whatsapp transition-colors mx-auto lg:mx-0">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-darkBlue text-xl font-bold mb-2">Tempo de Resposta</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Descubra se a demora está matando suas vendas antes mesmo delas começarem.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 text-center lg:text-left">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white text-blue-500 transition-colors mx-auto lg:mx-0">
                <UserX className="w-6 h-6" />
              </div>
              <h3 className="text-darkBlue text-xl font-bold mb-2">Conversão Real</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Entenda matematicamente porque tantos curiosos perguntam o preço e somem.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-red-500 transition-all duration-300 hover:shadow-xl hover:shadow-red-100 hover:-translate-y-1 text-center lg:text-left">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500 group-hover:text-white text-red-500 transition-colors mx-auto lg:mx-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-darkBlue text-xl font-bold mb-2">Dinheiro na Mesa</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                O cálculo exato de quanto faturamento você perde todo mês por falhas bobas.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group bg-white border border-gray-200 p-6 rounded-2xl hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-100 hover:-translate-y-1 text-center lg:text-left">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-500 group-hover:text-white text-yellow-500 transition-colors mx-auto lg:mx-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-darkBlue text-xl font-bold mb-2">Plano de Ação</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Não apenas diagnosticamos, entregamos o passo-a-passo prático para resolver.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION (Dark Mode) */}
      <section className="bg-[#0b1120] py-24 px-4 text-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Junte-se a centenas de negócios locais que profissionalizaram seu WhatsApp
          </h3>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Pare de depender da sorte. Tenha um processo previsível de vendas.
          </p>
          <button 
            onClick={onStart}
            className="bg-whatsapp hover:bg-whatsappDark text-white text-xl font-bold py-5 px-12 rounded-full shadow-[0_0_30px_rgba(37,211,102,0.4)] transform transition hover:scale-105 flex items-center justify-center gap-3 mx-auto"
          >
            Quero Fazer Meu Diagnóstico
          </button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 bg-white border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
          <MessageCircle className="w-5 h-5 text-whatsapp" />
          <span className="font-bold text-darkBlue">Diagnóstico WhatsApp</span>
        </div>
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};