import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Copy, Check, ArrowRight, BookOpen, Lightbulb, Clock, Smartphone } from 'lucide-react';

interface SevenStepsProps {
  onBack: () => void;
  onNavigateToGenerator: () => void;
}

const steps = [
  {
    id: 1,
    title: "Resposta Imediata",
    problem: "Cliente manda mensagem e você demora pra responder. Quando responde, ele já foi pro concorrente.",
    solution: "Responder rápido NÃO significa resolver rápido. Significa reconhecer que viu a mensagem.",
    example: "Oi! Já vi sua mensagem 😊\nVou te responder certinho em instantes.",
    implementationTime: "2 minutos",
    implementation: (
      <div className="space-y-4">
        <div>
          <strong className="block text-darkBlue mb-1">Opção 1: Mensagem automática no WhatsApp Business (Recomendado)</strong>
          <ol className="list-decimal list-inside text-gray-600 space-y-1 text-sm">
            <li>Abra o WhatsApp Business</li>
            <li>Vá em <strong>Configurações</strong> → <strong>Ferramentas comerciais</strong> → <strong>Mensagem de ausência</strong></li>
            <li>Ative e cole o script</li>
            <li>Configure o horário (fora do expediente)</li>
          </ol>
        </div>
        <div>
          <strong className="block text-darkBlue mb-1">Opção 2: Mensagem de saudação automática</strong>
          <ol className="list-decimal list-inside text-gray-600 space-y-1 text-sm">
            <li>Vá em <strong>Configurações</strong> → <strong>Ferramentas comerciais</strong> → <strong>Mensagem de saudação</strong></li>
            <li>Cole o script de boas-vindas</li>
            <li>Será enviada automaticamente quando alguém te chamar pela primeira vez</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Expectativa Clara",
    problem: "Cliente não sabe como funciona seu atendimento e fica perdido ou frustrado.",
    solution: "Explicar como funciona logo no início. Cliente com expectativa certa = cliente satisfeito.",
    example: "Aqui funciona assim:\n\n1. Vou entender o que você precisa\n2. Tiro suas dúvidas\n3. Se fizer sentido, te explico o próximo passo\n\nPode ser?",
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
        <p className="text-sm text-gray-500 italic bg-white p-2 rounded border border-gray-200">
          <strong>Dica:</strong> Crie um atalho fácil de lembrar. Toda vez que iniciar uma conversa, digite o atalho.
        </p>
      </div>
    )
  },
  {
    id: 3,
    title: "Pergunta Certa",
    problem: "Você gasta tempo igual com todo mundo, inclusive com quem nunca ia comprar.",
    solution: "Fazer 1-2 perguntas que revelam se a pessoa está pronta pra comprar ou só pesquisando.",
    example: "Só pra te ajudar melhor: você está buscando isso pra agora ou ainda está pesquisando opções?",
    implementationTime: "3 minutos",
    implementation: (
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 text-sm mb-2"><strong>Criar Resposta Rápida de qualificação:</strong></p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            <li>Vá em Respostas rápidas no WhatsApp Business</li>
            <li>Atalho sugerido: <code className="bg-gray-200 px-1 rounded text-darkBlue">/qualifica</code> ou <code className="bg-gray-200 px-1 rounded text-darkBlue">/pergunta</code></li>
            <li>Cole a pergunta de qualificação</li>
          </ul>
        </div>
        
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <p className="bg-gray-100 px-3 py-2 text-xs font-bold text-gray-500 uppercase">Como interpretar as respostas</p>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">Resposta</th>
                <th className="px-3 py-2 font-medium">Significado</th>
                <th className="px-3 py-2 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-3 py-2 text-gray-700">"Preciso urgente"</td>
                <td className="px-3 py-2 text-red-500 font-bold">🔥 Quente</td>
                <td className="px-3 py-2 text-gray-600">Prioridade máxima</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-gray-700">"Essa semana/mês"</td>
                <td className="px-3 py-2 text-yellow-600 font-bold">🟡 Morno</td>
                <td className="px-3 py-2 text-gray-600">Conduzir normalmente</td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-gray-700">"Só pesquisando"</td>
                <td className="px-3 py-2 text-blue-500 font-bold">🔵 Frio</td>
                <td className="px-3 py-2 text-gray-600">Educar sem pressionar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Apresentação Simples",
    problem: "Você manda textão explicando tudo, cliente não lê e some.",
    solution: "Explicar seu serviço em 3-4 linhas usando a fórmula: Problema → Solução → Resultado",
    example: "A gente ajuda negócios que perdem vendas por demora no WhatsApp.\nFunciona assim: o cliente chama, é atendido na hora, e sua equipe só fala com quem quer fechar.\nResultado: você não perde mais contato por demora.",
    implementationTime: "5 minutos",
    implementation: (
      <div className="space-y-4">
        <div>
          <p className="text-gray-600 text-sm mb-2"><strong>Criar Resposta Rápida personalizada:</strong></p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            <li>Adapte o script modelo para seu serviço/produto</li>
            <li>Atalho sugerido: <code className="bg-gray-200 px-1 rounded text-darkBlue">/apresenta</code> ou <code className="bg-gray-200 px-1 rounded text-darkBlue">/servico</code></li>
          </ul>
        </div>
        
        <div className="bg-white p-3 rounded border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Fórmula para adaptar</p>
          <div className="space-y-2 text-sm text-gray-700 font-mono">
            <p><span className="text-blue-600">Linha 1:</span> [O que você faz] + [para quem]</p>
            <p><span className="text-blue-600">Linha 2:</span> Funciona assim: [como funciona em 1 frase]</p>
            <p><span className="text-blue-600">Linha 3:</span> Resultado: [benefício principal]</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Condução",
    problem: "Você espera o cliente pedir pra comprar. Ele nunca pede e some.",
    solution: "Oferecer o próximo passo de forma natural, sem pressionar.",
    example: "Se fizer sentido pra você, o próximo passo é [agendar/orçar/etc].\nQuer que eu te explique como funciona?",
    implementationTime: "3 minutos",
    implementation: (
      <div className="space-y-3">
        <div>
          <p className="text-gray-600 text-sm"><strong>Criar Resposta Rápida de condução:</strong></p>
          <p className="text-sm text-gray-600 mt-1">Atalho sugerido: <code className="bg-gray-200 px-1 rounded text-darkBlue">/proximo</code> ou <code className="bg-gray-200 px-1 rounded text-darkBlue">/avancar</code></p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-green-50 p-2 rounded border border-green-100">
            <span className="block font-bold text-green-700 mb-1">Quando usar:</span>
            <ul className="list-disc list-inside text-gray-600 text-xs space-y-1">
              <li>Depois de explicar serviço</li>
              <li>Cliente demonstrou interesse</li>
              <li>Cliente parou de perguntar</li>
            </ul>
          </div>
          <div className="bg-red-50 p-2 rounded border border-red-100">
            <span className="block font-bold text-red-600 mb-1">Nunca use se:</span>
            <ul className="list-disc list-inside text-gray-600 text-xs space-y-1">
              <li>Cliente tem muitas dúvidas</li>
              <li>Disse "só pesquisando"</li>
              <li>Conversa acabou de começar</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-3 rounded border border-gray-200 text-sm">
          <p className="font-bold text-gray-600 mb-1">Variações úteis:</p>
          <ul className="space-y-1 text-gray-600">
            <li><code className="bg-gray-100 px-1 rounded">/proximo</code> → "Se fizer sentido, o próximo passo é..."</li>
            <li><code className="bg-gray-100 px-1 rounded">/duvida</code> → "O que ainda precisa saber?"</li>
            <li><code className="bg-gray-100 px-1 rounded">/comparando</code> → "Posso te ajudar a comparar..."</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Encaminhamento Claro",
    problem: "Conversa de 3 dias que não fecha. Cliente some no meio.",
    solution: "Sempre ter próximo passo concreto: agendamento, orçamento, pagamento ou transferência.",
    example: "Perfeito! Tenho esses horários essa semana:\n\nTerça às 14h\nQuarta às 10h\nQuinta às 16h\n\nQual funciona melhor pra você?",
    implementationTime: "5 minutos",
    implementation: (
      <div className="space-y-4">
        <p className="text-gray-600 text-sm"><strong>Criar Respostas Rápidas para cada tipo:</strong></p>
        
        <div className="space-y-3">
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-darkBlue text-sm">1. Para Agendamentos</span>
              <code className="bg-gray-100 px-1 rounded text-xs text-gray-500">/agenda</code>
            </div>
            <p className="text-gray-600 text-xs italic">"Tenho esses horários essa semana: [lista]..."</p>
          </div>

          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-darkBlue text-sm">2. Para Orçamentos</span>
              <code className="bg-gray-100 px-1 rounded text-xs text-gray-500">/orcamento</code>
            </div>
            <p className="text-gray-600 text-xs italic">"Pra passar o valor, preciso saber: 1... 2..."</p>
          </div>

          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-darkBlue text-sm">3. Para Confirmar</span>
              <code className="bg-gray-100 px-1 rounded text-xs text-gray-500">/confirma</code>
            </div>
            <p className="text-gray-600 text-xs italic">"Agendado! Me passa seu nome completo..."</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Registro e Follow-up",
    problem: "Você esquece de dar follow-up e perde cliente que estava interessado.",
    solution: "Anotar todo contato com status (quente/morno/frio) e próximo passo.",
    example: "Oi [Nome]!\nPassando aqui pra saber se ainda faz sentido [o que conversaram].\nQualquer dúvida, estou por aqui 😊",
    implementationTime: "10 minutos",
    implementation: (
      <div className="space-y-4">
        <div>
          <strong className="block text-darkBlue text-sm mb-1">Opção 1: Etiquetas do WhatsApp Business (Simples)</strong>
          <ol className="list-decimal list-inside text-gray-600 space-y-1 text-sm">
            <li>Vá em uma conversa → 3 pontinhos → Etiqueta</li>
            <li>Crie: 🔥 Quente | 🟡 Morno | 🔵 Frio | ✅ Fechou</li>
            <li>Marque cada conversa e filtre depois para cobrar</li>
          </ol>
        </div>

        <div>
          <strong className="block text-darkBlue text-sm mb-1">Opção 2: Respostas Rápidas de Follow-up</strong>
          <div className="grid grid-cols-1 gap-2 mt-1">
            <div className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded text-sm">
              <span className="text-red-500 font-bold">Quente (1-2 dias)</span>
              <code className="bg-gray-100 px-1 rounded text-xs">/followquente</code>
            </div>
            <div className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded text-sm">
              <span className="text-yellow-600 font-bold">Morno (3-5 dias)</span>
              <code className="bg-gray-100 px-1 rounded text-xs">/followmorno</code>
            </div>
            <div className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded text-sm">
              <span className="text-blue-500 font-bold">Frio (7-15 dias)</span>
              <code className="bg-gray-100 px-1 rounded text-xs">/followfrio</code>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded border border-blue-100 text-sm">
          <p className="font-bold text-blue-800 mb-1">Rotina Sugerida:</p>
          <ul className="list-none space-y-1 text-blue-900/80 text-xs">
            <li>📅 <strong>Todo dia:</strong> Verificar etiquetas 🔥</li>
            <li>📅 <strong>Toda quarta:</strong> Verificar etiquetas 🟡</li>
            <li>📅 <strong>Toda segunda:</strong> Verificar etiquetas 🔵</li>
          </ul>
        </div>
      </div>
    )
  }
];

export const SevenSteps: React.FC<SevenStepsProps> = ({ onBack, onNavigateToGenerator }) => {
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-gray-500 hover:text-darkBlue hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-darkBlue flex-1">
            Os 7 Passos
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Intro */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-3">
            O Protocolo que Converte
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Cada passo resolve um problema específico. Todos juntos criam um processo comercial que <span className="font-semibold text-whatsappDark">transforma conversas em vendas</span>.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
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
        <div className="mt-12 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
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
                  { code: "/apresenta", desc: "Apresentação do serviço" },
                  { code: "/proximo", desc: "Condução para próximo passo" },
                  { code: "/agenda", desc: "Oferecer horários" },
                  { code: "/orcamento", desc: "Pedir dados para orçamento" },
                  { code: "/confirma", desc: "Confirmar agendamento" },
                  { code: "/followquente", desc: "Follow-up cliente quente" },
                  { code: "/followmorno", desc: "Follow-up cliente morno" },
                  { code: "/followfrio", desc: "Follow-up cliente frio" },
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

        {/* Footer Action */}
        <div className="mt-8 text-center pb-8">
          <button 
            onClick={onNavigateToGenerator}
            className="w-full md:w-auto bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto"
          >
            Agora crie seus scripts personalizados <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </main>
    </div>
  );
};