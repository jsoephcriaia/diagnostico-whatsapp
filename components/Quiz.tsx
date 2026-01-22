import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Keyboard, CornerUpLeft } from 'lucide-react';
import { CONTACT_RANGES, TICKET_RANGES, CONVERSION_RANGES, RESPONSE_TIMES, QuizAnswers } from '../types';

interface QuizProps {
  onComplete: (answers: QuizAnswers) => void;
  onBack: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [isManualInput, setIsManualInput] = useState(false);
  
  // Reset manual input mode when changing steps
  useEffect(() => {
    setIsManualInput(false);
  }, [step]);

  const handleSelection = (key: keyof QuizAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleManualInput = (key: keyof QuizAnswers, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    setAnswers(prev => ({ ...prev, [key]: numValue }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      if (answers.contactsRange && answers.ticketRange && answers.conversionRate && answers.responseTime) {
        onComplete(answers as QuizAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (isManualInput) {
      setIsManualInput(false);
      // Optional: clear the manual value if they go back to list
      // handleSelection(getCurrentKey(), undefined);
      return;
    }
    
    if (step > 0) {
      setStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const getCurrentKey = (): keyof QuizAnswers => {
    switch (step) {
      case 0: return 'contactsRange';
      case 1: return 'ticketRange';
      case 2: return 'conversionRate';
      case 3: return 'responseTime';
      default: return 'contactsRange';
    }
  };

  const isCurrentStepValid = () => {
    const key = getCurrentKey();
    const val = answers[key];
    
    if (isManualInput) {
      // Basic validation for numbers
      return typeof val === 'number' && val > 0;
    }
    
    return !!val;
  };

  // Helper to render the standard list options
  const renderOptionsList = (
    options: { label: string; value: string }[], 
    answerKey: keyof QuizAnswers,
    showManualOption: boolean = false
  ) => (
    <div className="space-y-3 animate-fade-in">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelection(answerKey, option.value)}
          className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${
            answers[answerKey] === option.value 
              ? 'border-whatsapp bg-green-50 text-darkBlue font-medium shadow-sm' 
              : 'border-gray-100 bg-white text-slateText hover:border-gray-300'
          }`}
        >
          <span className="text-base md:text-lg">{option.label}</span>
          {answers[answerKey] === option.value && <Check className="w-5 h-5 text-whatsapp" />}
        </button>
      ))}

      {showManualOption && (
        <button
          onClick={() => {
            setIsManualInput(true);
            handleSelection(answerKey, undefined); // Clear selection when entering manual mode
          }}
          className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-left transition-all flex justify-between items-center hover:border-whatsapp hover:bg-gray-50 group"
        >
          <span className="text-base md:text-lg text-slateText group-hover:text-whatsapp font-medium flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Digitar valor exato
          </span>
          <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-whatsapp" />
        </button>
      )}
    </div>
  );

  // Helper to render the manual input form
  const renderManualInput = (
    label: string, 
    placeholder: string, 
    answerKey: keyof QuizAnswers,
    helperText?: string,
    prefix?: string
  ) => (
    <div className="animate-fade-in">
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
        <label className="block text-slateText font-semibold mb-3 text-lg">
          {label}
        </label>
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">
              {prefix}
            </span>
          )}
          <input
            type="number"
            placeholder={placeholder}
            value={answers[answerKey] === undefined ? '' : answers[answerKey] as number}
            onChange={(e) => handleManualInput(answerKey, e.target.value)}
            className={`w-full p-4 rounded-lg border-2 border-gray-200 focus:border-whatsapp outline-none text-xl font-medium transition-colors ${
              prefix ? 'pl-12' : ''
            }`}
            autoFocus
          />
        </div>
        {helperText && (
          <p className="text-gray-500 text-sm mt-3 flex items-start gap-1">
             <span className="shrink-0 text-blue-500">ℹ️</span> {helperText}
          </p>
        )}
      </div>

      <button
        onClick={() => setIsManualInput(false)}
        className="text-gray-400 hover:text-darkBlue flex items-center gap-2 text-sm font-medium transition-colors px-1"
      >
        <CornerUpLeft className="w-4 h-4" />
        Voltar para opções
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 px-4">
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
          <span>Passo {step + 1} de 4</span>
          <span>{Math.round(((step + 1) / 4) * 100)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-whatsapp transition-all duration-300 ease-out"
            style={{ width: `${((step + 1) / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        
        {/* Step 0: Contacts */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-darkBlue mb-6 leading-snug">
              Quantos contatos novos você recebe por mês no WhatsApp?
            </h2>
            {isManualInput 
              ? renderManualInput(
                  "Quantos contatos novos por mês?", 
                  "Ex: 85", 
                  "contactsRange"
                )
              : renderOptionsList(CONTACT_RANGES, "contactsRange", true)
            }
          </div>
        )}

        {/* Step 1: Ticket */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-darkBlue mb-6 leading-snug">
              Qual o valor médio de uma venda no seu negócio?
            </h2>
            {isManualInput
              ? renderManualInput(
                  "Qual o valor médio de uma venda?", 
                  "Ex: 450", 
                  "ticketRange", 
                  undefined, 
                  "R$"
                )
              : renderOptionsList(TICKET_RANGES, "ticketRange", true)
            }
          </div>
        )}

        {/* Step 2: Conversion */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-darkBlue mb-6 leading-snug">
              A cada quantos contatos você fecha 1 venda?
            </h2>
            {isManualInput
              ? renderManualInput(
                  "A cada quantos contatos você vende?",
                  "Ex: 12",
                  "conversionRate",
                  "Se você fecha 1 venda a cada 12 contatos, digite 12."
                )
              : renderOptionsList(CONVERSION_RANGES, "conversionRate", true)
            }
          </div>
        )}

        {/* Step 3: Response Time (No manual input needed) */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl md:text-2xl font-bold text-darkBlue mb-6 leading-snug">
              Quanto tempo você costuma levar para responder a primeira mensagem?
            </h2>
            {renderOptionsList(RESPONSE_TIMES, "responseTime", false)}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={handlePrevious}
            className="p-3 text-gray-400 hover:text-darkBlue hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isCurrentStepValid()}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-lg transition-all ${
              isCurrentStepValid() 
                ? 'bg-whatsapp hover:bg-whatsappDark text-white shadow-md transform hover:-translate-y-0.5' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step === 3 ? 'Finalizar' : 'Continuar'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};