export interface PasswordRuleState {
  key: string;
  labelKey: string;
  met: boolean;
}

export function evaluatePasswordRules(
  newPassword: string,
  currentPassword: string
): PasswordRuleState[] {
  const pw = newPassword || '';
  return [
    {
      key: 'length',
      labelKey: 'NEDSS.HOME.USERS.INVITE.PW_RULE_LENGTH',
      met: pw.length >= 8,
    },
    {
      key: 'letter',
      labelKey: 'NEDSS.HOME.USERS.INVITE.PW_RULE_LETTER',
      met: /[A-Za-z]/.test(pw),
    },
    {
      key: 'number',
      labelKey: 'NEDSS.HOME.USERS.INVITE.PW_RULE_NUMBER',
      met: /\d/.test(pw),
    },
    {
      key: 'different',
      labelKey: 'NEDSS.HOME.CHANGE_PASSWORD.RULE_DIFFERENT',
      met: pw.length > 0 && pw !== (currentPassword || ''),
    },
  ];
}

export function passwordRulesMet(
  newPassword: string,
  currentPassword: string
): boolean {
  return evaluatePasswordRules(newPassword, currentPassword).every((r) => r.met);
}
