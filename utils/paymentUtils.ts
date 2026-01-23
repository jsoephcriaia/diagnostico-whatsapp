
export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskPhone = (value: string) => {
  let r = value.replace(/\D/g, '');
  if (r.length > 11) r = r.substring(0, 11);
  
  if (r.length > 10) {
    // 11 digits: (XX) XXXXX-XXXX
    return r.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (r.length > 5) {
    // 10 digits (landline or typing): (XX) XXXX-XXXX
    return r.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (r.length > 2) {
    return r.replace(/^(\d\d)(\d{0,5})/, '($1) $2');
  } else {
    return r.replace(/^(\d*)/, '($1');
  }
};

export const maskCardNumber = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{4})(\d)/, '$1 $2')
    .replace(/(\d{4})(\d)/, '$1 $2')
    .replace(/(\d{4})(\d)/, '$1 $2')
    .substring(0, 19);
};

export const maskExpiry = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .substring(0, 5);
};

export const maskCVV = (value: string) => {
  return value.replace(/\D/g, '').substring(0, 4); // Amex can be 4
};

export const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf === '' || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};
