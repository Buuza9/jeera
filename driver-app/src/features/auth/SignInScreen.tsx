import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Brand, Button, Field, Icon, Screen } from '@/shared/components';

import { type AuthMethod } from './store';

// Libyan mobile: 9 digits starting with 9. Format as "9X XXX XXXX".
function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 9)].filter(Boolean).join(' ');
}
const isValidPhone = (raw: string) => {
  const d = raw.replace(/\D/g, '');
  return d.length === 9 && d.startsWith('9');
};
const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

export function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [method, setMethod] = useState<AuthMethod>('email');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSend = () => {
    if (method === 'phone') {
      if (!isValidPhone(phone)) return setError(t('auth.phone.err'));
      const to = `+218 ${phone}`;
      router.push({ pathname: '/auth/otp', params: { via: 'phone', to } });
    } else {
      if (!isValidEmail(email)) return setError(t('auth.email.err'));
      router.push({ pathname: '/auth/otp', params: { via: 'email', to: email.trim() } });
    }
  };

  return (
    <Screen contentClassName="pb-8 pt-12">
      {/* Header */}
      <View className="items-center">
        <Brand size={72} />
        <Text
          className="mt-3.5 font-display text-[26px] font-semibold text-text dark:text-dark-text"
          style={{ letterSpacing: -0.78 }}
        >
          {t('auth.title')}
        </Text>
        <Text className="mb-6 mt-1.5 text-center text-[14.5px] leading-6 text-text-muted dark:text-dark-text-muted">
          {t('auth.tag')}
        </Text>
      </View>

      {/* Method tabs */}
      <View className="mb-5 flex-row gap-1 rounded-md bg-surface-2 p-1 dark:bg-dark-surface-2">
        <MethodTab
          active={method === 'phone'}
          icon="phone"
          label={t('auth.method.phone')}
          onPress={() => {
            setMethod('phone');
            setError(null);
          }}
        />
        <MethodTab
          active={method === 'email'}
          icon="envelope"
          label={t('auth.method.email')}
          onPress={() => {
            setMethod('email');
            setError(null);
          }}
        />
      </View>

      {/* Input */}
      {method === 'phone' ? (
        <Field
          label={t('auth.phone.label')}
          keyboardType="number-pad"
          placeholder="9X XXX XXXX"
          value={phone}
          onChangeText={(v) => {
            setPhone(formatPhone(v));
            setError(null);
          }}
          error={error}
          maxLength={11}
          prefix={
            <View className="flex-row items-center gap-2 self-stretch border-e border-border bg-surface-2 px-3.5 dark:border-dark-border dark:bg-dark-surface-2">
              <View className="h-4 w-[22px] overflow-hidden rounded-[3px]">
                <View className="flex-1 bg-[#e70013]" />
                <View className="flex-1 bg-black" />
                <View className="flex-1 bg-[#239e46]" />
              </View>
              <Text className="text-[15px] font-semibold text-text dark:text-dark-text">+218</Text>
            </View>
          }
        />
      ) : (
        <Field
          label={t('auth.email.label')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setError(null);
          }}
          error={error}
        />
      )}

      <Text className="mb-[18px] mt-2 text-[12.5px] leading-5 text-text-faint dark:text-dark-text-faint">
        {t('auth.help')}
      </Text>

      <Button label={t('auth.send')} onPress={onSend} />

      {/* New driver link */}
      <View className="mt-[18px] flex-row justify-center">
        <Text className="text-sm text-text-muted dark:text-dark-text-muted">{t('auth.new.q')}</Text>
        <Text
          className="ms-1 text-sm font-semibold text-brand-600"
          onPress={() => router.push('/enrollment')}
        >
          {t('auth.new.cta')}
        </Text>
      </View>

      <View className="flex-1" />

      {/* TODO chip — PIN/biometric scope */}
      <View className="items-center">
        <View className="flex-row items-center gap-1.5 rounded-full bg-accent-600/15 px-3 py-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-accent-600" />
          <Text className="text-[11.5px] font-semibold text-accent-600">{t('auth.todo')}</Text>
        </View>
      </View>
    </Screen>
  );
}

function MethodTab({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: 'phone' | 'envelope';
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 flex-row items-center justify-center gap-2 rounded-sm py-2.5 ${
        active ? 'bg-bg dark:bg-dark-bg' : ''
      }`}
    >
      <Icon name={icon} size={16} color={active ? '#1b1410' : '#8b857f'} />
      <Text
        className={`text-sm font-semibold ${
          active ? 'text-text dark:text-dark-text' : 'text-text-muted dark:text-dark-text-muted'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
