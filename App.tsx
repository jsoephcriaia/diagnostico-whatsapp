import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, AlertCircle, WifiOff, LogOut, ArrowRight } from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import { Quiz } from './components/Quiz';
import { EmailCapture } from './components/EmailCapture';
import { ResultPage } from './components/ResultPage';
import { CheckoutPage } from './components/CheckoutPage';
import { PixPaymentPage } from './components/PixPaymentPage';
import { CreateAccountPage } from './components/CreateAccountPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { SuccessPage } from './components/SuccessPage';
import { Dashboard } from './components/Dashboard';
import { SevenSteps } from './components/SevenSteps';
import { ScriptGenerator } from './components/ScriptGenerator';
import { NicheExamples } from './components/NicheExamples';
import { AISecretaryPage } from './components/AISecretaryPage';
import { LoginModal } from './components/LoginModal'; 
import { ScreenState, QuizAnswers, CalculationResult, CONTACT_RANGES, TICKET_RANGES, PixPaymentData } from './types';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('landing');
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  
  // Estados de Loading e Sessão
  const [isLoading, setIsLoading] = useState(false); // Para ações internas (botões)
  const [isCheckingSession, setIsCheckingSession] = useState(true); // Para splash screen inicial
  const [sessionError, setSessionError] = useState(false); // Novo estado para erro de conexão

  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Listener para navegação interna
  useEffect(() => {
    const handleNavigationEvent = () => {
      setScreen('ai-secretary');
      window.scrollTo(0, 0);
    };
    window.addEventListener('navigate-to-ai', handleNavigationEvent);
    return () => window.removeEventListener('navigate-to-ai', handleNavigationEvent);
  }, []);

  // --- FUNÇÃO DE VERIFICAÇÃO DE SESSÃO ---
  const checkSession = async () => {
    setIsCheckingSession(true);
    setSessionError(false);
    
    try {
      // 1. Timeout de 8 segundos (conforme solicitado)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 8000)
      );

      // 2. Lógica de Verificação
      const checkLogic = async () => {
        // Prioridade: Recuperação de Senha via URL
        if (window.location.hash && window.location.hash.includes('type=recovery')) {
          return 'reset-password';
        }

        // Verificar Sessão no Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Se não tiver sessão ou der erro de auth, vai pra landing
        if (error || !session) {
          return 'landing';
        }

        // Verificar Pagamento (Leads)
        // Usamos maybeSingle para não estourar erro se não achar (embora deva achar)
        const { data: lead, error: leadError } = await supabase
          .from('leads')
          .select('pagou')
          .eq('email', session.user.email)
          .maybeSingle();

        if (leadError) {
          throw leadError; // Lança erro para cair no catch e permitir retry se for rede
        }

        if (lead && lead.pagou) {
          // Sucesso: Usuário logado e pagante
          localStorage.setItem('acessoLiberado', 'true');
          localStorage.setItem('userEmail', session.user.email || '');
          return 'dashboard';
        } else {
          // Logado mas não pagou: Deslogar e mandar pra landing
          await supabase.auth.signOut();
          return 'landing';
        }
      };

      // Corrida: Lógica vs Timeout
      const nextScreen = await Promise.race([checkLogic(), timeoutPromise]) as ScreenState;
      setScreen(nextScreen);

    } catch (error: any) {
      console.warn("Erro na verificação de sessão:", error);
      
      // Se for Timeout ou erro de rede, mostramos a tela de erro manual
      // NÃO deslogamos automaticamente para não perder a sessão se for apenas lentidão
      setSessionError(true);
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Inicialização
  useEffect(() => {
    checkSession();

    // Listener de Auth apenas para mudanças DEPOIS do load inicial
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('acessoLiberado');
        localStorage.removeItem('userEmail');
        // Só redireciona se não estivermos verificando sessão (evita race condition)
        setScreen('landing');
      } 
      // Não tratamos SIGNED_IN aqui para evitar conflito com checkSession,
      // o LoginModal já fecha e a verificação inicial cuida do resto.
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); 

  // --- FUNÇÕES DE NEGÓCIO ---

  const calculateResult = (data: QuizAnswers): CalculationResult => {
    let contacts = 0;
    if (typeof data.contactsRange === 'number') {
      contacts = data.contactsRange;
    } else {
      const range = CONTACT_RANGES.find(r => r.value === data.contactsRange);
      contacts = range ? range.avg : 0;
    }

    let ticket = 0;
    if (typeof data.ticketRange === 'number') {
      ticket = data.ticketRange;
    } else {
      const range = TICKET_RANGES.find(r => r.value === data.ticketRange);
      ticket = range ? range.avg : 0;
    }
    
    let currentRate = 0.03;
    if (typeof data.conversionRate === 'number') {
      currentRate = data.conversionRate > 0 ? (1 / data.conversionRate) : 0;
    } else {
      switch(data.conversionRate) {
        case "cada_3": currentRate = 0.33; break;
        case "cada_5": currentRate = 0.20; break;
        case "cada_10": currentRate = 0.10; break;
        case "cada_15": currentRate = 0.07; break;
        case "cada_20": currentRate = 0.05; break;
        case "cada_30_mais": currentRate = 0.03; break;
        default: currentRate = 0.03;
      }
    }

    let potentialRate = 0.10; 
    switch (data.responseTime) {
      case 'menos_5min': potentialRate = 0.40; break;
      case '5_30min': potentialRate = 0.30; break;
      case '30min_2h': potentialRate = 0.20; break;
      case 'mais_2h':
      case 'depende':
        potentialRate = 0.10; break;
      default: potentialRate = 0.10;
    }

    if (currentRate >= potentialRate) {
      potentialRate = currentRate + 0.10;
    }

    const gap = potentialRate - currentRate;
    const finalGap = gap > 0 ? gap : 0.05; 

    const monthlyLoss = contacts * ticket * finalGap;
    const annualLoss = monthlyLoss * 12;

    let mainProblem: 'tempo_resposta' | 'falta_processo' = 'tempo_resposta';
    
    if (data.responseTime === 'mais_2h' || data.responseTime === 'depende') {
      mainProblem = 'tempo_resposta';
    } else if (currentRate < 0.2) {
      mainProblem = 'falta_processo';
    }

    return {
      monthlyLoss,
      annualLoss,
      mainProblem,
      currentRate,
      potentialRate
    };
  };

  const handleQuizComplete = (data: QuizAnswers) => {
    setAnswers(data);
    setScreen('email');
  };

  const handleEmailSubmit = async (email: string, phone: string) => {
    if (!answers) return;
    setUserEmail(email);
    setUserPhone(phone);
    setIsLoading(true);
    
    const calculation = calculateResult(answers);
    setResult(calculation);

    const contactsManual = typeof answers.contactsRange === 'number';
    let contactsVal = contactsManual 
      ? (answers.contactsRange as number) 
      : (CONTACT_RANGES.find(r => r.value === answers.contactsRange)?.avg || 0);

    const ticketManual = typeof answers.ticketRange === 'number';
    let ticketVal = ticketManual 
      ? (answers.ticketRange as number) 
      : (TICKET_RANGES.find(r => r.value === answers.ticketRange)?.avg || 0);

    const conversionManual = typeof answers.conversionRate === 'number';
    
    const leadData = {
      email,
      whatsapp: phone.replace(/\D/g, ''),
      etapa: 'diagnostico_gratis',
      data_diagnostico: new Date().toISOString(),
      contatos_mes: contactsVal,
      contatos_mes_manual: contactsManual,
      ticket_medio: ticketVal,
      ticket_medio_manual: ticketManual,
      taxa_conversao: calculation.currentRate,
      taxa_conversao_manual: conversionManual,
      tempo_resposta: answers.responseTime,
      perda_mensal: calculation.monthlyLoss,
      perda_anual: calculation.annualLoss,
      problema_principal: calculation.mainProblem,
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        await supabase
          .from('leads')
          .upsert(leadData, { 
            onConflict: 'email',
            ignoreDuplicates: false 
          });
      } catch (error) {
        console.error('Error saving lead:', error);
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      setScreen('result');
      window.scrollTo(0,0);
    }, 1500);
  };

  const handlePixCreated = (data: PixPaymentData) => {
    setPixData(data);
    setScreen('pix');
    window.scrollTo(0, 0);
  };

  const handlePaymentConfirmed = async () => {
    if (supabase && userEmail) {
      await supabase
        .from('leads')
        .update({ 
          pagou: true,
          data_pagamento: new Date().toISOString()
        })
        .eq('email', userEmail);
    }

    // Enviar email de confirmação de compra
    try {
      const emailFinal = userEmail || localStorage.getItem('emailCompra') || '';
      const nomeCliente = localStorage.getItem('nomeCliente') || '';
      
      if (emailFinal) {
        await fetch('https://wlpqifxosgeoiofmjbsa.supabase.co/functions/v1/enviar-email-compra', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailFinal,
            nome: nomeCliente
          })
        });
        console.log('Email de confirmação de compra enviado');
      }
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error);
      // Não bloquear o fluxo se der erro no email
    }

    setScreen('create-account');
    window.scrollTo(0,0);
  };

  const handleAccountCreated = () => {
    setScreen('dashboard');
    window.scrollTo(0,0);
  };

  const handlePasswordResetSuccess = () => {
    setScreen('dashboard');
    window.scrollTo(0,0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDashboardNavigate = (module: string) => {
    const map: Record<string, ScreenState> = {
      '7-passos': 'seven-steps',
      'gerador': 'generator',
      'exemplos': 'examples',
      'ai-secretary': 'ai-secretary'
    };
    if (map[module]) {
      setScreen(map[module]);
      window.scrollTo(0,0);
    }
  };

  // Botão de Sair na tela de erro
  const handleForceLogout = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    setSessionError(false);
    setScreen('landing');
  };

  // --- TELA DE LOADING ---
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="flex flex-col items-center gap-6 max-w-sm w-full">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-whatsapp rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-2 h-2 bg-whatsapp rounded-full"></div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-500 font-medium animate-pulse">
              Conectando ao sistema...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA DE ERRO DE CONEXÃO ---
  if (sessionError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50">
        <div className="mb-6 bg-yellow-100 p-6 rounded-full animate-pop-in">
           <WifiOff className="w-12 h-12 text-yellow-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Conexão lenta</h2>
        <p className="text-slate-500 mb-8 text-lg max-w-md">
          Não foi possível verificar sua sessão. Sua internet pode estar instável.
        </p>
        
        <button 
          onClick={checkSession} 
          className="bg-whatsapp hover:bg-whatsappDark text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md mb-4 flex items-center gap-2 transform hover:-translate-y-1 w-full max-w-xs justify-center"
        >
          <RefreshCw className="w-5 h-5" /> Tentar novamente
        </button>
        
        <button 
          onClick={handleForceLogout} 
          className="bg-transparent text-slate-500 border border-slate-200 hover:bg-white hover:text-red-500 hover:border-red-200 font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2 w-full max-w-xs justify-center"
        >
          <LogOut className="w-4 h-4" /> Sair e voltar ao início
        </button>
      </div>
    );
  }

  // --- RENDERIZAÇÃO PRINCIPAL ---
  return (
    <div className="font-sans antialiased text-gray-900">
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => {
           setIsLoginModalOpen(false);
           // Quando fecha o modal após login, verifica sessão novamente para atualizar tela
           checkSession();
        }} 
      />

      {screen === 'landing' && (
        <LandingPage 
          onStart={() => setScreen('quiz')} 
          onLoginClick={() => setIsLoginModalOpen(true)}
        />
      )}
      
      {screen === 'quiz' && (
        <Quiz 
          onComplete={handleQuizComplete} 
          onBack={() => setScreen('landing')} 
        />
      )}

      {screen === 'email' && (
        <EmailCapture 
          onSubmit={handleEmailSubmit} 
          isLoading={isLoading} 
        />
      )}

      {screen === 'result' && result && (
        <ResultPage 
          result={result} 
          onCheckout={() => {
            setScreen('checkout');
            window.scrollTo(0,0);
          }}
        />
      )}

      {screen === 'checkout' && (
        <CheckoutPage 
          initialEmail={userEmail}
          initialPhone={userPhone}
          onPixCreated={handlePixCreated}
          onBack={() => setScreen('result')}
        />
      )}

      {screen === 'pix' && pixData && (
        <PixPaymentPage 
          data={pixData}
          onPaymentConfirmed={handlePaymentConfirmed}
        />
      )}

      {screen === 'create-account' && (
        <CreateAccountPage 
          email={userEmail || localStorage.getItem('emailCompra') || ''}
          onAccountCreated={handleAccountCreated}
        />
      )}

      {screen === 'reset-password' && (
        <ResetPasswordPage 
          onSuccess={handlePasswordResetSuccess}
        />
      )}

      {screen === 'success' && (
        <SuccessPage onGoToDashboard={() => setScreen('dashboard')} />
      )}

      {screen === 'dashboard' && (
        <Dashboard 
          onLogout={handleLogout}
          onNavigate={handleDashboardNavigate}
        />
      )}

      {screen === 'seven-steps' && (
        <SevenSteps
          onBack={() => setScreen('dashboard')}
          onNavigateToGenerator={() => handleDashboardNavigate('gerador')}
          onLogout={handleLogout}
        />
      )}
      
      {screen === 'generator' && (
        <ScriptGenerator 
          onBack={() => setScreen('dashboard')} 
          onLogout={handleLogout}
        />
      )}

      {screen === 'examples' && (
        <NicheExamples 
          onBack={() => setScreen('dashboard')} 
          onGoToGenerator={() => handleDashboardNavigate('gerador')}
          onLogout={handleLogout}
        />
      )}

      {screen === 'ai-secretary' && (
        <AISecretaryPage 
          onBack={() => setScreen('dashboard')}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;