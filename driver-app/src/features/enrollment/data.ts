import { decode } from 'base64-arraybuffer';

import { USE_MOCKS } from '@/shared/config';
import { getSupabase } from '@/shared/supabase';
import { type SupabaseClient } from '@supabase/supabase-js';

import { type Application } from './store';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** A picked document image (subset of expo-image-picker's asset). */
export type DocImage = { uri: string; base64?: string | null };
export type EnrollmentDocs = { id: DocImage; license: DocImage };

const BUCKET = 'driver-docs';

/** Upload one base64 image to `{uid}/{key}.{ext}` in the private bucket → returns the path. */
async function uploadDoc(supabase: SupabaseClient, uid: string, key: string, img: DocImage): Promise<string> {
  if (!img.base64) throw new Error('Image data missing — please re-pick the photo.');
  const png = /\.png$/i.test(img.uri);
  const path = `${uid}/${key}.${png ? 'png' : 'jpg'}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, decode(img.base64), {
    contentType: png ? 'image/png' : 'image/jpeg',
    upsert: true,
  });
  if (error) throw error;
  return path;
}

/**
 * Submit a driver application for review.
 * Mock: resolves after a short delay.
 * Real: uploads the ID + license photos to the private `driver-docs` Storage
 * bucket, then upserts a `drivers` row keyed to the signed-in user (status →
 * pending) with the resulting object paths. Requires an authenticated session.
 */
export async function submitEnrollment(application: Application, docs?: EnrollmentDocs): Promise<void> {
  if (USE_MOCKS) {
    await wait(700);
    return;
  }
  if (!docs) throw new Error('Please add both document photos.');

  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to submit an application.');

  const idPath = await uploadDoc(supabase, user.id, 'id', docs.id);
  const licensePath = await uploadDoc(supabase, user.id, 'license', docs.license);

  const { error } = await supabase.from('drivers').upsert({
    id: user.id,
    email: user.email,
    full_name: application.fullName,
    phone: application.phone,
    national_id: application.nationalId,
    license_number: application.licenseNumber,
    plate: application.plate,
    id_photo_path: idPath,
    license_photo_path: licensePath,
    status: 'pending',
  });
  if (error) throw error;
}

/** Mask a national ID for display: keep first 4 digits, mask the rest. */
export function maskId(id: string): string {
  const digits = id.replace(/\s/g, '');
  if (digits.length <= 4) return digits;
  return digits.slice(0, 4) + '*'.repeat(digits.length - 4);
}
