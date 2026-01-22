import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Wand2, Check, Copy, Clock, RotateCcw, Download, Loader2, Trash2 } from 'lucide-react';
import { BusinessInfo, GeneratedScript, SavedScriptsData } from '../types';

interface ScriptGeneratorProps {
  onBack: () => void;
}

const BUSINESS_TYPES = [
  { id: 'clinica', label: '🏥 Clínica / Consultório', detail: 'Dentista, médico, psicólogo...' },
  { id: 'escritorio', label: '📋 Escritório', detail: 'Advogado, contador, arquiteto...' },
  { id: 'escola', label: '🎓 Escola / Curso', detail: 'Idiomas, música, reforço...' },
  { id: 'servico', label: '🔧 Prestador de Serviço', detail: 'Reformas, manutenção, técnico...' },
  { id: 'loja', label: '🛍️ Loja / Comércio', detail: 'Roupas, acessórios, produtos...' },
  { id: 'outro', label: '💼 Outro', detail: 'Descreva seu negócio' },
];

const CLOSING_METHODS = [
  { id: 'agendamento', label: '📅 Agendamento', detail: 'Marca consulta ou visita' },
  { id: 'orcamento', label: '💰 Orçamento', detail: 'Envia proposta para aprovar' },
  { id: 'venda_direta', label: '🛒 Venda direta', detail: 'Cliente compra na hora' },
  { id: 'depende', label: '🔀 Depende do caso', detail: 'Varia conforme o cliente' },
];

const INITIAL_FORM_DATA: BusinessInfo = {
  businessType: '',
  businessName: '',
  whatYouDo: '',
  hours: '',
  closingMethod: '',
  differentiator: '',
};

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ onBack }) => {
  // State
  const [step, setStep] = useState<'intro' | 'form' | 'loading' | 'results'>('intro');
  const [formStep, setFormStep] = useState(0); // 0 to 5 for form questions
  const [formData, setFormData] = useState<BusinessInfo>(INITIAL_FORM_DATA);
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [generatedScripts, setGeneratedScripts] = useState<GeneratedScript[]>([]);
  const [loadingText, setLoadingText] = useState('Analisando seu negócio...');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSavedDataNotice, setShowSavedDataNotice] = useState(false);

  // Check for saved scripts AND saved form data on mount
  useEffect(() => {
    // 1. Check for previously filled form data
    const savedFormData = localStorage.getItem('dadosGerador');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        // Restore main form data
        setFormData({
          businessType: parsedData.businessType || '',
          businessName: parsedData.businessName || '',
          whatYouDo: parsedData.whatYouDo || '',
          hours: parsedData.hours || '',
          closingMethod: parsedData.closingMethod || '',
          differentiator: parsedData.differentiator || '',
        });
        
        // Restore custom business type if it was saved
        if (parsedData.customBusinessType) {
          setCustomBusinessType(parsedData.customBusinessType);
        }

        setShowSavedDataNotice(true);
      } catch (e) {
        console.error("Erro ao carregar dados salvos", e);
      }
    }
  }, []);

  // Loading text animation
  useEffect(() => {
    if (step === 'loading') {
      const texts = [
        "Analisando seu negócio...",
        "Criando a estratégia de atendimento...",
        "Escrevendo os scripts de venda...",
        "Personalizando para seu nicho...",
        "Finalizando os detalhes..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClearData = () => {
    localStorage.removeItem('dadosGerador');
    setFormData(INITIAL_FORM_DATA);
    setCustomBusinessType('');
    setShowSavedDataNotice(false);
    setFormStep(0);
  };

  const handleNextFormStep = () => {
    if (formStep < 5) {
      setFormStep(prev => prev + 1);
    } else {
      generateScripts();
    }
  };

  const handlePrevFormStep = () => {
    if (formStep > 0) {
      setFormStep(prev => prev - 1);
    } else {
      setStep('intro');
    }
  };

  const loadSavedScripts = () => {
    const saved = localStorage.getItem('scriptsGerados');
    if (saved) {
      const parsed: SavedScriptsData = JSON.parse(saved);
      setFormData(parsed.formData);
      setGeneratedScripts(parsed.scripts);
      setStep('results');
    }
  };

  // Template Generation Logic (Replaces API Call for Reliability)
  const generateScripts = async () => {
    setStep('loading');

    // Save form data to localStorage
    const dataToSave = {
      ...formData,
      customBusinessType // Save this too so we can restore it exactly
    };
    localStorage.setItem('dadosGerador', JSON.stringify(dataToSave));

    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const data = {
        ...formData,
        businessType: formData.businessType === 'outro' ? customBusinessType : formData.businessType
      };

      // Helper to determine closing specific text
      let script6Text = "";
      let script5Conducao = "";
      
      const methodLower = data.closingMethod.toLowerCase();
      
      if (methodLower.includes('agendamento')) {
        script5Conducao = "agendar um horário";
        script6Text = `Perfeito! Tenho esses horários essa semana:\n\n- Terça às 14h\n- Quarta às 10h\n- Quinta às 16h\n\nQual funciona melhor pra você?`;
      } else if (methodLower.includes('orçamento')) {
        script5Conducao = "eu te passar um orçamento";
        script6Text = `Beleza! Pra te passar o orçamento certinho, preciso saber:\n\n1. O que exatamente você precisa?\n2. Pra quando seria?\n\nMe passa isso que te retorno rapidinho.`;
      } else if (methodLower.includes('venda')) {
        script5Conducao = "fechar o pedido";
        script6Text = `Perfeito! Pra confirmar seu pedido, preciso só do seu nome completo e endereço de entrega.\n\nMe passa que já finalizo aqui.`;
      } else {
         script5Conducao = "agendar uma conversa";
         script6Text = `Para darmos seguimento, qual o melhor horário para eu te ligar e entendermos melhor sua necessidade?`;
      }

      const templates: GeneratedScript[] = [
        {
          numero: 1,
          titulo: "Resposta Imediata",
          versoes: [
            {
              nome: "Durante horário",
              texto: `Oi! Aqui é da ${data.businessName} 😊\nJá vi sua mensagem, vou te responder em instantes!`
            },
            {
              nome: "Fora do horário",
              texto: `Oi! Obrigado por entrar em contato com a ${data.businessName} 😊\n\nNosso horário de atendimento é ${data.hours}.\n\nAmanhã cedo já te respondo!\n\nSe quiser adiantar, me conta o que você precisa.`
            }
          ]
        },
        {
          numero: 2,
          titulo: "Expectativa Clara",
          texto: `Oi! Tudo bem?\n\nAqui funciona assim:\n1. Vou entender o que você precisa\n2. Tiro suas dúvidas\n3. Se fizer sentido, te explico o próximo passo\n\nPode ser?`
        },
        {
          numero: 3,
          titulo: "Pergunta de Qualificação",
          texto: `Só pra te ajudar melhor: você está buscando isso pra agora ou ainda está pesquisando opções?`
        },
        {
          numero: 4,
          titulo: "Apresentação do Serviço",
          texto: `A ${data.businessName} trabalha com ${data.whatYouDo}.\n\nFunciona assim: você entra em contato, entendemos sua necessidade e te damos a melhor solução.\n\nResultado: ${data.differentiator || 'você resolve seu problema com atendimento de qualidade'}.`
        },
        {
          numero: 5,
          titulo: "Condução",
          texto: `Se fizer sentido pra você, o próximo passo é ${script5Conducao}.\n\nQuer que eu te explique como funciona?`
        },
        {
          numero: 6,
          titulo: "Encaminhamento",
          texto: script6Text
        },
        {
          numero: 7,
          titulo: "Follow-up",
          versoes: [
            {
              nome: "Cliente quente (1-2 dias)",
              texto: `Oi! Passando aqui pra saber se ainda faz sentido a gente conversar sobre ${data.whatYouDo}.\n\nQualquer coisa é só chamar 😊`
            },
            {
              nome: "Cliente morno (3-5 dias)",
              texto: `Oi! Lembrei de você aqui.\n\nConseguiu pensar sobre o que conversamos?\n\nQualquer dúvida, tô por aqui.`
            },
            {
              nome: "Cliente frio (7-15 dias)",
              texto: `Oi! Como tá por aí?\n\nSe em algum momento precisar de ${data.whatYouDo}, pode me chamar que te ajudo certinho.`
            }
          ]
        }
      ];

      setGeneratedScripts(templates);
      
      // Save to local storage
      const savePayload: SavedScriptsData = {
        formData: formData,
        scripts: templates,
        date: new Date().toISOString()
      };
      localStorage.setItem('scriptsGerados', JSON.stringify(savePayload));

      setStep('results');

    } catch (error) {
      console.error("Erro ao gerar scripts:", error);
      alert("Ocorreu um erro ao gerar os scripts. Por favor, tente novamente.");
      setStep('form');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- RENDER HELPERS ---

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <Wand2 className="w-10 h-10 text-yellow-600" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-4">Gerador de Scripts Personalizados</h2>
      <p className="text-gray-600 max-w-md mb-8">
        Responda algumas perguntas rápidas sobre seu negócio e nossa tecnologia vai criar os 7 scripts perfeitos para você.
      </p>
      
      <div className="flex flex-col w-full max-w-xs gap-3">
        <button 
          onClick={() => setStep('form')}
          className="bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
        >
          Começar Agora <ArrowRight className="w-5 h-5" />
        </button>
        
        {localStorage.getItem('scriptsGerados') && (
          <button 
            onClick={loadSavedScripts}
            className="text-gray-500 hover:text-darkBlue font-medium py-2 transition text-sm"
          >
            Ver scripts gerados anteriormente
          </button>
        )}
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-gray-400 text-xs">
        <Clock className="w-3 h-3" />
        <span>Tempo estimado: 2 minutos</span>
      </div>
    </div>
  );

  const renderForm = () => {
    const questions = [
      // Q1: Business Type
      <div key="q1" className="space-y-4 animate-fade-in">
        <h3 className="text-xl font-bold text-darkBlue mb-4">Qual o tipo do seu negócio?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BUSINESS_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => handleInputChange('businessType', type.id === 'outro' ? 'outro' : type.label)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:border-whatsapp ${
                (type.id === 'outro' && formData.businessType === 'outro') || (formData.businessType === type.label)
                  ? 'border-whatsapp bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <span className="block font-bold text-darkBlue">{type.label}</span>
              <span className="text-xs text-gray-500">{type.detail}</span>
            </button>
          ))}
        </div>
        {formData.businessType === 'outro' && (
          <input
            type="text"
            placeholder="Descreva seu tipo de negócio..."
            value={customBusinessType}
            onChange={(e) => setCustomBusinessType(e.target.value)}
            className="w-full mt-3 p-4 border border-gray-300 rounded-lg focus:border-whatsapp outline-none text-darkBlue bg-white"
            autoFocus
          />
        )}
      </div>,

      // Q2: Name
      <div key="q2" className="space-y-4 animate-fade-in">
        <h3 className="text-xl font-bold text-darkBlue mb-4">Qual o nome do seu negócio?</h3>
        <input
          type="text"
          placeholder="Ex: Clínica Odonto Sorriso"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-whatsapp outline-none bg-white text-darkBlue"
          autoFocus
        />
      </div>,

      // Q3: Description
      <div key="q3" className="space-y-4 animate-fade-in">
        <h3 className="text-xl font-bold text-darkBlue mb-4">O que você faz?</h3>
        <p className="text-gray-500 text-sm mb-2">Descreva em poucas palavras. Seja específico.</p>
        <textarea
          placeholder="Ex: Tratamentos dentários, clareamento e implantes"
          value={formData.whatYouDo}
          onChange={(e) => handleInputChange('whatYouDo', e.target.value)}
          className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-whatsapp outline-none h-32 resize-none bg-white text-darkBlue"
          autoFocus
        />
      </div>,

      // Q4: Hours
      <div key="q4" className="space-y-4 animate-fade-in">
        <h3 className="text-xl font-bold text-darkBlue mb-4">Qual seu horário de atendimento?</h3>
        <input
          type="text"
          placeholder="Ex: Seg a sex das 8h às 18h"
          value={formData.hours}
          onChange={(e) => handleInputChange('hours', e.target.value)}
          className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-whatsapp outline-none bg-white text-darkBlue"
          autoFocus
        />
      </div>,

      // Q5: Closing Method
      <div key="q5" className="space-y-4 animate-fade-in">
        <h3 className="text-xl font-bold text-darkBlue mb-4">Como normalmente você fecha com o cliente?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CLOSING_METHODS.map(method => (
            <button
              key={method.id}
              onClick={() => handleInputChange('closingMethod', method.label)}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:border-whatsapp ${
                formData.closingMethod === method.label
                  ? 'border-whatsapp bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <span className="block font-bold text-darkBlue">{method.label}</span>
              <span className="text-xs text-gray-500">{method.detail}</span>
            </button>
          ))}
        </div>
      </div>,

      // Q6: Differentiator (Optional)
      <div key="q6" className="space-y-4 animate-fade-in">
        <h3 className="text-xl font-bold text-darkBlue mb-4">Tem algum diferencial que quer destacar? <span className="text-sm font-normal text-gray-400">(opcional)</span></h3>
        <input
          type="text"
          placeholder="Ex: Atendimento sem dor, garantia de 5 anos..."
          value={formData.differentiator}
          onChange={(e) => handleInputChange('differentiator', e.target.value)}
          className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-whatsapp outline-none bg-white text-darkBlue"
          autoFocus
        />
      </div>
    ];

    const isCurrentStepValid = () => {
      switch(formStep) {
        case 0: return formData.businessType !== '' && (formData.businessType !== 'outro' || customBusinessType.length > 2);
        case 1: return formData.businessName.length > 1;
        case 2: return formData.whatYouDo.length > 5;
        case 3: return formData.hours.length > 3;
        case 4: return formData.closingMethod !== '';
        default: return true;
      }
    };

    return (
      <div className="max-w-xl mx-auto">
        {/* Saved Data Notice */}
        {showSavedDataNotice && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex justify-between items-center text-sm animate-fade-in">
            <span className="text-green-800 flex items-center gap-2">
               📝 Dados do seu negócio carregados automaticamente.
            </span>
            <button 
              onClick={handleClearData}
              className="text-green-700 hover:text-green-900 underline decoration-1 underline-offset-2 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3 h-3" /> Limpar
            </button>
          </div>
        )}

        {/* Progress */}
        <div className="mb-6 flex gap-1">
           {[0,1,2,3,4,5].map(i => (
             <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= formStep ? 'bg-whatsapp' : 'bg-gray-200'}`} />
           ))}
        </div>

        {questions[formStep]}

        <div className="flex items-center gap-3 mt-8">
          <button 
            onClick={handlePrevFormStep}
            className="p-3 text-gray-400 hover:text-darkBlue hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNextFormStep}
            disabled={!isCurrentStepValid()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-lg transition-all ${
              isCurrentStepValid() 
                ? 'bg-whatsapp hover:bg-whatsappDark text-white shadow-md transform hover:-translate-y-0.5' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {formStep === 5 ? '✨ Gerar Meus Scripts' : 'Continuar'}
            {formStep < 5 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3 mb-6">
        <Check className="w-5 h-5 text-green-600 mt-1 shrink-0" />
        <div>
          <h3 className="font-bold text-green-800">Scripts Gerados com Sucesso!</h3>
          <p className="text-sm text-green-700">Abaixo estão seus 7 scripts personalizados. Copie e cole no seu WhatsApp.</p>
        </div>
      </div>

      {generatedScripts.map((script) => (
        <div key={script.numero} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-darkBlue flex items-center gap-2">
              <span className="bg-darkBlue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">{script.numero}</span>
              {script.titulo}
            </h3>
          </div>
          
          <div className="p-4 space-y-4">
            {script.versoes ? (
              // Multiple versions
              script.versoes.map((versao, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{versao.nome}</span>
                  <div className="relative group">
                     <div className="bg-slate-800 text-gray-100 p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {versao.texto}
                     </div>
                     <button
                        onClick={() => copyToClipboard(versao.texto, `${script.numero}-${idx}`)}
                        className={`absolute top-2 right-2 p-2 rounded-md shadow-sm transition-all flex items-center gap-1 text-xs font-bold ${
                          copiedId === `${script.numero}-${idx}` 
                            ? 'bg-green-500 text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {copiedId === `${script.numero}-${idx}` ? (
                          <> <Check className="w-3 h-3" /> Copiado! </>
                        ) : (
                          <> <Copy className="w-3 h-3" /> Copiar </>
                        )}
                     </button>
                  </div>
                </div>
              ))
            ) : (
              // Single version
              <div className="relative group">
                 <div className="bg-slate-800 text-gray-100 p-4 rounded-lg font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    {script.texto}
                 </div>
                 <button
                    onClick={() => copyToClipboard(script.texto || '', `${script.numero}`)}
                    className={`absolute top-2 right-2 p-2 rounded-md shadow-sm transition-all flex items-center gap-1 text-xs font-bold ${
                      copiedId === `${script.numero}` 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {copiedId === `${script.numero}` ? (
                      <> <Check className="w-3 h-3" /> Copiado! </>
                    ) : (
                      <> <Copy className="w-3 h-3" /> Copiar </>
                    )}
                 </button>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="flex flex-col md:flex-row gap-4 pt-8 pb-12">
        <button 
          onClick={() => {
            setStep('form');
            setFormStep(0);
          }}
          className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:border-darkBlue hover:text-darkBlue transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Gerar Novamente
        </button>
        
        <button 
          onClick={onBack}
          className="flex-1 py-3 px-4 rounded-xl bg-darkBlue text-white font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          Voltar ao Menu
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-gray-500 hover:text-darkBlue hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-darkBlue flex-1 truncate">
            Gerador de Scripts
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {step === 'intro' && renderIntro()}
        {step === 'form' && renderForm()}
        
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="relative mb-8">
               <div className="absolute inset-0 bg-whatsapp opacity-20 blur-xl rounded-full animate-pulse"></div>
               <Loader2 className="w-16 h-16 text-whatsapp animate-spin relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-darkBlue mb-2">✨ Gerando seus scripts...</h3>
            <p className="text-gray-500 animate-pulse">{loadingText}</p>
          </div>
        )}

        {step === 'results' && renderResults()}
      </main>
    </div>
  );
};