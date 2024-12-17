export const hasWhiteSpace = (str: string) => {
  return /\s/g.test(str);
};

export const isUsernameValid = (username: string) => {
  return username && !hasWhiteSpace(username);
};

export const isEmailValid = (email: string) => {
  return email && /^[^@]+@.+\..+$/.test(email);
};

export const isMobileNumberValid = (mobile) => {
  return mobile && /^0(8|9|6)\s*\d{4}\s*\d{4}$/.test(mobile);
};

export const isHomePhoneValid = (mobile) => {
  return mobile && (/^02\s*\d{4}\s*\d{4}$/.test(mobile) || /^04\s*\d{1}\s*\d{6}$/.test(mobile));
};

export const isValidUrl = (url) => {
  // eslint-disable-next-line security/detect-unsafe-regex
  const pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  return url && pattern.test(url);
};

export enum PasswordStrongth {
  Invalid = 'INVALID',
  Weak = 'WEAK',
  Normal = 'NORMAL',
  Strong = 'STRONG',
}

export const getPasswordStrongth = (password: string): PasswordStrongth => {
  const g = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*+-_:;'"()^<>/{}#?&]{6,32}$/i;

  if (!g.test(password)) {
    return PasswordStrongth.Invalid;
  }

  if (password.length <= 6) {
    return PasswordStrongth.Weak;
  } else if (password.length <= 9) {
    return PasswordStrongth.Normal;
  } else {
    return PasswordStrongth.Strong;
  }
};

export const isTaxIdValid = (taxId: string) => {
  const g = /^\d{13}$/i;

  return taxId && g.test(taxId);
};

export const isThaiNationalIdValid = (nationalId: string) => {
  const g = /^\d{1} \d{4} \d{5} \d{2} \d{1}$/i;

  return nationalId && g.test(nationalId);
};

export const isPassportNumberValid = (passportNumber: string) => {
  const g = /^[A-Z0-9]+$/i;

  return passportNumber && g.test(passportNumber);
};

export const isYearValid = (year: string, from?: number, to?: number) => {
  const g = /^[1-9][0-9]{3}$/i;

  if (!g.test(year)) {
    return false;
  }

  const intYear = parseInt(year);
  const fromYear = from ?? 1970;
  const toYear = to ?? new Date().getFullYear();

  return fromYear <= intYear && intYear <= toYear;
};
