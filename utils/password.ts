const COMMON_PASSWORDS = new Set([
  '123456',
  '12345678',
  '111111',
  'password',
  'qwerty',
  'abcdef',
  'abcdefgh',
  'letmein',
  'welcome',
  'monkey',
]);

function hasRepeatedCharacters(password: string) {
  return /(.)\1{2,}/.test(password);
}

function hasSequentialCharacters(password: string) {
  const normalized = password.toLowerCase();
  for (let i = 0; i < normalized.length - 2; i += 1) {
    const a = normalized.charCodeAt(i);
    const b = normalized.charCodeAt(i + 1);
    const c = normalized.charCodeAt(i + 2);
    if (b === a + 1 && c === a + 2) return true;
    if (b === a - 1 && c === a - 2) return true;
  }
  return false;
}

export interface PasswordValidationResult {
  isValid: boolean;
  strength: 'Weak' | 'Medium' | 'Strong';
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    common: boolean;
    repeated: boolean;
    sequential: boolean;
  };
  message: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  const requirements = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
    common: !COMMON_PASSWORDS.has(password.toLowerCase()),
    repeated: !hasRepeatedCharacters(password),
    sequential: !hasSequentialCharacters(password),
  };

  const passedChecks = Object.values(requirements).filter(Boolean).length;
  const isValid =
    requirements.length &&
    requirements.uppercase &&
    requirements.lowercase &&
    requirements.number &&
    requirements.special &&
    requirements.common &&
    requirements.repeated &&
    requirements.sequential;

  let strength: PasswordValidationResult['strength'] = 'Weak';
  if (isValid && passedChecks >= 7) {
    strength = 'Strong';
  } else if (isValid || passedChecks >= 5) {
    strength = 'Medium';
  }

  let message = 'Password must be at least 6 characters';
  if (isValid) {
    message = 'Password looks strong';
  } else {
    const failed = Object.entries(requirements)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (failed.includes('length')) {
      message = 'Use at least 6 characters';
    } else if (failed.includes('uppercase')) {
      message = 'Add an uppercase letter';
    } else if (failed.includes('lowercase')) {
      message = 'Add a lowercase letter';
    } else if (failed.includes('number')) {
      message = 'Add a number';
    } else if (failed.includes('special')) {
      message = 'Add a special character';
    } else if (failed.includes('common')) {
      message = 'Avoid common passwords';
    } else if (failed.includes('repeated')) {
      message = 'Avoid repeated characters';
    } else if (failed.includes('sequential')) {
      message = 'Avoid sequential patterns';
    }
  }

  return {
    isValid,
    strength,
    requirements,
    message,
  };
}
