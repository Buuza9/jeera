import { Tabs } from 'expo-router';

import { Navbar } from '@/shared/components';

/**
 * Bottom-tab group for the four main screens. They stay mounted, so switching
 * tabs is instant (no rebuild, no map reload). The custom <Navbar/> tab bar
 * floats over the content (absolute) so the dashboard map stays full-bleed.
 * Detail pages (trip, commission, …) are pushed on the ROOT stack over this.
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <Navbar {...props} />}
      screenOptions={{ headerShown: false, animation: 'none', sceneStyle: { backgroundColor: 'transparent' } }}
    >
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="trips" />
      <Tabs.Screen name="earnings" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
