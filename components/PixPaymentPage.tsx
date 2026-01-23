import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Clock, ShieldCheck, ArrowRight, Loader2, AlertCircle, RefreshCw, CreditCard, ExternalLink } from 'lucide-react';
import { PixPaymentData } from '../types';

interface PixPaymentPageProps {
  data: PixPaymentData;
  onPaymentConfirmed: () => void;
}

export const PixPaymentPage: React.FC<PixPaymentPageProps> = ({ data, onPaymentConfirmed }) => {
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
            {isCard ? 'Conclua na nova aba aberta' : 'Finalize para liberar seu acesso'}
          </p>
        </div>

        <div className="p-8 flex flex-col items-center">
          
          {/* Valor */}
          <div className="mb-6 text-center">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Valor Total</p>
            <p className="text-4xl font-extrabold text-whatsapp">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.valor)}
            </p>
          </div>

          {/* Conditional Layout: Card vs PIX */}
          {isCard ? (
            <div className="w-full mb-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center mb-6">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                 </div>
                 <h3 className="font-bold text-blue-900 mb-2">Página de pagamento aberta</h3>
                 <p className="text-sm text-blue-800/80">
                   Uma nova guia foi aberta para você digitar os dados do cartão. 
                   Assim que concluir, esta tela atualizará automaticamente.
                 </p>
              </div>

              {data.paymentLink && (
                <a 
                  href={data.paymentLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-white border-2 border-darkBlue text-darkBlue font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors mb-4"
                >
                  Reabrir Pagamento <ExternalLink className="w-4 h-4" />
                </a>
              )}
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
            </>
          )}

          {/* Error Message */}
          {verificationError && (
            <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {verificationError}
            </div>
          )}

          {/* Action Button */}
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
          
          {/* Automatic Verification Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-sm">
             <div className="w-4 h-4 border-2 border-gray-300 border-t-whatsapp rounded-full animate-spin"></div>
             <span>Verificando pagamento automaticamente...</span>
          </div>

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