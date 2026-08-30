import { auth } from '@/auth';
import { db } from '@/db';
import { forms, profiles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateSlug } from '@/utils/form-builder-utils';

async function getProfile(userId: number) {
  return db.select().from(profiles).where(eq(profiles.userId, userId)).then(r => r[0]);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { config, structure, slug, formId } = body;

    // Validate required fields
    if (!config?.title?.trim()) {
      return Response.json({ error: 'Form title is required' }, { status: 400 });
    }
    if (!structure?.sections || structure.sections.length === 0) {
      return Response.json({ error: 'Form must have at least one section' }, { status: 400 });
    }

    const profile = await getProfile(parseInt(String(session.user.id)));
    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }

    const formStructureStr = JSON.stringify(structure);
    const safeSlug = slug || generateSlug(config.title);

    // ── UPDATE existing form ────────────────────────────────────────────────
    if (formId) {
      await db
        .update(forms)
        .set({
          title: config.title.trim(),
          description: config.description ?? '',
          slug: safeSlug,
          formStructure: formStructureStr,
          submitButtonText: config.submitButtonText || 'Submit',
          successMessage: config.successMessage || 'Thank you!',
          redirectUrl: config.redirectUrl ?? '',
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

    // ── CREATE new form ─────────────────────────────────────────────────────
    const [inserted] = await db
      .insert(forms)
      .values({
        profileId: profile.id,
        title: config.title.trim(),
        description: config.description ?? '',
        slug: safeSlug,
        formStructure: formStructureStr,
        submitButtonText: config.submitButtonText || 'Submit',
        successMessage: config.successMessage || 'Thank you!',
        redirectUrl: config.redirectUrl ?? '',
        collectEmail: config.collectEmail ? 1 : 0,
        collectName: config.collectName ? 1 : 0,
        allowMultipleSubmissions: config.allowMultipleSubmissions !== false ? 1 : 0,
        backgroundColor: config.backgroundColor || '#ffffff',
        textColor: config.textColor || '#1a1a1a',
        buttonColor: config.buttonColor || '#FF6B6B',
        borderRadius: config.borderRadius || 'rounded-lg',
        isPublished: config.isPublished ? 1 : 0,
        isEnabled: config.isEnabled !== false ? 1 : 0,
      })
      .returning({ id: forms.id });

    return Response.json({ id: inserted.id, success: true });
  } catch (error: any) {
    console.error('[POST /api/forms] Error:', error?.message ?? error);
    // Surface a helpful message if the table doesn't exist yet
    if (error?.message?.includes('relation') && error?.message?.includes('does not exist')) {
      return Response.json(
        { error: 'Database table not found. Please run: npx drizzle-kit push' },
        { status: 500 }
      );
    }
    return Response.json({ error: error?.message ?? 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfile(parseInt(String(session.user.id)));
    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }

    const url = new URL(req.url);
    const formId = url.searchParams.get('formId');

    if (formId) {
      const form = await db
        .select()
        .from(forms)
        .where(and(eq(forms.id, parseInt(formId)), eq(forms.profileId, profile.id)))
        .then(r => r[0]);

      if (!form) return Response.json({ error: 'Form not found' }, { status: 404 });

      return Response.json({
        ...form,
        formStructure: safeParseJson(form.formStructure, { sections: [], conditionalLogic: [] }),
      });
    }

    const userForms = await db.select().from(forms).where(eq(forms.profileId, profile.id));

    return Response.json(
      userForms.map(f => ({
        ...f,
        formStructure: safeParseJson(f.formStructure, { sections: [], conditionalLogic: [] }),
      }))
    );
  } catch (error: any) {
    console.error('[GET /api/forms] Error:', error?.message ?? error);
    return Response.json({ error: error?.message ?? 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const formId = url.searchParams.get('formId');
    if (!formId) return Response.json({ error: 'formId required' }, { status: 400 });

    const profile = await getProfile(parseInt(String(session.user.id)));
    if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 });

    await db.delete(forms).where(and(eq(forms.id, parseInt(formId)), eq(forms.profileId, profile.id)));

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/forms] Error:', error?.message ?? error);
    return Response.json({ error: error?.message ?? 'Internal server error' }, { status: 500 });
  }
}

// Safe JSON parse — returns fallback on any error
function safeParseJson(str: string, fallback: any = null) {
  try { return JSON.parse(str); } catch { return fallback; }
}
