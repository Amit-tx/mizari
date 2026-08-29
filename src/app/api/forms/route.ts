import { auth } from '@/auth';
import { db } from '@/db';
import { forms, profiles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateId } from '@/utils/form-builder-utils';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await req.json();
    const { config, structure, slug, formId } = body;

    if (!config.title || !structure.sections || structure.sections.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid form data' }), { status: 400 });
    }

    // Get profile
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, parseInt(String(session.user.id))))
      .then(r => r[0]);

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
    }

    // If updating existing form
    if (formId) {
      await db
        .update(forms)
        .set({
          title: config.title,
          description: config.description || '',
          slug,
          formStructure: JSON.stringify(structure),
          submitButtonText: config.submitButtonText || 'Submit',
          successMessage: config.successMessage || 'Thank you!',
          redirectUrl: config.redirectUrl || '',
          collectEmail: config.collectEmail ? 1 : 0,
          collectName: config.collectName ? 1 : 0,
          allowMultipleSubmissions: config.allowMultipleSubmissions !== false ? 1 : 0,
          backgroundColor: config.backgroundColor || '#ffffff',
          textColor: config.textColor || '#1a1a1a',
          buttonColor: config.buttonColor || '#FF6B6B',
          borderRadius: config.borderRadius || 'rounded-lg',
          isPublished: config.isPublished ? 1 : 0,
          isEnabled: config.isEnabled !== false ? 1 : 0,
          updatedAt: new Date(),
        })
        .where(and(eq(forms.id, formId), eq(forms.profileId, profile.id)));

      return Response.json({ id: formId, success: true });
    }

    // Create new form
    const result = await db.insert(forms).values({
      profileId: profile.id,
      title: config.title,
      description: config.description || '',
      slug,
      formStructure: JSON.stringify(structure),
      submitButtonText: config.submitButtonText || 'Submit',
      successMessage: config.successMessage || 'Thank you!',
      redirectUrl: config.redirectUrl || '',
      collectEmail: config.collectEmail ? 1 : 0,
      collectName: config.collectName ? 1 : 0,
      allowMultipleSubmissions: config.allowMultipleSubmissions !== false ? 1 : 0,
      backgroundColor: config.backgroundColor || '#ffffff',
      textColor: config.textColor || '#1a1a1a',
      buttonColor: config.buttonColor || '#FF6B6B',
      borderRadius: config.borderRadius || 'rounded-lg',
      isPublished: config.isPublished ? 1 : 0,
      isEnabled: config.isEnabled !== false ? 1 : 0,
    });

    return Response.json({ id: (result.rows[0] as any)?.id, success: true });
  } catch (error) {
    console.error('Form API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const url = new URL(req.url);
    const formId = url.searchParams.get('formId');
    const profileId = url.searchParams.get('profileId');

    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, parseInt(String(session.user.id))))
      .then(r => r[0]);

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
    }

    // Get single form
    if (formId) {
      const form = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, parseInt(formId)), eq(forms.profileId, profile.id)))
        .then(r => r[0]);

      if (!form) {
        return new Response(JSON.stringify({ error: 'Form not found' }), { status: 404 });
      }

      return Response.json({
        ...form,
        formStructure: JSON.parse(form.formStructure),
      });
    }

    // Get all forms for profile
    const userForms = await db
      .select()
      .from(forms)
      .where(eq(forms.profileId, profile.id));

    return Response.json(
      userForms.map(f => ({
        ...f,
        formStructure: JSON.parse(f.formStructure),
      }))
    );
  } catch (error) {
    console.error('Form GET error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const url = new URL(req.url);
    const formId = url.searchParams.get('formId');

    if (!formId) {
      return new Response(JSON.stringify({ error: 'Form ID required' }), { status: 400 });
    }

    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, parseInt(String(session.user.id))))
      .then(r => r[0]);

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404 });
    }

    await db
      .delete(forms)
      .where(and(eq(forms.id, parseInt(formId)), eq(forms.profileId, profile.id)));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Form DELETE error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
