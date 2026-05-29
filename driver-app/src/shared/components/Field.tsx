import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type FieldProps = TextInputProps & {
  label?: string;
  /** Error message; when set, the field shows the danger border + message. */
  error?: string | null;
  /** Optional leading element (e.g. a "+218" phone prefix), rendered at the start. */
  prefix?: React.ReactNode;
  containerClassName?: string;
};

/**
 * Labelled text input — 1:1 with the prototype `.field`:
 *   label 12px/600, gap 6px, input padding 14×15, 15px text, r-md border.
 * Symmetric vertical padding keeps placeholder and typed text in the same
 * centered position. RTL-safe (logical padding). Forwards ref to the TextInput.
 */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, error, prefix, containerClassName = '', className = '', ...inputProps },
  ref,
) {
  const hasError = !!error;
  return (
    <View className={containerClassName} style={{ gap: 6 }}>
      {label ? (
        <Text
          className="text-[12px] font-semibold text-text-muted dark:text-dark-text-muted"
          style={{ letterSpacing: 0.24 }}
        >
          {label}
        </Text>
      ) : null}
      <View
        className={`flex-row items-center overflow-hidden rounded-md border bg-surface dark:bg-dark-surface ${
          hasError ? 'border-danger' : 'border-border dark:border-dark-border'
        }`}
      >
        {prefix ? <View style={{ paddingStart: 15 }}>{prefix}</View> : null}
        <TextInput
          ref={ref}
          placeholderTextColor="#8b857f"
          style={{
            paddingVertical: 14,
            paddingStart: prefix ? 8 : 15,
            paddingEnd: 15,
          }}
          className={`min-w-0 flex-1 text-[15px] text-text dark:text-dark-text ${className}`}
          {...inputProps}
        />
      </View>
      {hasError ? <Text className="mt-1.5 text-xs text-danger">{error}</Text> : null}
    </View>
  );
});
