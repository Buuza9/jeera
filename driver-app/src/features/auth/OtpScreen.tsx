import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import { Button, Icon, Screen } from '@/shared/components';

import { requestOtp, verifyOtp } from './data';
import { OtpInput } from './OtpInput';
import { useAuthStore, type AuthMethod } from './store';

const RESEND_SECONDS = 30;

export function OtpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ via?: string; to?: string }>();
  const via: AuthMethod = params.via === 'phone' ? 'phone' : 'email';
  const to = params.to ?? (via === 'phone' ? '+218 9X XXX XXXX' : 'you@example.com');

  const signIn = useAuthStore((s) => s.signIn);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [status, setStatus] = useState<{ text: string; kind: 'hint' | 'err' | 'ok' }>({
    text: t('otp.hint'),
    kind: 'hint',
  });
  const [verifying, setVerifying] = useState(false);
  const [cd, setCd] = useState(RESEND_SECONDS);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setCd((n) => {
        if (n <= 1 && timer.current) clearInterval(timer.current);
        return n - 1;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const onVerify = async (full?: string) => {
    const c = full ?? code;
    if (c.length !== 6) {
      setStatus({ text: t('otp.err.short'), kind: 'err' });
      return;
    }
    setVerifying(true);
    try {
      const session = await verifyOtp(via, to, c);
      setStatus({ text: t('otp.ok'), kind: 'ok' });
      signIn(session);
      setTimeout(() => router.replace('/auth/loading'), 500);
    } catch {
      setVerifying(false);
      setError(true);
      setStatus({ text: t('otp.err.bad'), kind: 'err' });
      setCode('');
      setTimeout(() => setError(false), 600);
    }
  };

  const onResend = async () => {
    if (cd > 0) return;
    setCode('');
    setError(false);
    setStatus({ text: t('otp.hint'), kind: 'hint' });
    setCd(RESEND_SECONDS);
    timer.current = setInterval(() => {
      setCd((n) => {
        if (n <= 1 && timer.current) clearInterval(timer.current);
        return n - 1;
      });
    }, 1000);
    await requestOtp(via, to);
  };

  const statusColor =
    status.kind === 'err'
      ? 'text-danger'
      : status.kind === 'ok'
        ? 'text-brand-700'
        : 'text-text-faint dark:text-dark-text-faint';

  return (
    <Screen contentClassName="pb-8 pt-12">
      {/* Header */}
      <View className="items-center">
        <View className="mb-3.5 h-16 w-16 items-center justify-center rounded-[20px] bg-brand-50 dark:bg-dark-surface-2">
          <Icon name={via === 'phone' ? 'device' : 'envelope'} size={30} color="#2a673a" strokeWidth={2} />
        </View>
        <Text
          className="font-display text-2xl font-semibold text-text dark:text-dark-text"
          style={{ letterSpacing: -0.72 }}
        >
          {t('otp.title')}
        </Text>
        <Text className="mt-1.5 text-center text-[14.5px] text-text-muted dark:text-dark-text-muted">
          {t('otp.tag')}
        </Text>
        <Text className="mb-6 mt-1 text-[15px] font-semibold text-text dark:text-dark-text">{to}</Text>
      </View>

      <OtpInput value={code} onChange={setCode} error={error} onComplete={onVerify} />

      <Text className={`mb-3.5 mt-4 min-h-[18px] text-center text-[12.5px] ${statusColor}`}>
        {status.text}
      </Text>

      <Button label={t('otp.verify')} onPress={() => onVerify()} disabled={code.length !== 6} />

      {/* Resend */}
      <View className="mt-[18px] flex-row justify-center">
        <Text className="text-[13.5px] text-text-muted dark:text-dark-text-muted">
          {t('otp.resend.q')}
        </Text>
        <Text
          className={`ms-1 text-[13.5px] font-semibold ${
            cd > 0 ? 'text-text-faint dark:text-dark-text-faint' : 'text-brand-600'
          }`}
          onPress={onResend}
        >
          {t('otp.resend.cta')}
          {cd > 0 ? ` (${cd}s)` : ''}
        </Text>
      </View>

      <Text
        className="mt-2.5 text-center text-[13px] font-semibold text-brand-600"
        onPress={() => router.back()}
      >
        {t('otp.change')}
      </Text>

      <View className="flex-1" />

      {/* TODO chip */}
      <View className="items-center">
        <View className="flex-row items-center gap-1.5 rounded-full bg-accent-600/15 px-3 py-1.5">
          <View className="h-1.5 w-1.5 rounded-full bg-accent-600" />
          <Text className="text-[11.5px] font-semibold text-accent-600">{t('otp.todo')}</Text>
        </View>
      </View>

      {/* Verifying overlay */}
      {verifying ? (
        <View className="absolute inset-0 items-center justify-center gap-3.5 bg-bg/90 dark:bg-dark-bg/90">
          <ActivityIndicator size="large" color="#2a673a" />
          <Text className="text-sm font-semibold text-text dark:text-dark-text">
            {t('otp.verifying')}
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}
