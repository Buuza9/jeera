import { View } from 'react-native';

import { Icon } from '@/shared/components';

// Saffron (accent-500) — matches the prototype's star colour.
const STAR_COLOR = '#e18e43';

/** Read-only row of stars: `value` filled out of `total`. */
export function StarRating({
  value,
  total = 5,
  size = 15,
  color = STAR_COLOR,
  gap = 3,
}: {
  value: number;
  total?: number;
  size?: number;
  color?: string;
  gap?: number;
}) {
  return (
    <View className="flex-row" style={{ gap }}>
      {Array.from({ length: total }).map((_, i) => (
        <Icon key={i} name="star" size={size} color={color} filled={i < value} strokeWidth={1.6} />
      ))}
    </View>
  );
}
