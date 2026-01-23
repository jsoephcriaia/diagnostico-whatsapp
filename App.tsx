import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
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
  const [showLoadingFallback, setShowLoadingFallback] = useState(false); // Botão de emergência

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

  // --- VERIFICAÇÃO DE SESSÃO ROBUSTA ---
  useEffect(() => {
    let isMounted = true;
    
    // Timer para mostrar botão de fallback se travar
    const fallbackTimer = setTimeout(() => {
      if (isMounted) setShowLoadingFallback(true);
    }, 5000);

    const initSession = async () => {
      try {
        // Promessa de timeout de 3 segundos
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na verificação')), 3000)
        );

        // Lógica de verificação
        const checkLogic = async () => {
          // 1. Prioridade: Recuperação de Senha via URL
          if (window.location.hash && window.location.hash.includes('type=recovery')) {
            return 'reset-password';
          }

          // 2. Verificar Sessão no Supabase
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error || !session) {
            return 'landing';
          }

          // 3. Verificar Pagamento (Leads)
          const { data: lead } = await supabase
            .from('leads')
            .select('pagou')
            .eq('email', session.user.email)
            .maybeSingle();

          if (lead && lead.pagou) {
            // Sucesso: Usuário logado e pagante
            localStorage.setItem('acessoLiberado', 'true');
            localStorage.setItem('userEmail', session.user.email || '');
            return 'dashboard';
          } else {
            // Logado mas não pagou (ou erro na busca): Deslogar por segurança
            await supabase.auth.signOut();
            return 'landing';
          }
        };

        // Corrida entre a lógica e o timeout
        const nextScreen = await Promise.race([checkLogic(), timeoutPromise]) as ScreenState;

        if (isMounted) {
          setScreen(nextScreen);
        }

      } catch (error) {
        console.warn("Sessão: Falha ou Timeout.", error);
        // Em caso de erro/timeout, assume landing page para não travar o usuário
        if (isMounted) setScreen('landing');
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
          clearTimeout(fallbackTimer);
        }
      }
    };

    initSession();

    // Listener de Auth simplificado apenas para logout/login subsequente
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('acessoLiberado');
        localStorage.removeItem('userEmail');
        setScreen('landing');
      } else if (event === 'SIGNED_IN' && session) {
        // Só redireciona se estiver na landing ou login, para não atrapalhar fluxos ativos
        if (screen === 'landing') {
           const { data: lead } = await supabase
            .from('leads')
            .select('pagou')
            .eq('email', session.user.email)
            .maybeSingle();
            
           if (lead?.pagou) {
             setScreen('dashboard');
             setIsLoginModalOpen(false);
           }
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
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
    // A limpeza e redirecionamento são tratados pelo listener onAuthStateChange
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

  const handleForceReset = async () => {
    localStorage.clear();
    await supabase.auth.signOut();
    window.location.reload();
  };

  // --- TELA DE LOADING INICIAL ---
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

          {showLoadingFallback && (
            <div className="animate-fade-in-up w-full">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>A conexão está mais lenta que o normal.</p>
              </div>
              <button 
                onClick={handleForceReset}
                className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-darkBlue transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Reiniciar Aplicação
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans antialiased text-gray-900">
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
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