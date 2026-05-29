import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  /** Optional leading icon (heroicons outline name). */
  icon?: IconName;
  className?: string;
};

// Tailwind class sets per variant. Mirrors prototype .btn-primary/-secondary/-ghost/-danger.
const CONTAINER: Record<Variant, string> = {
  primary: 'bg-brand-600 active:bg-brand-700',
  secondary: 'bg-surface-2 border border-border dark:bg-dark-surface-2 dark:border-dark-border',
  ghost: 'bg-transparent',
  danger: 'bg-danger active:opacity-90',
};

const LABEL: Record<Variant, string> = {
  primary: 'text-text-onbrand',
  secondary: 'text-text dark:text-dark-text',
  ghost: 'text-brand-600',
  danger: 'text-white',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const labelColor = variant === 'primary' || variant === 'danger' ? '#fff' : undefined;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`h-14 flex-row items-center justify-center gap-2 rounded-md px-5 ${CONTAINER[variant]} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={labelColor ?? '#2a673a'} />
      ) : (
        <>
          {icon ? (
            <View>
              <Icon name={icon} size={20} color={labelColor ?? '#2a673a'} />
            </View>
          ) : null}
          <Text className={`text-base font-semibold ${LABEL[variant]}`}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
