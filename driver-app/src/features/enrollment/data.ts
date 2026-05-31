import { USE_MOCKS } from '@/shared/config';
import { getSupabase } from '@/shared/supabase';

import { type Application } from './store';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Submit a driver application for review.
 * Mock: resolves after a short delay.
 * Real: upsert a `drivers` row keyed to the signed-in user (status → pending).
 * The driver must be authenticated first (RLS requires auth.uid() = id).
 * Doc photos are booleans for now; Storage upload is a later phase.
 */
export async function submitEnrollment(application: Application): Promise<void> {
  if (USE_MOCKS) {
    await wait(700);
    return;
  }
  const supabase = getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to submit an application.');

  const { error } = await supabase.from('drivers').upsert({
    id: user.id,
    email: user.email,
    full_name: application.fullName,
    phone: application.phone,
    national_id: application.nationalId,
    license_number: application.licenseNumber,
    plate: application.plate,
    id_photo_uploaded: application.idPhoto,
    license_photo_uploaded: application.licensePhoto,
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
