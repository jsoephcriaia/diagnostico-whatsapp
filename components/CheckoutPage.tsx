import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, QrCode, CheckCircle, ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { maskCPF, validateCPF } from '../utils/paymentUtils';
import { PixPaymentData } from '../types';

interface CheckoutPageProps {
  initialEmail: string;
  onPixCreated: (data: PixPaymentData) => void;
  onBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ initialEmail, onPixCreated, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: initialEmail,
    paymentMethod: 'pix' as 'pix' | 'cartao',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') formattedValue = maskCPF(value);

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic Validation
    if (formData.name.length < 3) return setError('Digite seu nome completo.');
    if (!validateCPF(formData.cpf)) return setError('CPF inválido.');
    
    setIsLoading(true);

    try {
      const response = await fetch('https://wlpqifxosgeoiofmjbsa.supabase.co/functions/v1/criar-cobranca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.name,
          cpf: formData.cpf.replace(/\D/g, ''), // Remove mask (dots and dash)
          email: formData.email,
          formaPagamento: formData.paymentMethod
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar pagamento.');
      }

      // Save IDs for later check
      localStorage.setItem('cobrancaId', result.cobrancaId);
      localStorage.setItem('emailCompra', formData.email);

      if (formData.paymentMethod === 'pix') {
        onPixCreated({
          qrCode: result.pix.qrCode,
          copiaECola: result.pix.copiaECola,
          cobrancaId: result.cobrancaId,
          valor: 49.00
        });
      } else {
        // Credit Card -> Redirect
        window.location.href = result.linkPagamento;
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao conectar com o servidor. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="text-gray-500 hover:text-darkBlue">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-whatsapp" />
            <span className="font-semibold text-slateText">Checkout Seguro</span>
          </div>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-12 gap-8">
        
        {/* Order Summary */}
        <div className="md:col-span-5 md:col-start-8 md:row-start-1 h-fit">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-darkBlue mb-4">Resumo do Pedido</h3>
            
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div>
                <h4 className="font-medium text-slateText">Protocolo de Atendimento</h4>
                <p className="text-sm text-gray-500">Acesso Vitalício</p>
              </div>
              <span className="font-bold text-darkBlue">R$ 49,00</span>
            </div>

            <ul className="space-y-3 py-4 text-sm text-gray-600">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-whatsapp" /> 7 passos do atendimento</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-whatsapp" /> Gerador de scripts</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-whatsapp" /> Exemplos por nicho</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-whatsapp" /> 7 dias de garantia</li>
            </ul>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
              <span className="text-lg font-bold text-darkBlue">Total</span>
              <span className="text-2xl font-extrabold text-whatsapp">R$ 49,00</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="md:col-span-7 md:row-start-1">
          <h1 className="text-2xl font-bold text-darkBlue mb-6">Finalizar Compra</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Data */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="text-lg font-semibold text-slateText mb-2 flex items-center gap-2">
                <span className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> 
                Dados Pessoais
              </h3>
              
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white text-darkBlue focus:border-whatsapp focus:ring-1 focus:ring-whatsapp outline-none transition"
                    placeholder="000.000.000-00"
                    maxLength={14}
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
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
              <h3 className="text-lg font-semibold text-slateText mb-2 flex items-center gap-2">
                <span className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> 
                Pagamento
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'pix' }))}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    formData.paymentMethod === 'pix' 
                      ? 'border-whatsapp bg-green-50 text-darkBlue' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <QrCode className="w-6 h-6" />
                  <span className="font-semibold">PIX</span>
                  {formData.paymentMethod === 'pix' && <div className="absolute top-2 right-2 text-xs bg-whatsapp text-white px-2 py-0.5 rounded-full">Rápido</div>}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cartao' }))}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    formData.paymentMethod === 'cartao' 
                      ? 'border-whatsapp bg-green-50 text-darkBlue' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-500'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="font-semibold">Cartão</span>
                </button>
              </div>

              {formData.paymentMethod === 'cartao' && (
                 <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-lg text-sm flex items-start gap-3">
                   <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                   <div>
                     <p className="font-bold mb-1">Ambiente Seguro</p>
                     <p>Para sua segurança, você será redirecionado para a página de pagamento criptografada do Asaas para inserir os dados do seu cartão.</p>
                   </div>
                 </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <span className="font-bold">!</span> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                     <Loader2 className="w-5 h-5 animate-spin" /> Processando...
                  </>
                ) : (
                  formData.paymentMethod === 'pix' ? 'Gerar PIX e Pagar R$ 49' : 'Ir para Pagamento Seguro'
                )}
                {!isLoading && formData.paymentMethod === 'cartao' && <ExternalLink className="w-5 h-5" />}
                {!isLoading && formData.paymentMethod === 'pix' && <Lock className="w-5 h-5" />}
              </button>
              
              <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-2 mt-4">
                <Lock className="w-3 h-3" />
                Pagamento processado em ambiente seguro (256-bit SSL).
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};