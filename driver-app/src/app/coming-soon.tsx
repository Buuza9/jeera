import { useLocalSearchParams } from 'expo-router';

import { ComingSoon } from '@/features/_placeholder/ComingSoon';

// Generic titled placeholder for not-yet-built sub-screens (e.g. profile rows).
export default function ComingSoonRoute() {
  const { title } = useLocalSearchParams<{ title?: string }>();
  return <ComingSoon title={title ?? 'Coming soon'} />;
}
