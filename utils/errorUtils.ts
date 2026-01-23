export function traduzirErro(mensagem: string): string {
  const traducoes: Record<string, string> = {
    // Senhas
    'New password should be different from the old password.': 'A nova senha deve ser diferente da senha atual.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Passwords do not match': 'As senhas não coincidem.',
    'AuthApiError: Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    
    // Login
    'Invalid login credentials': 'Email ou senha incorretos.',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
    'User not found': 'Usuário não encontrado.',
    'Invalid email or password': 'Email ou senha inválidos.',
    
    // Cadastro
    'User already registered': 'Este email já está cadastrado.',
    'Email already in use': 'Este email já está em uso.',
    'Signup disabled': 'Cadastro temporariamente desativado.',
    
    // Rate limit
    'For security purposes, you can only request this once every 60 seconds': 'Por segurança, aguarde 60 segundos para tentar novamente.',
    'Rate limit exceeded': 'Muitas tentativas. Aguarde um momento.',
    'Too many requests': 'Muitas tentativas. Aguarde um momento.',
    
    // Recuperação
    'Email link is invalid or has expired': 'O link expirou ou é inválido. Solicite um novo.',
    'Token has expired or is invalid': 'O link expirou. Solicite um novo.',
    
    // Genéricos
    'Network error': 'Erro de conexão. Verifique sua internet.',
    'Failed to fetch': 'Erro de conexão. Verifique sua internet.',
    'An error occurred': 'Ocorreu um erro. Tente novamente.',
    'Timeout': 'Tempo esgotado. Tente novamente.',
  };
  
  // Limpeza básica da mensagem original
  const msgLimpa = mensagem.trim();

  // Procurar tradução exata
  if (traducoes[msgLimpa]) {
    return traducoes[msgLimpa];
  }
  
  // Procurar tradução parcial (contém o texto)
  for (const [ingles, portugues] of Object.entries(traducoes)) {
    if (msgLimpa.toLowerCase().includes(ingles.toLowerCase())) {
      return portugues;
    }
  }
  
  // Se for uma mensagem de erro customizada do App que já está em PT, retorna ela mesma
  if (/[áàâãéèêíïóôõöúçñ]/i.test(msgLimpa)) {
      return msgLimpa;
  }
  
  // Se não encontrar, retornar mensagem genérica ou a original se for curta
  return 'Ocorreu um erro. Tente novamente.';
}