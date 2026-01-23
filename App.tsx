import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Listen for custom navigation events dispatched from deep child components
  useEffect(() => {
    const handleNavigationEvent = () => {
      setScreen('ai-secretary');
      window.scrollTo(0, 0);
    };

    window.addEventListener('navigate-to-ai', handleNavigationEvent);

    return () => {
      window.removeEventListener('navigate-to-ai', handleNavigationEvent);
    };
  }, []);

  // Initial Session Check & Auth Listener
  useEffect(() => {
    let mounted = true;

    const checkInitialSession = async () => {
      try {
        // 1. Check for Recovery Hash (Priority)
        const hash = window.location.hash;
        if (hash && hash.includes('type=recovery')) {
          if (mounted) {
            setScreen('reset-password');
            setIsCheckingSession(false);
          }
          return;
        }

        // 2. Check Existing Session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Verify Payment
          const { data: lead } = await supabase
            .from('leads')
            .select('pagou')
            .eq('email', session.user.email)
            .maybeSingle();

          if (lead && lead.pagou) {
            if (mounted) {
              localStorage.setItem('acessoLiberado', 'true');
              localStorage.setItem('userEmail', session.user.email || '');
              setScreen('dashboard');
            }
          } else {
            // Logged in but not paid? Sign out to be safe/clean
            await supabase.auth.signOut();
            if (mounted) setScreen('landing');
          }
        } else {
          // No session
          if (mounted) setScreen('landing');
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) setScreen('landing');
      } finally {
        if (mounted) setIsCheckingSession(false);
      }
    };

    checkInitialSession();

    // 3. Listen for Auth Changes (Login/Logout during usage)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      console.log('Auth Event:', event);

      if (event === 'PASSWORD_RECOVERY') {
        setScreen('reset-password');
      } else if (event === 'SIGNED_IN' && session) {
        // Check payment on login event
        const { data: lead } = await supabase
          .from('leads')
          .select('pagou')
          .eq('email', session.user.email)
          .maybeSingle();

        if (lead && lead.pagou) {
          localStorage.setItem('acessoLiberado', 'true');
          localStorage.setItem('userEmail', session.user.email || '');
          
          if (screen !== 'reset-password') {
            setScreen('dashboard');
            setIsLoginModalOpen(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('acessoLiberado');
        localStorage.removeItem('userEmail');
        setScreen('landing');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Run once on mount

  // Logic to calculate the "Money Lost" based on user inputs
  const calculateResult = (data: QuizAnswers): CalculationResult => {
    // 1. Get Contacts (Manual or Range Avg)
    let contacts = 0;
    if (typeof data.contactsRange === 'number') {
      contacts = data.contactsRange;
    } else {
      const range = CONTACT_RANGES.find(r => r.value === data.contactsRange);
      contacts = range ? range.avg : 0;
    }

    // 2. Get Ticket (Manual or Range Avg)
    let ticket = 0;
    if (typeof data.ticketRange === 'number') {
      ticket = data.ticketRange;
    } else {
      const range = TICKET_RANGES.find(r => r.value === data.ticketRange);
      ticket = range ? range.avg : 0;
    }
    
    // 3. Current Rate (Manual or Selection)
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

    // 3. Potential Rate based on Response Time
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

    // 4. Calculate Gap and Loss
    const gap = potentialRate - currentRate;
    const finalGap = gap > 0 ? gap : 0.05; 

    const monthlyLoss = contacts * ticket * finalGap;
    const annualLoss = monthlyLoss * 12;

    // 5. Determine Main Problem
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
    
    // 1. Calculate
    const calculation = calculateResult(answers);
    setResult(calculation);

    // 2. Prepare data
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
      whatsapp: phone.replace(/\D/g, ''), // Store clean number
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

    // 3. Save to Supabase
    if (supabase) {
      try {
        const { error: upsertError } = await supabase
          .from('leads')
          .upsert(leadData, { 
            onConflict: 'email',
            ignoreDuplicates: false 
          });

        if (upsertError) {
           // Fallback logic handled silently or via console
           console.warn('Upsert warning:', upsertError);
        }
      } catch (error) {
        console.error('Error saving lead:', error);
      }
    }

    // 4. UX Transition
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

  // Called after payment verified (manual or automatic)
  const handlePaymentConfirmed = async () => {
    // 1. Update Lead Paid Status (Redundant safety check)
    if (supabase && userEmail) {
      await supabase
        .from('leads')
        .update({ 
          pagou: true,
          data_pagamento: new Date().toISOString()
        })
        .eq('email', userEmail);
    }

    // 2. Redirect to Account Creation instead of Success Page
    setScreen('create-account');
    window.scrollTo(0,0);
  };

  const handleAccountCreated = () => {
    // User created password and is logged in
    setScreen('dashboard');
    window.scrollTo(0,0);
  };

  const handlePasswordResetSuccess = () => {
    // User is logged in and password is new
    setScreen('dashboard');
    window.scrollTo(0,0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('acessoLiberado');
    localStorage.removeItem('cobrancaId');
    localStorage.removeItem('emailCompra');
    localStorage.removeItem('userEmail');
    setScreen('landing');
    window.scrollTo(0,0);
  };

  const handleDashboardNavigate = (module: string) => {
    if (module === '7-passos') {
      setScreen('seven-steps');
      window.scrollTo(0,0);
    } else if (module === 'gerador') {
      setScreen('generator');
      window.scrollTo(0,0);
    } else if (module === 'exemplos') {
      setScreen('examples');
      window.scrollTo(0,0);
    } else if (module === 'ai-secretary') {
      setScreen('ai-secretary');
      window.scrollTo(0,0);
    }
  };

  // Splash Screen while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-whatsapp rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-2 h-2 bg-whatsapp rounded-full"></div>
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium animate-pulse">Carregando...</p>
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

      {/* New Flow: Create Account after payment */}
      {screen === 'create-account' && (
        <CreateAccountPage 
          email={userEmail || localStorage.getItem('emailCompra') || ''}
          onAccountCreated={handleAccountCreated}
        />
      )}

      {/* New Flow: Reset Password */}
      {screen === 'reset-password' && (
        <ResetPasswordPage 
          onSuccess={handlePasswordResetSuccess}
        />
      )}

      {/* Fallback Success Page (might be unused now) */}
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