import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Appbar, Icon, type IconName } from '@/shared/components';
import { useLang } from '@/i18n/LangProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/features/auth/store';

import { useSettingsStore, type ToggleKey } from './store';

const NOTIF: { key: ToggleKey; icon: IconName; label: string; desc: string }[] = [
  { key: 'nRequests', icon: 'bell', label: 'stg.nRequests', desc: 'stg.nRequestsD' },
  { key: 'nEarnings', icon: 'wallet', label: 'stg.nEarnings', desc: 'stg.nEarningsD' },
  { key: 'nPromos', icon: 'megaphone', label: 'stg.nPromos', desc: 'stg.nPromosD' },
];
const SECURITY: { key: ToggleKey; icon: IconName; label: string; desc: string }[] = [
  { key: 'pinLock', icon: 'lock', label: 'stg.pin', desc: 'stg.pinD' },
  { key: 'biometric', icon: 'fingerprint', label: 'stg.bio', desc: 'stg.bioD' },
];

export function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { lang, setLang } = useLang();
  const { active, setPreference } = useTheme();
  const signOut = useAuthStore((s) => s.signOut);
  const toggles = useSettingsStore((s) => s.toggles);
  const setToggle = useSettingsStore((s) => s.setToggle);

  const onSignOut = () => {
    signOut();
    router.replace('/auth');
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      <View className="px-7">
        <Appbar title={t('stg.title')} />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-7 pb-10" showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <Section label={t('stg.appearance')} />
        <Card>
          <Row icon="globe" label={t('stg.language')}>
            <Segmented
              options={[
                { key: 'en', label: 'EN', on: lang === 'en', onPress: () => setLang('en') },
                { key: 'ar', label: 'عربي', on: lang === 'ar', onPress: () => setLang('ar') },
              ]}
            />
          </Row>
          <Row icon="moon" label={t('stg.theme')} divider>
            <Segmented
              options={[
                { key: 'light', label: t('stg.light'), on: active === 'light', onPress: () => setPreference('light') },
                { key: 'dark', label: t('stg.dark'), on: active === 'dark', onPress: () => setPreference('dark') },
              ]}
            />
          </Row>
        </Card>

        {/* Notifications */}
        <Section label={t('stg.notifs')} />
        <Card>
          {NOTIF.map((r, i) => (
            <Row key={r.key} icon={r.icon} label={t(r.label)} desc={t(r.desc)} divider={i > 0}>
              <Switch
                value={toggles[r.key]}
                onValueChange={(v) => setToggle(r.key, v)}
                trackColor={{ true: '#2a673a', false: '#ddd6ce' }}
                thumbColor="#ffffff"
              />
            </Row>
          ))}
        </Card>

        {/* Security */}
        <Section label={t('stg.security')} />
        <Card>
          {SECURITY.map((r, i) => (
            <Row key={r.key} icon={r.icon} label={t(r.label)} desc={t(r.desc)} divider={i > 0}>
              <Switch
                value={toggles[r.key]}
                onValueChange={(v) => setToggle(r.key, v)}
                trackColor={{ true: '#2a673a', false: '#ddd6ce' }}
                thumbColor="#ffffff"
              />
            </Row>
          ))}
        </Card>
        <View className="mt-2 flex-row items-center gap-1.5 self-center rounded-full bg-accent-600/12 px-2.5 py-1">
          <View className="h-[5px] w-[5px] rounded-full bg-accent-600" />
          <Text className="text-[10.5px] font-semibold text-accent-600">{t('stg.todo')}</Text>
        </View>

        {/* Privacy */}
        <Section label={t('stg.privacy')} />
        <Card>
          <LinkRow icon="shield" label={t('stg.privacyPolicy')} />
          <LinkRow icon="help" label={t('stg.help')} divider />
          <Pressable onPress={onSignOut} className="flex-row items-center gap-3.5 border-t border-border py-3.5 dark:border-dark-border">
            <View className="h-[34px] w-[34px] items-center justify-center rounded-md bg-danger/10">
              <Icon name="logout" size={18} color="#c5372f" />
            </View>
            <Text className="flex-1 text-[14px] font-semibold text-danger">{t('stg.signout')}</Text>
          </Pressable>
        </Card>

        <Text className="mt-4 text-center text-[11px] text-text-faint dark:text-dark-text-faint">{t('stg.version')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ label }: { label: string }) {
  return (
    <Text className="mb-2.5 mt-5 px-1 font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
      {label}
    </Text>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View className="rounded-lg border border-border bg-surface px-3.5 dark:border-dark-border dark:bg-dark-surface">{children}</View>;
}

function Row({
  icon,
  label,
  desc,
  divider = false,
  children,
}: {
  icon: IconName;
  label: string;
  desc?: string;
  divider?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <View className={`flex-row items-center gap-3.5 py-3 ${divider ? 'border-t border-border dark:border-dark-border' : ''}`}>
      <View className="h-[34px] w-[34px] items-center justify-center rounded-md bg-surface-2 dark:bg-dark-surface-2">
        <Icon name={icon} size={18} color="#5e5650" />
      </View>
      <View className="flex-1">
        <Text className="text-[14px] font-semibold text-text dark:text-dark-text">{label}</Text>
        {desc ? <Text className="mt-0.5 text-[11.5px] text-text-muted dark:text-dark-text-muted">{desc}</Text> : null}
      </View>
      {children}
    </View>
  );
}

function LinkRow({ icon, label, divider = false }: { icon: IconName; label: string; divider?: boolean }) {
  return (
    <View className={`flex-row items-center gap-3.5 py-3.5 ${divider ? 'border-t border-border dark:border-dark-border' : ''}`}>
      <View className="h-[34px] w-[34px] items-center justify-center rounded-md bg-surface-2 dark:bg-dark-surface-2">
        <Icon name={icon} size={18} color="#5e5650" />
      </View>
      <Text className="flex-1 text-[14px] font-semibold text-text dark:text-dark-text">{label}</Text>
      <Icon name="arrowRight" size={16} color="#8b857f" />
    </View>
  );
}

function Segmented({ options }: { options: { key: string; label: string; on: boolean; onPress: () => void }[] }) {
  return (
    <View className="flex-row gap-[3px] rounded-[10px] bg-surface-2 p-[3px] dark:bg-dark-surface-2">
      {options.map((o) => (
        <Pressable key={o.key} onPress={o.onPress}>
          <View className={`rounded-lg px-3 py-1.5 ${o.on ? 'bg-surface dark:bg-dark-surface' : 'bg-transparent'}`}>
            <Text className={`text-[12.5px] font-semibold ${o.on ? 'text-text dark:text-dark-text' : 'text-text-muted dark:text-dark-text-muted'}`}>
              {o.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
