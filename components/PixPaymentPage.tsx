import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Clock, ShieldCheck, ArrowRight, Loader2, AlertCircle, RefreshCw, CreditCard, ExternalLink, ArrowLeft, MousePointerClick, AlertTriangle } from 'lucide-react';
import { PixPaymentData } from '../types';

interface PixPaymentPageProps {
  data: PixPaymentData;
  onPaymentConfirmed: () => void;
  onChangePaymentMethod: () => void;
}

export const PixPaymentPage: React.FC<PixPaymentPageProps> = ({ data, onPaymentConfirmed, onChangePaymentMethod }) => {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.copiaECola);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Reusable check function
  const checkPaymentStatus = async (isManual = false) => {
    const cobrancaId = localStorage.getItem('cobrancaId');
    const email = localStorage.getItem('emailCompra');

    if (!cobrancaId) {
      if (isManual) setVerificationError('ID da cobrança não encontrado. Tente refazer o checkout.');
      return;
    }

    if (isManual) {
      setIsVerifying(true);
      setVerificationError('');
    }

    try {
      const response = await fetch('https://wlpqifxosgeoiofmjbsa.supabase.co/functions/v1/verificar-pagamento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cobrancaId: cobrancaId,
          email: email
        })
      });

      const resultado = await response.json();

      if (resultado.pago) {
        // Success
        localStorage.setItem('acessoLiberado', 'true');
        onPaymentConfirmed();
      } else {
        if (isManual) setVerificationError('Pagamento ainda não identificado. Aguarde alguns instantes e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      if (isManual) setVerificationError('Erro ao conectar com o servidor. Verifique sua internet.');
    } finally {
      if (isManual) setIsVerifying(false);
    }
  };

  // Automatic Verification Interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkPaymentStatus(false);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleManualVerification = () => {
    checkPaymentStatus(true);
  };

  const isCard = data.paymentMethod === 'cartao';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-darkBlue p-6 text-center">
          <h2 className="text-white text-xl font-bold flex items-center justify-center gap-2">
            <span className="bg-whatsapp w-2 h-2 rounded-full animate-pulse"></span>
            {isCard ? 'Finalize seu Pagamento' : 'Aguardando Pagamento'}
          </h2>
          <p className="text-gray-300 text-sm mt-1">
            {isCard ? 'Siga os passos abaixo para liberar seu acesso' : 'Escaneie o QR Code abaixo'}
          </p>
        </div>

        <div className="p-8 flex flex-col items-center">
          
          <button 
            onClick={onChangePaymentMethod}
            className="inline-flex items-center gap-1.5 text-slate-500 text-sm hover:text-slate-800 transition-colors py-2 mb-4 cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="w-4 h-4" /> Alterar forma de pagamento
          </button>

          {/* Valor */}
          <div className="mb-6 text-center">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Valor Total</p>
            <p className="text-4xl font-extrabold text-whatsapp">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.valor)}
            </p>
          </div>

          {/* Conditional Layout: Card vs PIX */}
          {isCard ? (
            <div className="w-full mb-2">
              
              {/* Steps Container */}
              <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100 text-left space-y-4 divide-y divide-slate-200">
                {/* Step 1 */}
                <div className="flex items-start gap-3 pt-1">
                  <div className="w-7 h-7 bg-whatsapp text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm mt-0.5">1</div>
                  <div className="flex flex-col">
                    <strong className="text-slate-800 text-sm">Clique no botão abaixo</strong>
                    <span className="text-slate-500 text-xs">Uma nova aba abrirá com o pagamento seguro</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 pt-4">
                  <div className="w-7 h-7 bg-slate-300 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">2</div>
                  <div className="flex flex-col">
                    <strong className="text-slate-800 text-sm">Preencha os dados do cartão</strong>
                    <span className="text-slate-500 text-xs">Na página do Asaas (ambiente seguro)</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 pt-4">
                  <div className="w-7 h-7 bg-slate-300 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">3</div>
                  <div className="flex flex-col">
                    <strong className="text-slate-800 text-sm">Após pagar, FECHE a aba e volte aqui</strong>
                    <span className="text-slate-500 text-xs">Esta página detectará o pagamento automaticamente</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {data.paymentLink && (
                <a 
                  href={data.paymentLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg mb-6 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-pulse-slow"
                >
                  Abrir Página de Pagamento <ExternalLink className="w-5 h-5" />
                </a>
              )}

              {/* Warning Box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex gap-3 text-left">
                 <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                 <p className="text-yellow-800 text-sm leading-relaxed">
                   <strong>Importante:</strong> Após concluir o pagamento na outra aba, feche-a e volte para esta página. O sistema detectará automaticamente.
                 </p>
              </div>

              {/* Auto Check Indicator */}
              <div className="flex items-center justify-center gap-2 mb-6 text-gray-500 text-sm bg-gray-50 py-2 rounded-lg border border-gray-100">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-whatsapp rounded-full animate-spin"></div>
                <span>Verificando pagamento automaticamente...</span>
              </div>

              {/* Manual Check Button */}
              <button 
                onClick={handleManualVerification}
                disabled={isVerifying}
                className="w-full bg-white border border-gray-200 hover:border-darkBlue hover:bg-gray-50 text-slate-600 hover:text-darkBlue font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
              >
                {isVerifying ? (
                  <> <Loader2 className="w-4 h-4 animate-spin" /> Verificando... </>
                ) : (
                  <> Já paguei e fechei a aba <CheckCircle className="w-4 h-4" /> </>
                )}
              </button>

            </div>
          ) : (
            <>
              {/* QR Code */}
              <div className="bg-white p-2 rounded-xl border-2 border-gray-100 shadow-inner mb-6">
                {data.qrCode ? (
                  <img 
                    src={`data:image/png;base64,${data.qrCode}`} 
                    alt="QR Code PIX" 
                    className="w-56 h-56 object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 bg-gray-100 flex items-center justify-center text-gray-400">
                    Erro ao carregar QR Code
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-center mb-4 font-medium">
                Escaneie o QR Code ou use o código abaixo:
              </p>

              {/* Copia e Cola */}
              <div className="w-full relative mb-6 group">
                <input 
                  type="text" 
                  readOnly 
                  value={data.copiaECola}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg p-3 pr-12 focus:ring-whatsapp focus:border-whatsapp outline-none font-mono"
                />
                <button 
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-whatsapp transition-colors p-1"
                  title="Copiar código"
                >
                  {copied ? <CheckCircle className="w-5 h-5 text-whatsapp" /> : <Copy className="w-5 h-5" />}
                </button>
                {copied && (
                  <span className="absolute -top-8 right-0 bg-darkBlue text-white text-xs py-1 px-2 rounded animate-fade-in">
                    Copiado!
                  </span>
                )}
              </div>

              {/* Timer Message */}
              <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-4 py-2 rounded-full text-xs font-semibold mb-8">
                <Clock className="w-3 h-3" />
                PIX válido por 30 minutos
              </div>

              {/* Automatic Verification Indicator */}
              <div className="flex items-center justify-center gap-2 mb-4 text-gray-500 text-sm">
                 <div className="w-4 h-4 border-2 border-gray-300 border-t-whatsapp rounded-full animate-spin"></div>
                 <span>Verificando pagamento automaticamente...</span>
              </div>

              <button 
                onClick={handleManualVerification}
                disabled={isVerifying}
                className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Verificando...
                  </>
                ) : (
                  <>
                    Já realizei o pagamento <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </>
          )}

          {/* Error Message */}
          {verificationError && (
            <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm mt-4 flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {verificationError}
            </div>
          )}

        </div>
        
        {/* Footer info */}
        <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Liberação automática
          </p>
        </div>
      </div>
    </div>
  );
};