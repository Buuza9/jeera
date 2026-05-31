import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { Appbar, Button, Field, Screen } from '@/shared/components';
import { COUNTRY, formatLocalPhone } from '@/shared/phone';

import { submitEnrollment } from './data';
import { UploadTile } from './UploadTile';
import { useEnrollmentStore } from './store';

type Asset = ImagePicker.ImagePickerAsset;

export function EnrollmentScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const setSubmitted = useEnrollmentStore((s) => s.setSubmitted);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [plate, setPlate] = useState('');
  const [idImage, setIdImage] = useState<Asset | null>(null);
  const [licenseImage, setLicenseImage] = useState<Asset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // National ID is exactly 12 digits.
  const idValid = nationalId.length === 12;
  const filled =
    [fullName, phone, licenseNumber, plate].every((v) => v.trim().length > 1) && idValid;
  const canSubmit = filled && !!idImage && !!licenseImage && !submitting;

  // Pick a document photo from the library (base64 needed for the Storage upload).
  const pick = async (set: (a: Asset) => void) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      base64: true,
    });
    if (!res.canceled && res.assets[0]) set(res.assets[0]);
  };

  const onSubmit = async () => {
    if (!canSubmit || !idImage || !licenseImage) return;
    setSubmitting(true);
    const application = {
      fullName,
      phone,
      nationalId,
      licenseNumber,
      plate,
      idPhoto: true,
      licensePhoto: true,
    };
    try {
      await submitEnrollment(application, {
        id: { uri: idImage.uri, base64: idImage.base64 },
        license: { uri: licenseImage.uri, base64: licenseImage.base64 },
      });
      setSubmitted(application);
      router.replace('/enrollment/pending');
    } catch (e) {
      Alert.alert(t('enr.title'), e instanceof Error ? e.message : t('enr.submitErr'));
    } finally {
      setSubmitting(false);
    }
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
          placeholder="119XXXXXXXXX"
          value={nationalId}
          onChangeText={(v) => setNationalId(v.replace(/\D/g, '').slice(0, 12))}
          maxLength={12}
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
          uri={idImage?.uri}
          onPress={() => pick(setIdImage)}
        />
        <UploadTile
          title={t('enr.licPhoto')}
          subtitle={t('enr.licPhotoSub')}
          uri={licenseImage?.uri}
          onPress={() => pick(setLicenseImage)}
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
