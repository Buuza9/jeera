import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from './Icon';

// Minimal structural type for the bits of the tab-bar props we use — avoids the
// type clash between expo-router's BottomTabBarProps and @react-navigation's.
type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

// Per-route presentation, keyed by the tab route name (file name under (tabs)/).
const TAB_META: Record<string, { icon: IconName; labelKey: string }> = {
  dashboard: { icon: 'home', labelKey: 'nav.home' },
  trips: { icon: 'history', labelKey: 'nav.trips' },
  earnings: { icon: 'wallet', labelKey: 'nav.earnings' },
  profile: { icon: 'user', labelKey: 'nav.profile' },
};

/**
 * Custom bottom tab bar — floats (absolute) over the screen so the dashboard
 * map stays full-bleed behind it. Switching tabs calls navigation.navigate,
 * which keeps the other tab screens mounted (instant, no rebuild/slide).
 */
export function Navbar({ state, navigation }: TabBarProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom - 18, 2) }}
      className="absolute inset-x-0 bottom-0 z-20 flex-row border-t border-border bg-surface px-2 pt-1.5 dark:border-dark-border dark:bg-dark-surface"
    >
      {state.routes.map((route, index) => {
        const meta = TAB_META[route.name];
        if (!meta) return null;
        const on = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!on && !event.defaultPrevented) navigation.navigate(route.name);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            className="flex-1 items-center gap-1 rounded-xl px-0.5 py-1"
          >
            <Icon name={meta.icon} size={24} color={on ? '#2a673a' : '#8b857f'} />
            <Text
              className={`text-[10.5px] font-semibold ${
                on ? 'text-brand-600' : 'text-text-muted dark:text-dark-text-muted'
              }`}
            >
              {t(meta.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
