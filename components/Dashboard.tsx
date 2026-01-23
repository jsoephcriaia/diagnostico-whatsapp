import React, { useEffect, useState } from 'react';
import { ClipboardList, Zap, FolderOpen, Bot, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';
import { AuthenticatedHeader } from './AuthenticatedHeader';

interface DashboardProps {
  onLogout: () => void;
  onNavigate: (module: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, onNavigate }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const getUser = async () => {
      // 1. Obter email da sessão ou localStorage
      const { data: { session } } = await supabase.auth.getSession();
      const currentEmail = session?.user?.email || localStorage.getItem('userEmail') || localStorage.getItem('emailCompra') || '';
      
      if (currentEmail) {
        setUserEmail(currentEmail);

        // 2. Buscar nome na tabela leads
        const { data: lead } = await supabase
          .from('leads')
          .select('nome')
          .eq('email', currentEmail)
          .maybeSingle();
        
        if (lead && lead.nome) {
          setUserName(lead.nome);
        } else {
          // Fallback: Tenta localStorage, depois divide email
          const localName = localStorage.getItem('nomeCliente');
          const firstName = localName ? localName.split(' ')[0] : currentEmail.split('@')[0];
          setUserName(firstName);
        }
      }
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthenticatedHeader 
        onNavigateToDashboard={() => {}} // Already on dashboard
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-darkBlue mb-2">Bem-vindo(a), {userName || 'Doutora'}!</h1>
          <p className="text-gray-500 text-lg">Escolha por onde começar a transformar o atendimento da sua clínica:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <button 
            onClick={() => onNavigate('7-passos')}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-whatsapp hover:shadow-md transition-all group text-left flex flex-col h-full"
          >
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-darkBlue mb-2 group-hover:text-whatsapp transition-colors">Os 7 Passos</h3>
            <p className="text-gray-500 text-sm leading-relaxed flex-1">
              O método completo passo-a-passo para transformar curiosos em pacientes agendados.
            </p>
          </button>

          {/* Card 2 */}
          <button 
            onClick={() => onNavigate('gerador')}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-whatsapp hover:shadow-md transition-all group text-left flex flex-col h-full"
          >
            <div className="bg-yellow-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-darkBlue mb-2 group-hover:text-whatsapp transition-colors">Gerador de Scripts</h3>
            <p className="text-gray-500 text-sm leading-relaxed flex-1">
              Crie scripts de venda personalizados para seus procedimentos estéticos.
            </p>
          </button>

          {/* Card 3 */}
          <button 
            onClick={() => onNavigate('exemplos')}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-whatsapp hover:shadow-md transition-all group text-left flex flex-col h-full"
          >
            <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FolderOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-darkBlue mb-2 group-hover:text-whatsapp transition-colors">Exemplos por Nicho</h3>
            <p className="text-gray-500 text-sm leading-relaxed flex-1">
              Biblioteca de conversas reais e scripts validados para clínicas.
            </p>
          </button>

          {/* Card 4 - Highlighted AI Offer */}
          <button 
            onClick={() => onNavigate('ai-secretary')}
            className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl shadow-sm border-2 border-whatsapp/50 hover:border-whatsapp hover:shadow-md transition-all group text-left relative flex flex-col h-full overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-whatsapp text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
              NOVIDADE
            </div>
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-whatsapp" />
            </div>
            <h3 className="text-lg font-bold text-darkBlue mb-2 group-hover:text-whatsapp transition-colors">Secretária de IA</h3>
            <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-3">
              Automatize todo esse processo e nunca mais perca paciente por demora.
            </p>
            <span className="text-whatsapp font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Conhecer <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};