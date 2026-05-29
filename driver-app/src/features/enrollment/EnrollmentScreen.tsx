import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { Appbar, Button, Field, Screen } from '@/shared/components';
import { COUNTRY, formatLocalPhone } from '@/shared/phone';

import { submitEnrollment } from './data';
import { UploadTile } from './UploadTile';
import { useEnrollmentStore } from './store';

export function EnrollmentScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const setSubmitted = useEnrollmentStore((s) => s.setSubmitted);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [plate, setPlate] = useState('');
  const [idPhoto, setIdPhoto] = useState(false);
  const [licensePhoto, setLicensePhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filled = [fullName, phone, nationalId, licenseNumber, plate].every(
    (v) => v.trim().length > 1,
  );
  const canSubmit = filled && idPhoto && licensePhoto && !submitting;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    const application = { fullName, phone, nationalId, licenseNumber, plate, idPhoto, licensePhoto };
    await submitEnrollment(application);
    setSubmitted(application);
    router.replace('/enrollment/pending');
  };

  return (
    <Screen contentClassName="pt-2">
      <Appbar title={t('enr.title')} onBack={() => router.replace('/')} />

      <Text className="mb-5 text-[14px] text-text-muted dark:text-dark-text-muted">
        {t('enr.sub')}
      </Text>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-3 pb-4"
      >
        <Field
          label={t('enr.fullName')}
          placeholder={t('enr.fullNamePh')}
          value={fullName}
          onChangeText={setFullName}
        />
        <Field
          label={t('enr.phone')}
          keyboardType="number-pad"
          placeholder="9X XXX XXXX"
          value={phone}
          onChangeText={(v) => setPhone(formatLocalPhone(v))}
          maxLength={11}
          prefix={
            <Text className="text-[15px] font-medium text-text-muted dark:text-dark-text-muted">
              {COUNTRY.dialCode}
            </Text>
          }
        />
        <Field
          label={t('enr.id')}
          keyboardType="number-pad"
          placeholder="1198XXXXXXX"
          value={nationalId}
          onChangeText={setNationalId}
        />
        <Field
          label={t('enr.license')}
          autoCapitalize="characters"
          placeholder="LIB-XXXXXXX"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
        />
        <Field
          label={t('enr.plate')}
          autoCapitalize="characters"
          placeholder="123 TR 5"
          value={plate}
          onChangeText={setPlate}
        />

        {/* Documents divider */}
        <View className="my-1 flex-row items-center gap-2.5">
          <View className="h-px flex-1 bg-border dark:bg-dark-border" />
          <Text className="text-[11px] uppercase tracking-wide text-text-faint dark:text-dark-text-faint">
            {t('prof.docs')}
          </Text>
          <View className="h-px flex-1 bg-border dark:bg-dark-border" />
        </View>

        <UploadTile
          title={t('enr.idPhoto')}
          subtitle={t('enr.idPhotoSub')}
          done={idPhoto}
          onPress={() => setIdPhoto((v) => !v)}
        />
        <UploadTile
          title={t('enr.licPhoto')}
          subtitle={t('enr.licPhotoSub')}
          done={licensePhoto}
          onPress={() => setLicensePhoto((v) => !v)}
        />
      </ScrollView>

      {/* Sticky submit */}
      <View className="pb-2 pt-3">
        <Button
          label={t('enr.submit')}
          onPress={onSubmit}
          disabled={!canSubmit}
          loading={submitting}
        />
      </View>
    </Screen>
  );
}
