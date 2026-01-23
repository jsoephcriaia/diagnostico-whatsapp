import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, QrCode, CheckCircle, ArrowLeft, Loader2, ChevronRight, User } from 'lucide-react';
import { maskCpfCnpj, maskPhone, validateCpfCnpj } from '../utils/paymentUtils';
import { PixPaymentData } from '../types';

interface CheckoutPageProps {
  initialEmail: string;
  initialPhone?: string;
  initialStep?: 'personal_data' | 'payment_method';
  onPixCreated: (data: PixPaymentData) => void;
  onBack: () => void;
}

type CheckoutStep = 'personal_data' | 'payment_method';

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  initialEmail, 
  initialPhone, 
  initialStep = 'personal_data',
  onPixCreated, 
  onBack 
}) => {
  const [step, setStep] = useState<CheckoutStep>(initialStep);
  
  // Dados do formulário
  // Tenta recuperar do localStorage caso o usuário esteja voltando de uma tentativa de pagamento
  const [formData, setFormData] = useState({
    name: localStorage.getItem('nomeCliente') || '',
    cpf: localStorage.getItem('cpfCliente') || '',
    email: initialEmail || localStorage.getItem('emailCompra') || '',
    whatsapp: initialPhone || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') formattedValue = maskCpfCnpj(value);
    if (name === 'whatsapp') formattedValue = maskPhone(value);

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    setError('');
  };

  // Etapa 1: Validar dados e avançar
  const handleDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.name.trim().length < 3) return setError('Digite seu nome completo.');
    if (!validateCpfCnpj(formData.cpf)) return setError('Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.');
    const rawPhone = formData.whatsapp.replace(/\D/g, '');
    if (rawPhone.length < 10) return setError('WhatsApp inválido (digite com DDD).');
    if (!formData.email.includes('@')) return setError('Email inválido.');

    setStep('payment_method');
  };

  // Etapa 2: Criar Cobrança (Pix ou Cartão)
  const createPayment = async (method: 'pix' | 'cartao') => {
    setIsLoading(true);
    setError('');

    try {
      // Prepara payload
      const payload = {
        nome: formData.name,
        email: formData.email,
        cpfCnpj: formData.cpf.replace(/\D/g, ''), // Asaas exige apenas números
        telefone: formData.whatsapp.replace(/\D/g, ''),
        // Se for PIX, manda 'PIX'. Se for cartão, manda 'CREDIT_CARD' para forçar a tela de cartão
        billingType: method === 'pix' ? 'PIX' : 'CREDIT_CARD'
      };

      const response = await fetch('https://wlpqifxosgeoiofmjbsa.supabase.co/functions/v1/criar-cobranca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar pagamento.');
      }

      // Salvar dados para verificação posterior
      localStorage.setItem('cobrancaId', result.cobrancaId);
      localStorage.setItem('emailCompra', formData.email);
      localStorage.setItem('nomeCliente', formData.name);
      localStorage.setItem('cpfCliente', formData.cpf);

      // Mapear resposta da API para o tipo interno
      // A API retorna pixQrCode e pixCopiaECola no primeiro nível
      const paymentData: PixPaymentData = {
        cobrancaId: result.cobrancaId,
        valor: 49.00,
        paymentMethod: method,
        // Se for PIX, mapeia os campos de QR Code
        qrCode: result.pixQrCode || '',
        copiaECola: result.pixCopiaECola || '',
        // Se for Cartão (ou Undefined), mapeia a URL da fatura
        paymentLink: result.invoiceUrl || result.linkPagamento || ''
      };

      onPixCreated(paymentData);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao conectar com o servidor.');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'payment_method') {
      setStep('personal_data');
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={handleBack} className="text-gray-500 hover:text-darkBlue">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-whatsapp" />
            <span className="font-semibold text-slateText">Checkout Seguro</span>
          </div>
          <div className="w-6"></div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-12 gap-8">
        
        {/* Resumo do Pedido (Lateral) */}
        <div className="md:col-span-5 md:col-start-8 md:row-start-1 h-fit">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-darkBlue mb-4">Resumo do Pedido</h3>
            
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div>
                <h4 className="font-medium text-slateText">Protocolo para Estética</h4>
                <p className="text-sm text-gray-500">Acesso Vitalício</p>
              </div>
              <span className="font-bold text-darkBlue">R$ 49,00</span>
            </div>

            <ul className="space-y-3 py-4 text-sm text-gray-600">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-aesthetic-rose" /> 7 passos do atendimento</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-aesthetic-rose" /> Gerador de scripts</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-aesthetic-rose" /> Exemplos por nicho</li>
            </ul>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
              <span className="text-lg font-bold text-darkBlue">Total</span>
              <span className="text-2xl font-extrabold text-whatsapp">R$ 49,00</span>
            </div>
          </div>
        </div>

        {/* Área Principal */}
        <div className="md:col-span-7 md:row-start-1">
          
          {/* ETAPA 1: DADOS PESSOAIS */}
          {step === 'personal_data' && (
            <div className="animate-fade-in-right">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-darkBlue text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
                 <h1 className="text-2xl font-bold text-darkBlue">Seus dados para pagamento</h1>
              </div>
              
              <form onSubmit={handleDataSubmit} className="space-y-6">
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-darkBlue focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">CPF ou CNPJ</label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-darkBlue focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition"
                        placeholder="000.000.000-00 ou 00.000.000/0000-00"
                        maxLength={18}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-darkBlue focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-darkBlue focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition"
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                        required
                      />
                    </div>
                  </div>
                </section>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                    <span className="font-bold">!</span> {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-darkBlue hover:bg-slate-800 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Continuar <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* ETAPA 2: FORMA DE PAGAMENTO */}
          {step === 'payment_method' && (
            <div className="animate-fade-in-right">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-darkBlue text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
                 <h1 className="text-2xl font-bold text-darkBlue">Como você prefere pagar?</h1>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-100 mb-6 flex items-center gap-3 text-sm text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span>Dados de: <strong>{formData.name}</strong> ({formData.cpf})</span>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                  <span className="font-bold">!</span> {error}
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                  <Loader2 className="w-10 h-10 text-whatsapp animate-spin mb-4" />
                  <p className="text-gray-500 font-medium">Gerando pagamento seguro...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Opção PIX */}
                  <button 
                    onClick={() => createPayment('pix')}
                    className="w-full bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-whatsapp hover:shadow-md transition-all text-left flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-whatsapp shrink-0">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-darkBlue text-lg group-hover:text-whatsapp transition-colors">PIX</h3>
                      <p className="text-sm text-gray-500">Aprovação imediata • Liberado na hora</p>
                    </div>
                    <div className="text-right">
                       <span className="block font-bold text-darkBlue">R$ 49,00</span>
                       <ChevronRight className="w-5 h-5 text-gray-300 inline-block" />
                    </div>
                  </button>

                  {/* Opção Cartão */}
                  <button 
                    onClick={() => createPayment('cartao')}
                    className="w-full bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-darkBlue text-lg group-hover:text-blue-600 transition-colors">Cartão de Crédito</h3>
                      <p className="text-sm text-gray-500">Pague com segurança</p>
                    </div>
                    <div className="text-right">
                       <span className="block font-bold text-darkBlue">R$ 49,00</span>
                       <ChevronRight className="w-5 h-5 text-gray-300 inline-block" />
                    </div>
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
                    <Lock className="w-3 h-3" />
                    Pagamento processado em ambiente 100% seguro.
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};