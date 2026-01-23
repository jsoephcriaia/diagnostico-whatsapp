import React from 'react';
import { CheckCircle2, Zap, Target, Calendar, RefreshCcw, MessageCircle, BarChart3, X, Smartphone } from 'lucide-react';
import { AuthenticatedHeader } from './AuthenticatedHeader';

interface AISecretaryPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export const AISecretaryPage: React.FC<AISecretaryPageProps> = ({ onBack, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AuthenticatedHeader 
        currentPage="Secretária de IA"
        onNavigateToDashboard={onBack}
        onLogout={onLogout}
      />

      <main className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Hero / Hook */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-darkBlue mb-4 leading-tight">
            E se você não precisasse fazer <br className="hidden md:block"/>nada disso manualmente?
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Você aprendeu o protocolo. Viu que funciona. Mas também viu o trabalho que dá fazer certo todos os dias.
          </p>
        </div>

        {/* Problem Section */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-2">
            A verdade é que...
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-red-900/80 text-lg">
              <X className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              Você não consegue responder toda mensagem em menos de 5 minutos
            </li>
            <li className="flex items-start gap-3 text-red-900/80 text-lg">
              <X className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              Sua recepcionista não dá conta do WhatsApp + balcão + telefone
            </li>
            <li className="flex items-start gap-3 text-red-900/80 text-lg">
              <X className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              Fim de semana a clínica fecha mas o WhatsApp das concorrentes não
            </li>
            <li className="flex items-start gap-3 text-red-900/80 text-lg">
              <X className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              Cliente que mandou mensagem às 21h só é respondida no dia seguinte
            </li>
            <li className="flex items-start gap-3 text-red-900/80 text-lg">
              <X className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              Você esquece de retornar pra quem pediu orçamento de harmonização há 3 dias
            </li>
          </ul>
        </div>

        {/* Solution Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-block bg-green-100 text-whatsappDark px-4 py-1 rounded-full text-sm font-bold mb-4 uppercase tracking-wide">
              A Solução Definitiva
            </div>
            <h2 className="text-3xl font-bold text-whatsapp mb-4">
              Apresentando: Secretária de IA para Clínicas
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Uma assistente virtual inteligente que atende seus clientes no WhatsApp 24 horas por dia, 7 dias por semana, com a mesma qualidade que você atenderia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Resposta Instantânea", desc: "Responde em segundos, não em horas. Mesmo às 3h da manhã ou no domingo." },
              { icon: Target, title: "Qualificação Inteligente", desc: "Identifica quem está pronto para agendar e quem está só pesquisando." },
              { icon: Calendar, title: "Agendamento Automático", desc: "Oferece horários disponíveis e agenda direto na sua agenda. Sem você precisar fazer nada." },
              { icon: RefreshCcw, title: "Follow-up Automático", desc: "Nunca mais esquece de retornar. A IA faz follow-up no momento certo." },
              { icon: MessageCircle, title: "Conversa Natural", desc: "Não parece robô. Responde dúvidas, contorna objeções, trata cada cliente de forma personalizada." },
              { icon: BarChart3, title: "Você no Controle", desc: "Acompanhe tudo pelo painel. Veja conversas, agendamentos e métricas em tempo real." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-whatsapp">
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-darkBlue mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-darkBlue mb-8">
            Manual vs. Secretária de IA
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Manual Column */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h4 className="text-center text-lg font-bold text-gray-500 mb-6 flex items-center justify-center gap-2">
                😓 Fazer Manual
              </h4>
              <ul className="space-y-4">
                {[
                  "Responder quando dá",
                  "Depender de funcionário",
                  "Perder lead fora do horário",
                  "Esquecer follow-up",
                  "Copiar e colar scripts",
                  "Você trabalhando mais"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-500 border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                    <span className="text-gray-400">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Column */}
            <div className="bg-green-50 rounded-2xl p-8 border-2 border-whatsapp relative overflow-hidden shadow-lg transform md:-translate-y-2">
              <div className="absolute top-0 right-0 bg-whatsapp text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                RECOMENDADO
              </div>
              <h4 className="text-center text-lg font-bold text-whatsappDark mb-6 flex items-center justify-center gap-2">
                🤖 Secretária de IA
              </h4>
              <ul className="space-y-4">
                {[
                  "Resposta em segundos, sempre",
                  "Funciona sozinha, 24/7",
                  "Atende madrugada, feriado, domingo",
                  "Follow-up automático",
                  "Conversa inteligente e personalizada",
                  "Você focando no que importa"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-green-800 font-medium border-b border-green-200/50 pb-3 last:border-0 last:pb-0">
                    <CheckCircle2 className="w-5 h-5 text-whatsapp shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
            {/* Glow effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-whatsapp/5 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-8">
                <span className="bg-whatsapp text-white text-xs font-bold px-2 py-1 rounded-full mb-2 inline-block">
                  🎁 EXCLUSIVO
                </span>
                <p className="text-lg">
                  Clientes que vieram pelo diagnóstico têm <strong>condição especial</strong>.
                </p>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Quer saber como funciona para sua clínica?
              </h3>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Agende uma conversa gratuita de 15 minutos. Sem compromisso, sem enrolação.
              </p>

              <a 
                href="https://wa.me/5511999999999?text=Oi! Tenho uma clínica de estética e vim pelo diagnóstico. Quero saber mais sobre a Secretária de IA" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-whatsapp hover:bg-whatsappDark text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-green-500/20 transform transition hover:-translate-y-1 w-full md:w-auto justify-center"
              >
                <Smartphone className="w-6 h-6" />
                Quero conhecer a Secretária de IA
              </a>

              <p className="text-slate-500 text-sm mt-6">
                Vou te explicar como funciona, quanto custa e se faz sentido para seu negócio.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};