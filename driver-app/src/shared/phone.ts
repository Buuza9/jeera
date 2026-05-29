// Single source of truth for the supported country dial code + phone helpers.
// Djera operates in Libya (+218); centralised here so screens never hard-code it.

export const COUNTRY = {
  iso: 'LY',
  dialCode: '+218',
  /** Local mobile is 9 digits starting with 9 (91/92/93/94). */
  localDigits: 9,
} as const;

/** Format a raw local number as "9X XXX XXXX" (max 9 digits). */
export function formatLocalPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, COUNTRY.localDigits);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(' ');
}

/** Valid Libyan mobile: exactly 9 digits, starting with 9. */
export function isValidLocalPhone(raw: string): boolean {
  const d = raw.replace(/\D/g, '');
  return d.length === COUNTRY.localDigits && d.startsWith('9');
}

/** Full E.164-ish display form: "+218 9X XXX XXXX". */
export function fullPhone(localFormatted: string): string {
  return `${COUNTRY.dialCode} ${localFormatted}`;
}
