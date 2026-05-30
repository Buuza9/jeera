import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Appbar, Button, Icon } from '@/shared/components';
import { useAuthStore } from '@/features/auth/store';

import { DOCS, DRIVER, LINKS } from './data';

export function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const signOut = useAuthStore((s) => s.signOut);

  const onSignOut = () => {
    signOut();
    router.replace('/auth');
  };

  // Titled "coming soon" placeholder for sub-screens that aren't built yet.
  const placeholder = (title: string) => router.push({ pathname: '/coming-soon', params: { title } });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      <View className="px-7">
        <Appbar
          title={t('prof.title')}
          onBack={() => router.navigate('/dashboard')}
          trailing={
            <Pressable
              onPress={() => router.push('/settings')}
              accessibilityLabel="Settings"
              className="h-10 w-10 items-center justify-center rounded-full border border-border bg-surface dark:border-dark-border dark:bg-dark-surface"
            >
              <Icon name="settings" size={18} color="#1b1410" />
            </Pressable>
          }
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-7"
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Identity */}
        <Pressable
          onPress={() => placeholder(t('prof.profDetails'))}
          className="flex-row items-center gap-3.5 rounded-lg border border-border bg-surface p-5 dark:border-dark-border dark:bg-dark-surface"
        >
          <View
            className="h-16 w-16 items-center justify-center rounded-full bg-brand-600"
            style={{ shadowColor: '#194f29', shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } }}
          >
            <Text className="font-display text-[22px] font-bold text-white">{DRIVER.initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="font-display text-[19px] font-semibold text-text dark:text-dark-text" style={{ letterSpacing: -0.5 }}>
              {DRIVER.name}
            </Text>
            <Text className="mt-0.5 text-[13px] text-text-muted dark:text-dark-text-muted">
              {t('prof.driver')} · {DRIVER.phoneMasked}
            </Text>
            <View className="mt-2 flex-row gap-1.5">
              <View className="flex-row items-center gap-1 rounded-full bg-brand-500/12 px-2 py-0.5">
                <Icon name="star" size={10} color="#194f29" filled />
                <Text className="text-[11px] font-bold text-brand-700">{DRIVER.rating}</Text>
              </View>
              <View className="rounded-full bg-surface-2 px-2 py-0.5 dark:bg-dark-surface-2">
                <Text className="text-[11px] font-semibold text-text-muted dark:text-dark-text-muted">
                  {DRIVER.trips} {t('dash.trips')}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/* Vehicle */}
        <Text className="mb-2.5 mt-5 px-1 font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
          {t('prof.vehicle')}
        </Text>
        <Pressable
          onPress={() => placeholder(t('prof.vehDetails'))}
          className="flex-row items-center gap-3.5 rounded-lg border border-border bg-surface p-4 dark:border-dark-border dark:bg-dark-surface"
        >
          <View className="h-[52px] w-[52px] items-center justify-center rounded-xl bg-surface-2 dark:bg-dark-surface-2">
            <Icon name="car" size={26} color="#5e5650" />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-semibold text-text dark:text-dark-text">{t('prof.veh.model')}</Text>
            <Text className="mt-0.5 text-[13px] text-text-muted dark:text-dark-text-muted">{t('prof.veh.plate')}</Text>
          </View>
          <Icon name="arrowRight" size={16} color="#8b857f" />
        </Pressable>

        {/* Documents */}
        <Text className="mb-2.5 mt-5 px-1 font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
          {t('prof.docs')}
        </Text>
        <View className="gap-2">
          {DOCS.map((doc) => {
            const expiring = doc.status === 'expiring';
            return (
              <View
                key={doc.key}
                className="flex-row items-center gap-3 rounded-lg border border-border bg-surface p-3.5 dark:border-dark-border dark:bg-dark-surface"
              >
                <View className={`h-9 w-9 items-center justify-center rounded-lg ${expiring ? 'bg-accent-600/15' : 'bg-brand-500/12'}`}>
                  <Icon name={expiring ? 'warn' : 'check'} size={18} color={expiring ? '#a85d22' : '#194f29'} strokeWidth={2} />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-semibold text-text dark:text-dark-text">{t(doc.labelKey)}</Text>
                  <Text className="mt-0.5 text-[12px] text-text-muted dark:text-dark-text-muted">{t(doc.noteKey)}</Text>
                </View>
                <View className={`rounded-full px-2.5 py-1 ${expiring ? 'bg-accent-600/15' : 'bg-brand-500/12'}`}>
                  <Text className={`text-[10.5px] font-bold uppercase tracking-wide ${expiring ? 'text-accent-700' : 'text-brand-700'}`}>
                    {t(expiring ? 'prof.renew' : 'prof.verified')}
                  </Text>
                </View>
              </View>
            );
          })}
          <View className="mt-1 flex-row items-center gap-1.5 self-start rounded-full bg-accent-600/12 px-2.5 py-1">
            <View className="h-[5px] w-[5px] rounded-full bg-accent-600" />
            <Text className="text-[10.5px] font-semibold text-accent-600">TODO §5 — doc expiry / re-upload</Text>
          </View>
        </View>

        {/* Links */}
        <View className="mt-5 rounded-lg border border-border bg-surface px-3.5 dark:border-dark-border dark:bg-dark-surface">
          {LINKS.map((link, i) => (
            <Pressable
              key={link.key}
              onPress={() => (link.route ? router.push(link.route as never) : placeholder(t(link.labelKey)))}
              className={`flex-row items-center gap-3.5 py-3 ${i > 0 ? 'border-t border-border dark:border-dark-border' : ''}`}
            >
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-surface-2 dark:bg-dark-surface-2">
                <Icon name={link.icon} size={18} color="#5e5650" filled={link.key === 'rating'} />
              </View>
              <Text className="flex-1 text-[14.5px] font-medium text-text dark:text-dark-text">{t(link.labelKey)}</Text>
              <Icon name="arrowRight" size={16} color="#8b857f" />
            </Pressable>
          ))}
        </View>

        {/* Sign out */}
        <View className="mt-4">
          <Button label={t('prof.logout')} variant="secondary" icon="logout" onPress={onSignOut} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
