import React, { useEffect, useState } from 'react';
import { LogOut, ClipboardList, Zap, FolderOpen, User } from 'lucide-react';
import { supabase } from '../supabase';

interface DashboardProps {
  onLogout: () => void;
  onNavigate: (module: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, onNavigate }) => {
  const [userName, setUserName] = useState('Aluno');

  useEffect(() => {
    // Try to get from local storage first
    const storedEmail = localStorage.getItem('userEmail') || localStorage.getItem('emailCompra');
    if (storedEmail) {
      setUserName(storedEmail.split('@')[0]);
    } else {
      // Try to get active session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          setUserName(session.user.email.split('@')[0]);
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-whatsapp w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <span className="font-bold text-darkBlue hidden md:block">Protocolo de Atendimento</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4" />
              <span className="max-w-[150px] truncate">Olá, {userName}</span>
            </div>
            <button 
              onClick={onLogout}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-darkBlue mb-2">Bem-vindo ao Protocolo!</h1>
          <p className="text-gray-500 text-lg">Escolha por onde quer começar a transformar seu atendimento:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <button 
            onClick={() => onNavigate('7-passos')}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-whatsapp hover:shadow-md transition-all group text-left"
          >
            <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-darkBlue mb-2 group-hover:text-whatsapp transition-colors">Os 7 Passos</h3>
            <p className="text-gray-500 leading-relaxed">
              O método completo passo-a-passo para transformar curiosos em clientes pagantes.
            </p>
          </button>

          {/* Card 2 */}
          <button 
            onClick={() => onNavigate('gerador')}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-whatsapp hover:shadow-md transition-all group text-left"
          >
            <div className="bg-yellow-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-darkBlue mb-2 group-hover:text-whatsapp transition-colors">Gerador de Scripts</h3>
            <p className="text-gray-500 leading-relaxed">
              Responda algumas perguntas e crie scripts de venda personalizados para seu negócio.
            </p>
          </button>

          {/* Card 3 */}
          <button 
            onClick={() => onNavigate('exemplos')}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-whatsapp hover:shadow-md transition-all group text-left"
          >
            <div className="bg-purple-50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FolderOpen className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-darkBlue mb-2 group-hover:text-whatsapp transition-colors">Exemplos por Nicho</h3>
            <p className="text-gray-500 leading-relaxed">
              Biblioteca de conversas reais e scripts validados para diferentes áreas de atuação.
            </p>
          </button>
        </div>

        {/* Coming Soon / Footer area */}
        <div className="mt-12 p-6 bg-gray-100 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">
          Novos módulos serão adicionados em breve.
        </div>
      </main>
    </div>
  );
};