import React, { useState } from 'react';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { maskPhone } from '../utils/paymentUtils';

interface EmailCaptureProps {
  onSubmit: (email: string, phone: string) => void;
  isLoading: boolean;
}

export const EmailCapture: React.FC<EmailCaptureProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(maskPhone(e.target.value));
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Por favor, digite um email válido.');
      return;
    }

    const rawPhone = phone.replace(/\D/g, '');
    if (rawPhone.length < 10) {
      setError('Por favor, digite um WhatsApp válido (com DDD).');
      return;
    }

    setError('');
    onSubmit(email, phone);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-whatsapp" />
        </div>

        <h2 className="text-2xl font-bold text-darkBlue mb-2">
          O diagnóstico da sua clínica está pronto!
        </h2>
        <p className="text-slateText mb-8">
          Informe seus dados para ver quanto sua clínica está perdendo:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                className="w-full p-4 rounded-lg border-2 bg-gray-50 focus:bg-white border-gray-200 focus:border-whatsapp transition-colors outline-none text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                disabled={isLoading}
                maxLength={15}
                className="w-full p-4 rounded-lg border-2 bg-gray-50 focus:bg-white border-gray-200 focus:border-whatsapp transition-colors outline-none text-lg"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-1 ml-1 font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'Calculando...' : 'Ver Meu Resultado'} 
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
          <Lock className="w-3 h-3" />
          <span>Não enviamos spam. Seus dados estão seguros.</span>
        </div>
      </div>
    </div>
  );
};