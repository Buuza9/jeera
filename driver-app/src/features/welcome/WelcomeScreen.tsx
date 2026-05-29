import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import {
  Brand,
  Button,
  Icon,
  Screen,
  type IconName,
} from "@/shared/components";

const FEATURES: { icon: IconName; titleKey: string; subKey: string }[] = [
  { icon: "clock", titleKey: "welcome.f1.title", subKey: "welcome.f1.sub" },
  { icon: "cash", titleKey: "welcome.f2.title", subKey: "welcome.f2.sub" },
  { icon: "chart", titleKey: "welcome.f3.title", subKey: "welcome.f3.sub" },
];

export function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Screen contentClassName="pb-8 pt-10">
      {/* Brand mark */}
      <View className="mb-7 items-center">
        <Brand size={96} />
      </View>

      <Text
        className="text-center font-display text-4xl font-semibold text-text dark:text-dark-text"
        style={{ letterSpacing: -1.2, lineHeight: 40 }}
      >
        {t("welcome.title")}
      </Text>
      <Text className="mx-auto mt-3 max-w-[340px] text-center text-[15.5px] leading-6 text-text-muted dark:text-dark-text-muted">
        {t("welcome.tag")}
      </Text>

      {/* Feature rows — match prototype .row card (surface, border, radius) */}
      <View className="mt-9 gap-2">
        {FEATURES.map((f) => (
          <View
            key={f.titleKey}
            className="flex-row items-center gap-3 rounded-md border border-border bg-surface px-4 py-3.5 dark:border-dark-border dark:bg-dark-surface"
          >
            <View className="h-[38px] w-[38px] items-center justify-center rounded-sm bg-brand-50 dark:bg-dark-surface-2">
              <Icon name={f.icon} size={22} color="#194f29" strokeWidth={1.8} />
            </View>
            <View className="flex-1">
              <Text
                className="text-sm font-semibold text-text dark:text-dark-text"
                style={{ letterSpacing: -0.17 }}
              >
                {t(f.titleKey)}
              </Text>
              <Text className="mt-0.5 text-[12.5px] leading-[17px] text-text-muted dark:text-dark-text-muted">
                {t(f.subKey)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View className="flex-1" />

      {/* Actions */}
      <View className="gap-3">
        <Button
          label={t("welcome.cta")}
          onPress={() => router.push("/enrollment")}
        />
        <Button
          label={t("welcome.signin")}
          variant="ghost"
          onPress={() => router.push("/auth")}
        />
      </View>

      <Text className="mx-auto mt-4 max-w-[280px] text-center text-[11.5px] leading-4 text-text-faint dark:text-dark-text-faint">
        {t("welcome.legal")}
      </Text>
    </Screen>
  );
}
