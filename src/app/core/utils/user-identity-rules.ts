export function normalizeIdentityDigits(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

export function isValidUserNationalId(value: unknown): boolean {
  const nid = normalizeIdentityDigits(value);
  if (!/^[23]\d{13}$/.test(nid)) return false;
  const year = (nid[0] === '2' ? 1900 : 2000) + Number(nid.slice(1, 3));
  const month = Number(nid.slice(3, 5));
  const day = Number(nid.slice(5, 7));
  const birth = new Date(year, month - 1, day);
  if (
    birth.getFullYear() !== year ||
    birth.getMonth() !== month - 1 ||
    birth.getDate() !== day
  ) {
    return false;
  }
  return birth.getTime() <= Date.now();
}

export function userNationalIdError(value: unknown): string {
  const nid = normalizeIdentityDigits(value);
  if (!nid) return 'NEDSS.COMMON.FILEDREQUIRED';
  if (!/^\d{14}$/.test(nid)) return 'NEDSS.LAB_VIEW.ADD_PATIENT.NATIONAL_ID_NOT_14';
  if (!isValidUserNationalId(nid)) return 'NEDSS.LAB_VIEW.ADD_PATIENT.Invalid_NATIONAL';
  return '';
}

export function userPhoneError(value: unknown): string {
  const phone = normalizeIdentityDigits(value);
  if (!phone) return 'NEDSS.COMMON.FILEDREQUIRED';
  const local = phone.replace(/^(\+20|0020)/, '');
  if (!/^\d{11}$/.test(local)) return 'NEDSS.LAB_VIEW.ADD_PATIENT.PHONE_NO_NOT_11';
  if (!/^01[0125]\d{8}$/.test(local)) return 'NEDSS.COMMON.INVALID_PHONE_FORMAT';
  return '';
}

export function onNationalIdKeyPress(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.ctrlKey || event.metaKey || event.key === 'Backspace') return;
  if (!/^[0-9٠-٩۰-۹]$/.test(event.key)) {
    event.preventDefault();
    return;
  }
  const input = event.target as HTMLInputElement;
  const selected = Math.abs((input.selectionEnd ?? 0) - (input.selectionStart ?? 0));
  if (input.value.length - selected >= 14) {
    event.preventDefault();
  }
}
