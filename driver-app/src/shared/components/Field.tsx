import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type FieldProps = TextInputProps & {
  label?: string;
  /** Error message; when set, the field shows the danger border + message. */
  error?: string | null;
  /** Optional element rendered before the input (e.g. a phone prefix). */
  prefix?: React.ReactNode;
  containerClassName?: string;
};

/**
 * Labelled text input — mirrors the prototype's .field / .email-input.
 * RTL-safe. Forwards the ref to the underlying TextInput for focus control.
 */
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, error, prefix, containerClassName = '', className = '', ...inputProps },
  ref,
) {
  const hasError = !!error;
  return (
    <View className={containerClassName}>
      {label ? (
        <Text className="mb-1.5 text-[13px] font-medium text-text-muted dark:text-dark-text-muted">
          {label}
        </Text>
      ) : null}
      <View
        style={{ height: 52 }}
        className={`flex-row items-stretch overflow-hidden rounded-md border bg-surface dark:bg-dark-surface ${
          hasError ? 'border-danger' : 'border-border dark:border-dark-border'
        }`}
      >
        {prefix}
        {/* Fixed-height row + a justify-center wrapper gives true vertical
            centering for single-line text (padding alone is biased by iOS
            font metrics; a fixed height on TextInput top-aligns on iOS). */}
        <View className="min-w-0 flex-1 justify-center px-4">
          <TextInput
            ref={ref}
            placeholderTextColor="#8b857f"
            style={{ padding: 0 }}
            className={`text-base text-text dark:text-dark-text ${className}`}
            {...inputProps}
          />
        </View>
      </View>
      {hasError ? <Text className="mt-1.5 text-xs text-danger">{error}</Text> : null}
    </View>
  );
});
