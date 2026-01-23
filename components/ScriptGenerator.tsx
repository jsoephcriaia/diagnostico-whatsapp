import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Wand2, Check, Copy, Clock, RotateCcw, Trash2 } from 'lucide-react';
import { BusinessInfo, GeneratedScript, SavedScriptsData } from '../types';
import { AuthenticatedHeader } from './AuthenticatedHeader';

interface ScriptGeneratorProps {
  onBack: () => void;
  onLogout: () => void;
}

const BUSINESS_TYPES = [
  { id: 'clinica', label: '🏥 Clínica de Estética', detail: 'Harmonização, Botox, Laser, Limpeza...' },
  { id: 'consultorio', label: '🦷 Consultório (Dentista/Médico)', detail: 'Odonto, Psicologia, Nutrição...' },
  { id: 'salao', label: '💇‍♀️ Salão / Beleza', detail: 'Cabelo, Unha, Cílios...' },
  { id: 'escritorio', label: '📋 Escritório', detail: 'Advogado, contador, arquiteto...' },
  { id: 'escola', label: '🎓 Escola / Curso', detail: 'Idiomas, música, reforço...' },
  { id: 'outro', label: '💼 Outro', detail: 'Descreva seu negócio' },
];

const CLOSING_METHODS = [
  { id: 'agendamento', label: '📅 Agendamento', detail: 'Marca avaliação ou sessão' },
  { id: 'orcamento', label: '💰 Orçamento', detail: 'Envia proposta para aprovar' },
  { id: 'venda_direta', label: '🛒 Venda direta', detail: 'Cliente compra na hora' },
  { id: 'depende', label: '🔀 Depende do caso', detail: 'Varia conforme o cliente' },
];

const INITIAL_FORM_DATA: BusinessInfo = {
  businessType: 'Clínica de Estética',
  businessName: '',
  whatYouDo: '',
  hours: '',
  closingMethod: '',
  differentiator: '',
};

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ onBack, onLogout }) => {
  // State
  const [step, setStep] = useState<'intro' | 'form' | 'loading' | 'results' | 'error'>('intro');
  const [formStep, setFormStep] = useState(0); // 0 to 5 for form questions
  const [formData, setFormData] = useState<BusinessInfo>(INITIAL_FORM_DATA);
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [generatedScripts, setGeneratedScripts] = useState<GeneratedScript[]>([]);
  const [loadingText, setLoadingText] = useState('Analisando seu negócio...');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSavedDataNotice, setShowSavedDataNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check for saved scripts AND saved form data on mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('dadosGerador');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData({
          businessType: parsedData.businessType || '',
          businessName: parsedData.businessName || '',
          whatYouDo: parsedData.whatYouDo || '',
          hours: parsedData.hours || '',
          closingMethod: parsedData.closingMethod || '',
          differentiator: parsedData.differentiator || '',
        });
        
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
    let interval: any;
    if (step === 'loading') {
      const texts = [
        "Analisando sua clínica...",
        "Criando a estratégia de atendimento...",
        "Escrevendo os scripts de venda...",
        "Personalizando para seus procedimentos...",
        "Finalizando os detalhes..."
      ];
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
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
      try {
        const parsed: SavedScriptsData = JSON.parse(saved);
        setFormData(parsed.formData);
        setGeneratedScripts(parsed.scripts);
        setStep('results');
      } catch (e) {
        console.error("Erro ao carregar scripts salvos", e);
      }
    }
  };

  const handleUpgradeClick = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-ai'));
  };

  const mapApiScriptToInternal = (apiScripts: any[]): GeneratedScript[] => {
    return apiScripts.map(s => {
      const cleanS = Object.fromEntries(Object.entries(s).filter(([_, v]) => v != null)) as any;
      
      if (cleanS.duranteHorario || cleanS.foraHorario) {
        return {
          numero: Number(cleanS.numero),
          titulo: String(cleanS.titulo),
          versoes: [
            { nome: "Durante horário", texto: String(cleanS.duranteHorario || "") },
            { nome: "Fora do horário", texto: String(cleanS.foraHorario || "") }
          ]
        };
      } else if (cleanS.clienteQuente || cleanS.clienteMorno || cleanS.clienteFrio) {
        return {
          numero: Number(cleanS.numero),
          titulo: String(cleanS.titulo),
          versoes: [
            { nome: "Cliente Quente (1-2 dias)", texto: String(cleanS.clienteQuente || "") },
            { nome: "Cliente Morno (3-5 dias)", texto: String(cleanS.clienteMorno || "") },
            { nome: "Cliente Frio (7-15 dias)", texto: String(cleanS.clienteFrio || "") }
          ]
        };
      } else {
        return {
          numero: Number(cleanS.numero),
          titulo: String(cleanS.titulo),
          texto: String(cleanS.texto || "")
        };
      }
    });
  };

  const generateScripts = async () => {
    setStep('loading');

    const dataToSave = {
      ...formData,
      customBusinessType 
    };
    localStorage.setItem('dadosGerador', JSON.stringify(dataToSave));

    try {
      const payload = {
        tipo: formData.businessType === 'outro' ? customBusinessType : formData.businessType,
        nome: formData.businessName,
        oQueFaz: formData.whatYouDo,
        horario: formData.hours,
        comoFecha: formData.closingMethod,
        diferencial: formData.differentiator || ''
      };

      const response = await fetch('https://wlpqifxosgeoiofmjbsa.supabase.co/functions/v1/gerar-scripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao gerar scripts.');
      }

      const finalScripts = mapApiScriptToInternal(result.scripts);

      setGeneratedScripts(finalScripts);
      
      const savePayload: SavedScriptsData = {
        formData: formData,
        scripts: finalScripts,
        date: new Date().toISOString()
      };
      localStorage.setItem('scriptsGerados', JSON.stringify(savePayload));

      setStep('results');

    } catch (error: any) {
      console.error("Erro ao gerar scripts:", error);
      setErrorMessage(error.message || "Ocorreu um erro ao gerar os scripts. Por favor, tente novamente.");
      setStep('error');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

  // Render Form Content based on current Step
  const renderCurrentFormStep = () => {
    switch (formStep) {
      case 0:
        return (
          <div className="space-y-4 animate-fade-in-up">
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
              />
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-darkBlue mb-4">Qual o nome da sua clínica?</h3>
            <input
              type="text"
              placeholder="Ex: Clínica Estética Renovare"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-whatsapp outline-none bg-white text-darkBlue"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-darkBlue mb-4">Quais procedimentos você oferece?</h3>
            <p className="text-gray-500 text-sm mb-2">Liste os principais.</p>
            <textarea
              placeholder="Ex: Harmonização facial, limpeza de pele, depilação a laser, botox"
              value={formData.whatYouDo}
              onChange={(e) => handleInputChange('whatYouDo', e.target.value)}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-whatsapp outline-none h-32 resize-none bg-white text-darkBlue"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-darkBlue mb-4">Qual seu horário de atendimento?</h3>
            <input
              type="text"
              placeholder="Ex: Seg a sex das 9h às 19h e sáb até 14h"
              value={formData.hours}
              onChange={(e) => handleInputChange('hours', e.target.value)}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-whatsapp outline-none bg-white text-darkBlue"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-darkBlue mb-4">Como normalmente você fecha com a cliente?</h3>
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
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-xl font-bold text-darkBlue mb-4">Tem algum diferencial que quer destacar? <span className="text-sm font-normal text-gray-400">(opcional)</span></h3>
            <input
              type="text"
              placeholder="Ex: Avaliação gratuita, resultados naturais, biomédica esteta..."
              value={formData.differentiator}
              onChange={(e) => handleInputChange('differentiator', e.target.value)}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-whatsapp outline-none bg-white text-darkBlue"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AuthenticatedHeader 
        currentPage="Gerador de Scripts"
        onNavigateToDashboard={onBack}
        onLogout={onLogout}
      />
      
      {step === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pt-10">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <Wand2 className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-4">Gerador de Scripts com IA</h2>
          <p className="text-gray-600 max-w-md mb-8">
            Responda algumas perguntas rápidas e nossa Inteligência Artificial vai criar os 7 scripts perfeitos para sua clínica.
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
      )}

      {step === 'form' && (
        <div className="max-w-xl mx-auto pt-8 px-4">
          {/* Saved Data Notice */}
          {showSavedDataNotice && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex justify-between items-center text-sm animate-fade-in-up">
              <span className="text-green-800 flex items-center gap-2">
                 📝 Dados da sua clínica carregados automaticamente.
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

          {renderCurrentFormStep()}

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
      )}

      {step === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pt-10">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-whatsapp rounded-full animate-spin mb-6"></div>
          <h3 className="text-xl font-bold text-darkBlue mb-2">Criando seus scripts...</h3>
          <p className="text-gray-500 animate-pulse">{loadingText}</p>
        </div>
      )}

      {step === 'results' && (
        <div className="max-w-2xl mx-auto space-y-6 pt-8 px-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3 mb-6">
            <Check className="w-5 h-5 text-green-600 mt-1 shrink-0" />
            <div>
              <h3 className="font-bold text-green-800">Scripts Gerados com Sucesso!</h3>
              <p className="text-sm text-green-700">Abaixo estão seus 7 scripts personalizados com IA. Copie e cole no seu WhatsApp.</p>
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

          <div className="mt-12 pt-12 border-t border-gray-200">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-whatsapp rounded-2xl p-8 text-center shadow-sm">
              <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-3 flex items-center justify-center gap-2">
                🤖 E se esses scripts funcionassem sozinhos?
              </h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Seus scripts personalizados + inteligência artificial = atendimento automático 24h que converte enquanto você dorme.
              </p>
              <button 
                onClick={handleUpgradeClick}
                className="bg-whatsapp hover:bg-whatsappDark text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors inline-flex items-center gap-2"
              >
                Conhecer a Secretária de IA <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

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
      )}

      {step === 'error' && (
         <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pt-10">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-red-600 mb-2">Erro ao gerar scripts</h3>
            <p className="text-gray-600 mb-6 max-w-md">{errorMessage}</p>
            <button 
              onClick={() => setStep('form')}
              className="px-6 py-3 bg-darkBlue text-white rounded-xl hover:bg-slate-800 transition"
            >
              Tentar Novamente
            </button>
         </div>
      )}
    </div>
  );
};