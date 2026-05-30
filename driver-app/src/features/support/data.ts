// Support feature data — mirrors ../../../driver-prototype/support/.
import { type IconName } from '@/shared/components';

export const SUPPORT_PHONE = 'tel:+218000000000';
export const SUPPORT_EMAIL = 'drivers@djera.ly';

export type ContactKind = 'call' | 'chat' | 'email';
export type Contact = { key: ContactKind; icon: IconName; titleKey: string; subKey?: string; sub?: string };

export const CONTACTS: Contact[] = [
  { key: 'call', icon: 'phone', titleKey: 'sup.call', subKey: 'sup.callSub' },
  { key: 'chat', icon: 'chat', titleKey: 'sup.chat', subKey: 'sup.chatSub' },
  { key: 'email', icon: 'envelope', titleKey: 'sup.email', sub: SUPPORT_EMAIL },
];

// 5 FAQ entries — [question key, answer key].
export const FAQ: { q: string; a: string }[] = [
  { q: 'sup.q1', a: 'sup.a1' },
  { q: 'sup.q2', a: 'sup.a2' },
  { q: 'sup.q3', a: 'sup.a3' },
  { q: 'sup.q4', a: 'sup.a4' },
  { q: 'sup.q5', a: 'sup.a5' },
];
