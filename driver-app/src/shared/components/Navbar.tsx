import { usePathname, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from './Icon';

type Tab = { id: string; href: string; icon: IconName; labelKey: string };

// Four bottom tabs — mirrors the prototype navbar.js.
const TABS: Tab[] = [
  { id: 'home', href: '/dashboard', icon: 'home', labelKey: 'nav.home' },
  { id: 'trips', href: '/trips', icon: 'history', labelKey: 'nav.trips' },
  { id: 'earnings', href: '/earnings', icon: 'wallet', labelKey: 'nav.earnings' },
  { id: 'profile', href: '/profile', icon: 'user', labelKey: 'nav.profile' },
];

/** Bottom tab bar. `active` is the tab id of the current screen. */
export function Navbar({ active }: { active: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      className="absolute inset-x-0 bottom-0 z-20 flex-row border-t border-border bg-surface px-2 pt-2.5 dark:border-dark-border dark:bg-dark-surface"
    >
      {TABS.map((tab) => {
        const on = active === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => {
              if (pathname !== tab.href) router.replace(tab.href as never);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            className="flex-1 items-center gap-1 rounded-xl px-0.5 py-1"
          >
            <Icon name={tab.icon} size={24} color={on ? '#2a673a' : '#8b857f'} />
            <Text
              className={`text-[10.5px] font-semibold ${
                on ? 'text-brand-600' : 'text-text-muted dark:text-dark-text-muted'
              }`}
            >
              {t(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
