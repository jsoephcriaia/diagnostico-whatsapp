import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Info, ArrowRight, Stethoscope, Briefcase, GraduationCap, Wrench, ShoppingBag } from 'lucide-react';
import { AuthenticatedHeader } from './AuthenticatedHeader';

interface NicheExamplesProps {
  onBack: () => void;
  onGoToGenerator: () => void;
  onLogout: () => void;
}

const NICHES = [
  { id: 'clinica', label: 'Clínica de Estética', icon: Stethoscope },
  { id: 'escritorio', label: 'Escritório', icon: Briefcase },
  { id: 'escola', label: 'Escola / Curso', icon: GraduationCap },
  { id: 'servico', label: 'Prestador de Serviço', icon: Wrench },
  { id: 'loja', label: 'Loja / Comércio', icon: ShoppingBag },
];

const SCRIPTS_BY_NICHE: Record<string, { title: string; versions: { label?: string; text: string }[] }[]> = {
  clinica: [
    {
      title: "1. Resposta Imediata",
      versions: [
        { label: "Durante horário", text: "Oi! Aqui é da [Nome da Clínica] 😊\nJá vi sua mensagem, vou te responder em instantes!" },
        { label: "Fora do horário", text: "Oi! Obrigado por entrar em contato com a [Nome da Clínica] 😊\n\nNosso horário de atendimento é de segunda a sexta, das 8h às 18h, e sábado das 8h às 12h.\n\nAmanhã cedo já te respondo!\n\nSe quiser adiantar, me conta o que você precisa." }
      ]
    },
    {
      title: "2. Expectativa Clara",
      versions: [{ text: "Oi [Nome]! Tudo bem?\n\nAqui funciona assim:\n1. Vou entender o que você precisa\n2. Tiro suas dúvidas sobre o tratamento\n3. Se fizer sentido, a gente agenda sua avaliação\n\nPode ser?" }]
    },
    {
      title: "3. Pergunta de Qualificação",
      versions: [
        { label: "Opção 1", text: "Você está buscando agendar pra essa semana ou mais pra frente?" },
        { label: "Opção 2", text: "Você já sabe o tratamento que precisa ou quer uma avaliação primeiro pra gente te orientar?" }
      ]
    },
    {
      title: "4. Apresentação do Serviço",
      versions: [{ text: "Aqui na [Nome da Clínica] a gente trabalha com [especialidades], focado em atendimento humanizado e sem dor.\n\nFunciona assim: na primeira consulta fazemos uma avaliação completa, explicamos tudo que precisa, e você decide se quer seguir.\n\nResultado: você resolve o problema com tratamento personalizado e sem surpresa de valor." }]
    },
    {
      title: "5. Condução",
      versions: [{ text: "Se fizer sentido pra você, o próximo passo é agendar sua avaliação.\n\nQuer que eu veja os horários disponíveis?" }]
    },
    {
      title: "6. Encaminhamento",
      versions: [
        { label: "Agendamento", text: "Perfeito! Tenho esses horários essa semana:\n\n- Terça às 14h\n- Quarta às 10h\n- Quinta às 16h\n\nQual funciona melhor pra você?" },
        { label: "Confirmação", text: "Agendado pra [dia] às [hora] 👍\n\nMe passa seu nome completo pra eu reservar.\n\nNo dia, chega uns 10 minutos antes pra fazer o cadastro tranquilo.\n\nQualquer coisa é só chamar!" }
      ]
    },
    {
      title: "7. Follow-up",
      versions: [
        { label: "Cliente quente", text: "Oi [Nome]!\n\nPassando aqui pra saber se ainda quer agendar sua avaliação.\n\nQualquer dúvida, estou por aqui 😊" },
        { label: "Cliente morno", text: "Oi [Nome]!\n\nLembrei de você aqui.\n\nAinda faz sentido agendar aquela avaliação?\n\nSe tiver qualquer dúvida, me fala que te ajudo." },
        { label: "Cliente frio", text: "Oi [Nome]!\n\nComo tá por aí?\n\nSe em algum momento precisar de atendimento, pode me chamar que te ajudo certinho." }
      ]
    }
  ],
  escritorio: [
    {
      title: "1. Resposta Imediata",
      versions: [
        { label: "Durante horário", text: "Olá! Aqui é do escritório [Nome].\nRecebi sua mensagem, já te retorno." },
        { label: "Fora do horário", text: "Olá! Obrigado por entrar em contato com o escritório [Nome].\n\nNosso horário de atendimento é de segunda a sexta, das 9h às 18h.\n\nAmanhã te retorno.\n\nSe quiser adiantar, pode me contar brevemente sobre seu caso que já me preparo pra te ajudar." }
      ]
    },
    {
      title: "2. Expectativa Clara",
      versions: [{ text: "Olá [Nome], tudo bem?\n\nAqui funciona assim:\n1. Vou entender seu caso\n2. Esclareço as principais dúvidas\n3. Se fizer sentido, agendamos uma consulta pra analisar em detalhes\n\nPode ser?" }]
    },
    {
      title: "3. Pergunta de Qualificação",
      versions: [
        { label: "Opção 1", text: "Pra te orientar melhor: seu caso é relacionado a [área A] ou [área B]?" },
        { label: "Opção 2", text: "Você já tem documentação do caso ou está buscando uma orientação inicial primeiro?" }
      ]
    },
    {
      title: "4. Apresentação do Serviço",
      versions: [{ text: "Aqui no [Nome do Escritório] trabalhamos com [áreas de atuação], focado em resolver seu caso com acompanhamento próximo e comunicação clara em cada etapa.\n\nFunciona assim: na primeira consulta analisamos sua situação, explicamos suas opções, e você decide se quer seguir.\n\nResultado: você entende seus direitos e tem um plano claro de ação." }]
    },
    {
      title: "5. Condução",
      versions: [{ text: "Se fizer sentido, o próximo passo é agendar uma consulta inicial pra analisar seu caso.\n\nQuer que eu veja os horários disponíveis?" }]
    },
    {
      title: "6. Encaminhamento",
      versions: [
        { label: "Opções", text: "Certo. Tenho disponibilidade essa semana:\n\n- Terça às 10h\n- Quarta às 15h\n- Quinta às 14h\n\nQual horário funciona melhor?" },
        { label: "Confirmação", text: "Confirmado pra [dia] às [hora].\n\nMe passa seu nome completo e um email pra eu te enviar a confirmação.\n\nSe tiver documentos do caso, pode trazer no dia.\n\nQualquer dúvida, estou à disposição." }
      ]
    },
    {
      title: "7. Follow-up",
      versions: [
        { label: "Cliente quente", text: "Olá [Nome],\n\nPassando pra saber se ainda tem interesse em agendar a consulta.\n\nFico à disposição pra esclarecer qualquer dúvida." },
        { label: "Cliente morno", text: "Olá [Nome],\n\nGostaria de saber se conseguiu analisar a proposta que enviei.\n\nQualquer dúvida, estou à disposição." },
        { label: "Cliente frio", text: "Olá [Nome],\n\nEspero que esteja bem.\n\nCaso precise de assessoria jurídica/contábil no futuro, pode contar conosco.\n\nAtenciosamente." }
      ]
    }
  ],
  escola: [
    {
      title: "1. Resposta Imediata",
      versions: [
        { label: "Durante horário", text: "Oi! Aqui é da [Nome da Escola] 😊\nJá vi sua mensagem, vou te responder em instantes!" },
        { label: "Fora do horário", text: "Oi! Obrigado por entrar em contato com a [Nome da Escola] 😊\n\nAtendemos de segunda a sexta, das 8h às 20h, e sábado das 8h às 12h.\n\nAmanhã já te respondo!\n\nSe quiser adiantar, me conta: você está buscando informações pra você ou pra alguém da família?" }
      ]
    },
    {
      title: "2. Expectativa Clara",
      versions: [{ text: "Oi [Nome]! Tudo bem?\n\nQue legal seu interesse! \n\nVou te explicar como funciona nosso curso, tirar suas dúvidas, e se fizer sentido, te explico como fazer a matrícula.\n\nPode ser?" }]
    },
    {
      title: "3. Pergunta de Qualificação",
      versions: [
        { label: "Opção 1", text: "Você está buscando começar agora ou está planejando pra mais pra frente?" },
        { label: "Opção 2", text: "Você já fez algum curso de [área] antes ou seria a primeira vez?" }
      ]
    },
    {
      title: "4. Apresentação do Serviço",
      versions: [{ text: "A [Nome da Escola] oferece cursos de [área] pra quem quer [resultado/objetivo].\n\nFunciona assim: turmas [tamanho], aulas [frequência], material incluso e acompanhamento individual.\n\nResultado: você aprende [habilidade] de forma prática e consegue [benefício] em [prazo]." }]
    },
    {
      title: "5. Condução",
      versions: [{ text: "Se fizer sentido, o próximo passo é agendar uma visita pra você conhecer nossa estrutura.\n\nOu se preferir, posso te passar os valores e condições por aqui mesmo.\n\nO que prefere?" }]
    },
    {
      title: "6. Encaminhamento",
      versions: [
        { label: "Para visita", text: "Ótimo! Tenho esses horários pra visita:\n\n- Terça às 14h\n- Quarta às 10h\n- Sábado às 9h\n\nQual funciona melhor pra você?" },
        { label: "Para matrícula", text: "Perfeito! Pra fazer sua matrícula, preciso de:\n\n- Nome completo\n- CPF\n- Data de nascimento\n\nMe passa esses dados que já inicio o processo aqui 😊" }
      ]
    },
    {
      title: "7. Follow-up",
      versions: [
        { label: "Cliente quente", text: "Oi [Nome]!\n\nPassando pra saber se ainda quer agendar sua visita/matrícula.\n\nAs turmas de [período] estão quase fechando!\n\nQualquer dúvida, me chama 😊" },
        { label: "Cliente morno", text: "Oi [Nome]!\n\nLembrei de você aqui.\n\nConseguiu pensar sobre o curso?\n\nSe tiver qualquer dúvida, me fala que te ajudo." },
        { label: "Cliente frio", text: "Oi [Nome]!\n\nComo vai?\n\nSe em algum momento tiver interesse em nossos cursos, pode me chamar que te explico tudo certinho.\n\nAbraço!" }
      ]
    }
  ],
  servico: [
    {
      title: "1. Resposta Imediata",
      versions: [
        { label: "Durante horário", text: "Oi! Tudo bem?\nJá vi sua mensagem, vou te responder em instantes!" },
        { label: "Fora do horário", text: "Oi! Obrigado por entrar em contato 😊\n\nAtendo de segunda a sexta, das 8h às 18h, e sábado das 8h às 12h.\n\nAmanhã cedo já te respondo!\n\nSe quiser adiantar, me conta o que você precisa." }
      ]
    },
    {
      title: "2. Expectativa Clara",
      versions: [{ text: "Oi [Nome]! Tudo bem?\n\nVou entender o que você precisa, tirar suas dúvidas, e se fizer sentido, passo um orçamento certinho.\n\nPode ser?" }]
    },
    {
      title: "3. Pergunta de Qualificação",
      versions: [
        { label: "Opção 1", text: "Você está buscando fazer isso pra quando? Tem urgência ou está planejando?" },
        { label: "Opção 2", text: "Você já tem ideia do que precisa ou quer que eu vá até aí dar uma olhada primeiro?" }
      ]
    },
    {
      title: "4. Apresentação do Serviço",
      versions: [{ text: "Eu trabalho com [tipo de serviço] em [região], especializado em [diferencial].\n\nFunciona assim: vou até você, avalio o que precisa, passo o orçamento na hora, e se fechar a gente já agenda o início.\n\nResultado: você resolve [problema] com prazo certo, garantia e sem dor de cabeça." }]
    },
    {
      title: "5. Condução",
      versions: [{ text: "Se fizer sentido, o próximo passo é eu ir até você pra avaliar e passar o orçamento.\n\nQual o melhor dia e horário pra você?" }]
    },
    {
      title: "6. Encaminhamento",
      versions: [
        { label: "Para visita/orçamento", text: "Beleza! Posso ir aí essa semana:\n\n- Terça de manhã\n- Quarta à tarde\n- Quinta de manhã\n\nQual funciona melhor? Me passa o endereço que eu coloco no GPS." },
        { label: "Confirmação", text: "Confirmado pra [dia] às [hora] 👍\n\nEndereço: [endereço]\n\nQualquer imprevisto, me avisa antes.\n\nAté lá!" }
      ]
    },
    {
      title: "7. Follow-up",
      versions: [
        { label: "Cliente quente", text: "Oi [Nome]!\n\nPassando pra saber se ainda precisa do orçamento.\n\nTenho disponibilidade essa semana ainda.\n\nMe avisa!" },
        { label: "Cliente morno", text: "Oi [Nome]!\n\nLembrei de você aqui.\n\nConseguiu analisar o orçamento que te passei?\n\nQualquer dúvida, me fala." },
        { label: "Cliente frio", text: "Oi [Nome]!\n\nComo tá por aí?\n\nSe precisar de [serviço] no futuro, pode me chamar que te ajudo.\n\nAbraço!" }
      ]
    }
  ],
  loja: [
    {
      title: "1. Resposta Imediata",
      versions: [
        { label: "Durante horário", text: "Oi! Seja bem-vindo(a) à [Nome da Loja] 😊\nJá te respondo!" },
        { label: "Fora do horário", text: "Oi! Obrigado por entrar em contato com a [Nome da Loja] 😊\n\nNosso horário de atendimento é de segunda a sábado, das 9h às 18h.\n\nAmanhã já te respondo!\n\nSe quiser adiantar, me conta o que você está procurando." }
      ]
    },
    {
      title: "2. Expectativa Clara",
      versions: [{ text: "Oi! Tudo bem?\n\nVou te ajudar a encontrar o que precisa 😊\n\nMe conta o que você está buscando que já te mostro as opções." }]
    },
    {
      title: "3. Pergunta de Qualificação",
      versions: [
        { label: "Opção 1", text: "Você já conhece nossa loja ou é a primeira vez?" },
        { label: "Opção 2", text: "Você está buscando pra você ou pra presente?" }
      ]
    },
    {
      title: "4. Apresentação do Serviço",
      versions: [{ text: "Aqui na [Nome da Loja] você encontra [tipos de produtos], com [diferencial - qualidade, preço, variedade].\n\nEntregamos em [região/prazo] e parcelamos em até [X]x.\n\nQuer que eu te mande fotos de algumas opções?" }]
    },
    {
      title: "5. Condução",
      versions: [{ text: "Gostou de algum? Posso separar pra você!\n\nVocê prefere retirar na loja ou entregamos no seu endereço?" }]
    },
    {
      title: "6. Encaminhamento",
      versions: [
        { label: "Para venda", text: "Perfeito! Pra finalizar seu pedido:\n\nProduto: [produto]\nValor: R$ [valor]\nPagamento: [forma]\n\nMe passa seu nome completo e endereço de entrega que já separo aqui 😊" },
        { label: "Confirmação", text: "Pedido confirmado! ✅\n\nProduto: [produto]\nValor: R$ [valor]\nEntrega: [prazo]\n\nAssim que sair pra entrega, te aviso!\n\nObrigado pela compra 💚" }
      ]
    },
    {
      title: "7. Follow-up",
      versions: [
        { label: "Cliente quente", text: "Oi [Nome]!\n\nVi que você se interessou pelo [produto].\n\nAinda temos em estoque! Quer que eu separe pra você?" },
        { label: "Cliente morno", text: "Oi [Nome]!\n\nLembrei de você 😊\n\nAquele [produto] que você gostou ainda está disponível.\n\nQuer fechar?" },
        { label: "Cliente frio", text: "Oi [Nome]!\n\nTudo bem?\n\nChegaram novidades aqui na loja! Se quiser dar uma olhada, me chama que te mando.\n\nAbraço!" }
      ]
    }
  ]
};

export const NicheExamples: React.FC<NicheExamplesProps> = ({ onBack, onGoToGenerator, onLogout }) => {
  const [selectedNiche, setSelectedNiche] = useState('clinica');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentScripts = SCRIPTS_BY_NICHE[selectedNiche];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AuthenticatedHeader 
        currentPage="Exemplos por Nicho"
        onNavigateToDashboard={onBack}
        onLogout={onLogout}
      />

      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Niche Selector */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {NICHES.map((niche) => {
            const Icon = niche.icon;
            const isSelected = selectedNiche === niche.id;
            
            return (
              <button
                key={niche.id}
                onClick={() => setSelectedNiche(niche.id)}
                className={`flex flex-col items-center gap-2 min-w-[100px] p-3 rounded-xl border-2 transition-all ${
                  isSelected 
                    ? 'border-whatsapp bg-green-50 text-darkBlue' 
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <div className={`p-2 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-whatsapp' : 'text-gray-500'}`} />
                </div>
                <span className="text-xs font-bold text-center leading-tight">{niche.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tip Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Dica:</strong> Copie o script e substitua os textos entre colchetes (ex: [Nome da Clínica], [Nome]) pelos dados reais do seu negócio.
          </p>
        </div>

        {/* Scripts List */}
        <div className="space-y-6">
          {currentScripts.map((script, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-darkBlue text-lg">{script.title}</h3>
              </div>
              
              <div className="p-4 space-y-4">
                {script.versions.map((version, vIdx) => (
                  <div key={vIdx} className="space-y-2">
                    {version.label && (
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                        {version.label}
                      </span>
                    )}
                    
                    <div className="relative group">
                      <div className="bg-slate-800 text-gray-100 p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {version.text}
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(version.text, `${idx}-${vIdx}`)}
                        className={`absolute top-2 right-2 p-2 rounded-md shadow-sm transition-all flex items-center gap-1 text-xs font-bold ${
                          copiedId === `${idx}-${vIdx}`
                            ? 'bg-green-500 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {copiedId === `${idx}-${vIdx}` ? (
                          <> <Check className="w-3 h-3" /> Copiado! </>
                        ) : (
                          <> <Copy className="w-3 h-3" /> Copiar </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-12 space-y-4">
          <button 
            onClick={onGoToGenerator}
            className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            Personalizar para meu negócio <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onBack}
            className="w-full text-gray-500 hover:text-darkBlue font-medium py-2 transition"
          >
            ← Voltar ao menu
          </button>
        </div>

      </main>
    </div>
  );
};