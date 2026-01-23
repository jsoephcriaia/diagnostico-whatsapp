import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, ArrowRight, BookOpen, Lightbulb, Clock, Smartphone } from 'lucide-react';
import { AuthenticatedHeader } from './AuthenticatedHeader';

interface SevenStepsProps {
  onBack: () => void;
  onNavigateToGenerator: () => void;
  onLogout: () => void;
}

const steps = [
  {
    id: 1,
    title: "Resposta Imediata",
    problem: "Cliente manda mensagem sobre um procedimento e você demora. Quando responde, ela já marcou em outro lugar.",
    solution: "Responder rápido NÃO significa ficar 24h no celular. Significa automatizar a primeira resposta.",
    example: "Oi! Aqui é da [Nome da Clínica] 😊\nJá vi sua mensagem! Me conta o que você está buscando que já te ajudo.",
    implementationTime: "2 minutos",
    implementation: (
      <div className="space-y-4">
        <div>
          <strong className="block text-darkBlue mb-1">Opção 1: Mensagem de Ausência (Para quando estiver fechado)</strong>
          <div className="bg-gray-100 p-2 rounded text-sm text-gray-700 italic mb-2">
            "Oi! Que bom que você entrou em contato com a [Nome da Clínica] 😊<br/><br/>
            Nosso horário de atendimento é de segunda a sexta das 9h às 19h e sábado das 9h às 14h.<br/><br/>
            Mas pode me contar o que você precisa que amanhã bem cedo já te respondo!"
          </div>
          <ol className="list-decimal list-inside text-gray-600 space-y-1 text-sm">
            <li>Abra o WhatsApp Business</li>
            <li>Vá em <strong>Configurações</strong> → <strong>Ferramentas comerciais</strong> → <strong>Mensagem de ausência</strong></li>
            <li>Ative e cole o script</li>
            <li>Configure o horário (fora do expediente)</li>
          </ol>
        </div>
        <div>
          <strong className="block text-darkBlue mb-1">Opção 2: Mensagem de Saudação</strong>
          <div className="bg-gray-100 p-2 rounded text-sm text-gray-700 italic mb-2">
             "Oi! Aqui é da [Nome da Clínica] 😊 Já vi sua mensagem! Me conta o que você está buscando que já te ajudo."
          </div>
          <ol className="list-decimal list-inside text-gray-600 space-y-1 text-sm">
            <li>Vá em <strong>Configurações</strong> → <strong>Ferramentas comerciais</strong> → <strong>Mensagem de saudação</strong></li>
            <li>Cole o script de boas-vindas</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Expectativa Clara",
    problem: "Cliente não entende como funciona e fica perdida ou ansiosa.",
    solution: "Explicar como funciona logo no início. Cliente segura é cliente que agenda.",
    example: "Oi [Nome]! Tudo bem?\n\nVou te explicar direitinho como funciona:\n1. Primeiro entendo o que você está buscando\n2. Te explico como o procedimento funciona e os resultados esperados\n3. Se fizer sentido, a gente agenda sua avaliação\n\nPode ser assim?",
    implementationTime: "2 minutos",
    implementation: (
      <div className="space-y-3">
        <p className="text-gray-600 text-sm"><strong>Usar Respostas Rápidas do WhatsApp Business:</strong></p>
        <ol className="list-decimal list-inside text-gray-600 space-y-1 text-sm">
          <li>Vá em <strong>Configurações</strong> → <strong>Ferramentas comerciais</strong> → <strong>Respostas rápidas</strong></li>
          <li>Crie uma nova resposta rápida</li>
          <li>Atalho sugerido: <code className="bg-gray-200 px-1 rounded text-darkBlue">/inicio</code> ou <code className="bg-gray-200 px-1 rounded text-darkBlue">/ola</code></li>
          <li>Cole o script de expectativa</li>
        </ol>
      </div>
    )
  },
  {
    id: 3,
    title: "Pergunta de Qualificação",
    problem: "Você gasta tempo explicando tudo para quem só está curioso e não vai agendar.",
    solution: "Fazer uma pergunta estratégica antes de passar preço.",
    example: "Me conta: você já fez esse tipo de procedimento antes ou seria a primeira vez?",
    implementationTime: "3 minutos",
    implementation: (
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 text-sm mb-2"><strong>Variação importante:</strong></p>
          <div className="bg-gray-100 p-2 rounded text-sm text-gray-700 italic mb-2">
            "Você está querendo agendar pra essa semana ou ainda está pesquisando pra decidir?"
          </div>
          <p className="text-gray-600 text-sm mb-2"><strong>Criar Resposta Rápida:</strong></p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            <li>Atalho sugerido: <code className="bg-gray-200 px-1 rounded text-darkBlue">/qualifica</code></li>
            <li>Cole a pergunta</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Apresentação e Segurança",
    problem: "Cliente pergunta preço, você fala, ela some.",
    solution: "Gerar valor e segurança antes de falar de preço. O foco é na avaliação.",
    example: "Aqui na [Clínica] a gente é especializada em [procedimento].\n\nNa sua avaliação, vou analisar seu caso, te mostrar o que é possível fazer e você sai sabendo exatamente o investimento — sem surpresas.\n\nA avaliação é gratuita e sem compromisso. Muita gente vem só pra tirar dúvidas mesmo.",
    implementationTime: "5 minutos",
    implementation: (
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 text-sm mb-2"><strong>Criar Resposta Rápida personalizada:</strong></p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            <li>Adapte o script com o nome da sua clínica e procedimento principal</li>
            <li>Atalho sugerido: <code className="bg-gray-200 px-1 rounded text-darkBlue">/sobre</code> ou <code className="bg-gray-200 px-1 rounded text-darkBlue">/botox</code></li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Condução para Avaliação",
    problem: "Você espera a cliente pedir pra agendar. Ela nunca pede e some.",
    solution: "Oferecer o agendamento da avaliação como o próximo passo natural.",
    example: "Se você quiser, o próximo passo é agendar sua avaliação gratuita pra gente conversar pessoalmente.\n\nQuer que eu veja os horários disponíveis essa semana?",
    implementationTime: "3 minutos",
    implementation: (
      <div className="space-y-3">
        <div>
          <p className="text-gray-600 text-sm"><strong>Criar Resposta Rápida de condução:</strong></p>
          <p className="text-sm text-gray-600 mt-1">Atalho sugerido: <code className="bg-gray-200 px-1 rounded text-darkBlue">/vamos</code> ou <code className="bg-gray-200 px-1 rounded text-darkBlue">/agendar</code></p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Encaminhamento Claro",
    problem: "Fica num vai e vem de horários que cansa a cliente.",
    solution: "Dar opções fechadas de horário para facilitar a decisão.",
    example: "Ótimo! Essa semana tenho esses horários pra avaliação:\n\n• Terça às 14h\n• Quarta às 10h ou 16h\n• Quinta às 11h\n\nQual fica melhor pra você?",
    implementationTime: "5 minutos",
    implementation: (
      <div className="space-y-4">
        <p className="text-gray-600 text-sm"><strong>Criar Respostas Rápidas para cada momento:</strong></p>
        
        <div className="space-y-3">
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-darkBlue text-sm">1. Para Oferecer Horários</span>
              <code className="bg-gray-100 px-1 rounded text-xs text-gray-500">/horarios</code>
            </div>
            <p className="text-gray-600 text-xs italic">"Essa semana tenho: [lista]..."</p>
          </div>

          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-darkBlue text-sm">2. Para Confirmar</span>
              <code className="bg-gray-100 px-1 rounded text-xs text-gray-500">/confirma</code>
            </div>
            <p className="text-gray-600 text-xs italic">"Perfeito! Agendado pra [dia]... Nosso endereço:..."</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Registro e Follow-up",
    problem: "Você esquece de chamar quem não respondeu e perde a venda.",
    solution: "Recuperar quem sumiu com mensagens de cuidado, não de cobrança.",
    example: "Oi [Nome]! Tudo bem?\n\nPassando pra saber se você ainda quer agendar sua avaliação de [procedimento].\n\nEssa semana ainda tenho alguns horários. Me avisa se tiver interesse! 😊",
    implementationTime: "10 minutos",
    implementation: (
      <div className="space-y-4">
        <div>
          <strong className="block text-darkBlue text-sm mb-1">Opção 1: Etiquetas do WhatsApp</strong>
          <p className="text-sm text-gray-600 mb-2">Marque as clientes como "Quente", "Morna" ou "Fria".</p>
        </div>

        <div>
          <strong className="block text-darkBlue text-sm mb-1">Opção 2: Scripts de Recuperação</strong>
          <div className="grid grid-cols-1 gap-2 mt-1">
            <div className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded text-sm">
              <span className="text-red-500 font-bold">Quente (1-2 dias)</span>
              <code className="bg-gray-100 px-1 rounded text-xs">/oi1</code>
            </div>
            <div className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded text-sm">
              <span className="text-yellow-600 font-bold">Morna (4-5 dias)</span>
              <code className="bg-gray-100 px-1 rounded text-xs">/oi2</code>
            </div>
            <div className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded text-sm">
              <span className="text-blue-500 font-bold">Fria (10-15 dias)</span>
              <code className="bg-gray-100 px-1 rounded text-xs">/oi3</code>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export const SevenSteps: React.FC<SevenStepsProps> = ({ onBack, onNavigateToGenerator, onLogout }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const toggleStep = (id: number) => {
    setExpandedStep(expandedStep === id ? null : id);
  };

  const copyToClipboard = (text: string, id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpgradeClick = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-ai'));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AuthenticatedHeader 
        currentPage="Os 7 Passos"
        onNavigateToDashboard={onBack}
        onLogout={onLogout}
      />

      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Intro */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-3">
            O Protocolo que Transforma Mensagens em Agendamentos
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Cada passo resolve um problema específico do atendimento em clínicas de estética. Juntos, criam um processo que funciona — mesmo quando você não está online.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-4 mb-12">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                expandedStep === step.id 
                  ? 'border-whatsapp shadow-md ring-1 ring-whatsapp/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Card Header (Clickable) */}
              <button 
                onClick={() => toggleStep(step.id)}
                className="w-full p-5 flex items-center gap-4 text-left focus:outline-none"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
                  expandedStep === step.id 
                    ? 'bg-whatsapp text-white' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {step.id}
                </div>
                
                <h3 className={`flex-1 font-bold text-lg ${
                  expandedStep === step.id ? 'text-darkBlue' : 'text-gray-600'
                }`}>
                  {step.title}
                </h3>

                {expandedStep === step.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Card Content (Expandable) */}
              {expandedStep === step.id && (
                <div className="px-5 pb-6 pt-0 animate-fade-in">
                  <div className="pl-14 space-y-6">
                    
                    {/* Problem/Solution Grid */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm md:text-base">
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <span className="font-bold text-red-600 block mb-1">Problema:</span>
                        <p className="text-gray-700">{step.problem}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <span className="font-bold text-green-700 block mb-1">O que fazer:</span>
                        <p className="text-gray-700">{step.solution}</p>
                      </div>
                    </div>

                    {/* Script Example */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> Exemplo Prático
                        </span>
                        <button 
                          onClick={(e) => copyToClipboard(step.example, step.id, e)}
                          className={`text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1 transition-all ${
                            copiedId === step.id 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {copiedId === step.id ? (
                            <> <Check className="w-3 h-3" /> Copiado </>
                          ) : (
                            <> <Copy className="w-3 h-3" /> Copiar Script </>
                          )}
                        </button>
                      </div>
                      
                      <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner relative overflow-hidden group">
                        {step.example}
                        <div className="absolute top-0 left-0 w-1 h-full bg-whatsapp"></div>
                      </div>
                    </div>

                    {/* Implementation Tips */}
                    <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 md:p-5">
                      <div className="flex items-center justify-between mb-4 border-b border-blue-100 pb-2">
                        <h4 className="font-bold text-darkBlue flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          Como implementar na prática
                        </h4>
                        <span className="text-xs font-medium text-blue-600 flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-blue-100">
                          <Clock className="w-3 h-3" /> {step.implementationTime}
                        </span>
                      </div>
                      
                      {step.implementation}
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Shortcuts Summary */}
        <div className="mb-12 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-darkBlue p-4 flex items-center gap-2 text-white">
            <Smartphone className="w-5 h-5" />
            <h3 className="font-bold">Resumo: Seus Atalhos no WhatsApp</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Atalho</th>
                  <th className="px-4 py-3">Para que serve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { code: "/inicio", desc: "Mensagem de expectativa" },
                  { code: "/qualifica", desc: "Pergunta de qualificação" },
                  { code: "/sobre", desc: "Apresentação da clínica" },
                  { code: "/vamos", desc: "Condução para avaliação" },
                  { code: "/horarios", desc: "Oferecer horários" },
                  { code: "/confirma", desc: "Confirmar agendamento" },
                  { code: "/oi1", desc: "Follow-up cliente quente" },
                  { code: "/oi2", desc: "Follow-up cliente morna" },
                  { code: "/oi3", desc: "Follow-up cliente fria" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-darkBlue font-bold">{row.code}</td>
                    <td className="px-4 py-3 text-gray-600">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> Tempo total para implementar tudo: ~30 minutos
            </p>
          </div>
        </div>

        {/* 1. GREEN BUTTON: Go to Generator */}
        <div className="mb-12 text-center">
          <button 
            onClick={onNavigateToGenerator}
            className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Ir para o Gerador de Scripts <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* 2. CTA: AI Secretary */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-whatsapp rounded-2xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-3 flex items-center justify-center gap-2">
            Quer automatizar tudo isso?
          </h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Você aprendeu o protocolo. Agora imagine ele funcionando sozinho, 24 horas por dia, sem você precisar fazer nada.
          </p>
          <button 
            onClick={handleUpgradeClick}
            className="bg-whatsapp hover:bg-whatsappDark text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors inline-flex items-center gap-2 transform hover:scale-105"
          >
            Conhecer a Secretária de IA <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>
    </div>
  );
};