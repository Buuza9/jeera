import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button, Icon, Screen } from '@/shared/components';

import { maskId } from './data';
import { useEnrollmentStore } from './store';

export function PendingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const application = useEnrollmentStore((s) => s.application);

  const rows: { k: string; v: string }[] = [
    { k: t('enr.fullName'), v: application?.fullName || '—' },
    { k: t('enr.id'), v: application ? maskId(application.nationalId) : '—' },
    { k: t('enr.license'), v: application?.licenseNumber || '—' },
    { k: t('enr.plate'), v: application?.plate || '—' },
    { k: t('prof.docs'), v: '2 / 2' },
  ];

  return (
    <Screen contentClassName="items-center pt-20">
      {/* Icon */}
      <View className="mb-[18px] h-[88px] w-[88px] items-center justify-center rounded-xl bg-brand-50 dark:bg-dark-surface-2">
        <Icon name="clock" size={42} color="#194f29" />
      </View>

      <Text
        className="text-center font-display text-[28px] font-semibold text-text dark:text-dark-text"
        style={{ letterSpacing: -0.98 }}
      >
        {t('enr.pend.title')}
      </Text>
      <Text className="mt-2 max-w-[320px] text-center text-[14px] leading-6 text-text-muted dark:text-dark-text-muted">
        {t('enr.pend.sub')}
      </Text>

      {/* Warn badge */}
      <View className="mt-3.5 flex-row items-center gap-1.5 rounded-full bg-warn/15 px-3 py-1.5">
        <Icon name="clock" size={12} color="#9a6a00" />
        <Text className="text-[11.5px] font-semibold text-warn">{t('enr.pend.eta')}</Text>
      </View>

      {/* Summary card */}
      <View className="mt-7 w-full rounded-md border border-border bg-surface px-3.5 dark:border-dark-border dark:bg-dark-surface">
        {rows.map((r, i) => (
          <View
            key={r.k}
            className={`flex-row items-center justify-between py-3 ${
              i > 0 ? 'border-t border-border dark:border-dark-border' : ''
            }`}
          >
            <Text className="text-[13px] text-text-muted dark:text-dark-text-muted">{r.k}</Text>
            <Text className="text-[13.5px] font-semibold text-text dark:text-dark-text">{r.v}</Text>
          </View>
        ))}
      </View>

      <View className="flex-1" />

      <View className="w-full pb-2">
        <Button label={t('enr.pend.home')} variant="secondary" onPress={() => router.replace('/')} />
      </View>
    </Screen>
  );
}
