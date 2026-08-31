import { notFound } from 'next/navigation';
import { db } from '@/db';
import { forms, profiles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import PublicFormClient from './PublicFormClient';

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function PublicFormPage({ params }: Props) {
  const { username, slug } = await params;

  // Find the profile by username
  const profile = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.username, username))
    .then(r => r[0]);

  if (!profile) notFound();

  // Find the published form by slug + profileId
  const form = await db
    .select()
    .from(forms)
    .where(
      and(
        eq(forms.profileId, profile.id),
        eq(forms.slug, slug),
        eq(forms.isPublished, 1),
        eq(forms.isEnabled, 1),
      )
    )
    .then(r => r[0]);

  if (!form) notFound();

  // Parse JSON structure
  let structure;
  try {
    structure = typeof form.formStructure === 'string'
      ? JSON.parse(form.formStructure)
      : form.formStructure;
  } catch {
    structure = { sections: [], conditionalLogic: [] };
  }

  const config = {
    title: form.title,
    description: form.description,
    submitButtonText: form.submitButtonText,
    successMessage: form.successMessage,
    redirectUrl: form.redirectUrl,
    collectEmail: form.collectEmail === 1,
    collectName: form.collectName === 1,
    allowMultipleSubmissions: form.allowMultipleSubmissions !== 0,
    backgroundColor: form.backgroundColor,
    textColor: form.textColor,
    buttonColor: form.buttonColor,
    borderRadius: form.borderRadius,
    isPublished: true,
    isEnabled: true,
  };

  return (
    <PublicFormClient
      formId={form.id}
      config={config}
      structure={structure}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { username, slug } = await params;
  const profile = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.username, username)).then(r => r[0]);
  if (!profile) return { title: 'Form' };
  const form = await db.select({ title: forms.title }).from(forms).where(and(eq(forms.profileId, profile.id), eq(forms.slug, slug))).then(r => r[0]);
  return { title: form?.title ?? 'Form' };
}
