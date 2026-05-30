import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Appbar, Icon } from '@/shared/components';

import { FaqItem } from './FaqItem';
import { CONTACTS, FAQ, SUPPORT_EMAIL, SUPPORT_PHONE, type Contact } from './data';

export function SupportScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const onSos = () =>
    Alert.alert(t('sup.sos'), t('sup.sosConfirm'), [
      { text: t('common.back'), style: 'cancel' },
      { text: t('sup.sosGo'), style: 'destructive', onPress: () => Linking.openURL('tel:1515') },
    ]);

  const onContact = (c: Contact) => {
    if (c.key === 'call') Linking.openURL(SUPPORT_PHONE);
    else if (c.key === 'email') Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
    else Alert.alert(t('sup.chat'), t('sup.chatSoon')); // live chat — mock
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-bg dark:bg-dark-bg">
      <View className="px-7">
        <Appbar title={t('sup.title')} onBack={() => (router.canGoBack() ? router.back() : router.navigate('/profile'))} />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-7 pb-10" showsVerticalScrollIndicator={false}>
        {/* SOS */}
        <Pressable
          onPress={onSos}
          className="flex-row items-center gap-3.5 overflow-hidden rounded-lg bg-danger p-4"
          style={{ shadowColor: '#c5372f', shadowOpacity: 0.32, shadowRadius: 28, shadowOffset: { width: 0, height: 12 } }}
        >
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-white/[0.18]">
            <Icon name="sos" size={24} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text className="text-[16px] font-bold text-white">{t('sup.sos')}</Text>
            <Text className="mt-0.5 text-[12.5px] leading-[17px] text-white/90">{t('sup.sosSub')}</Text>
          </View>
        </Pressable>

        {/* Contact */}
        <Text className="mb-2.5 mt-5 px-1 font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
          {t('sup.contact')}
        </Text>
        <View className="rounded-lg border border-border bg-surface px-3.5 dark:border-dark-border dark:bg-dark-surface">
          {CONTACTS.map((c, i) => (
            <Pressable
              key={c.key}
              onPress={() => onContact(c)}
              className={`flex-row items-center gap-3.5 py-3 ${i > 0 ? 'border-t border-border dark:border-dark-border' : ''}`}
            >
              <View className="h-[38px] w-[38px] items-center justify-center rounded-md bg-brand-50 dark:bg-dark-surface-2">
                <Icon name={c.icon} size={18} color="#194f29" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-semibold text-text dark:text-dark-text">{t(c.titleKey)}</Text>
                <Text className="mt-0.5 text-[12px] text-text-muted dark:text-dark-text-muted">
                  {c.subKey ? t(c.subKey) : c.sub}
                </Text>
              </View>
              <Icon name="arrowRight" size={16} color="#8b857f" />
            </Pressable>
          ))}
        </View>

        {/* FAQ */}
        <Text className="mb-2.5 mt-5 px-1 font-mono text-[11px] uppercase tracking-widest text-text-muted dark:text-dark-text-muted">
          {t('sup.faq')}
        </Text>
        <View className="overflow-hidden rounded-lg border border-border bg-surface dark:border-dark-border dark:bg-dark-surface">
          {FAQ.map((f, i) => (
            <FaqItem key={f.q} questionKey={f.q} answerKey={f.a} divider={i > 0} />
          ))}
        </View>

        <Text className="mt-5 text-center text-[11px] text-text-faint dark:text-dark-text-faint">{t('sup.version')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
