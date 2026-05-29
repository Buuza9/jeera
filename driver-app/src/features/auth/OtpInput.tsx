import { useRef, useState } from 'react';
import { TextInput, View, type NativeSyntheticEvent, type TextInputKeyPressEventData } from 'react-native';

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  /** Error state — boxes turn danger-colored. */
  error?: boolean;
  /** Called when all boxes are filled. */
  onComplete?: (code: string) => void;
};

/**
 * 6-box OTP entry. Always LTR (playbook §7) even in Arabic. Handles
 * auto-advance, backspace-to-previous, and paste (fills from the first box).
 */
export function OtpInput({ length = 6, value, onChange, error = false, onComplete }: OtpInputProps) {
  const refs = useRef<(TextInput | null)[]>([]);
  const [focused, setFocused] = useState<number | null>(null);
  const chars = value.padEnd(length).slice(0, length).split('');

  const setAt = (i: number, digits: string) => {
    const arr = value.padEnd(length).split('');
    if (digits.length <= 1) {
      arr[i] = digits;
      const next = arr.join('').trimEnd();
      onChange(next);
      if (digits && i < length - 1) refs.current[i + 1]?.focus();
      if (next.length === length) onComplete?.(next);
    } else {
      // Paste: distribute digits from box i.
      const clean = digits.replace(/\D/g, '').slice(0, length - i);
      for (let k = 0; k < clean.length; k++) arr[i + k] = clean[k];
      const next = arr.join('').trimEnd();
      onChange(next);
      const landing = Math.min(i + clean.length, length - 1);
      refs.current[landing]?.focus();
      if (next.length === length) onComplete?.(next);
    }
  };

  const onKeyPress = (i: number) => (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !chars[i]?.trim() && i > 0) {
      const arr = value.padEnd(length).split('');
      arr[i - 1] = '';
      onChange(arr.join('').trimEnd());
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <View className="flex-row gap-2" style={{ direction: 'ltr' }}>
      {Array.from({ length }).map((_, i) => {
        const filled = !!chars[i]?.trim();
        const active = focused === i;
        return (
          <TextInput
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={chars[i]?.trim() ?? ''}
            onChangeText={(txt) => setAt(i, txt.replace(/\D/g, ''))}
            onKeyPress={onKeyPress(i)}
            onFocus={() => setFocused(i)}
            onBlur={() => setFocused(null)}
            keyboardType="number-pad"
            maxLength={i === 0 ? length : 1}
            textContentType="oneTimeCode"
            selectTextOnFocus
            className={`flex-1 rounded-[12px] border-[1.5px] bg-surface text-center text-[22px] font-bold text-text dark:bg-dark-surface dark:text-dark-text ${
              error
                ? 'border-danger bg-danger/5'
                : active
                  ? 'border-brand-500'
                  : 'border-border dark:border-dark-border'
            }`}
            style={{ aspectRatio: 1 / 1.2 }}
          />
        );
      })}
    </View>
  );
}
