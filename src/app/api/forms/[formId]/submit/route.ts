import { db } from '@/db';
import { forms, formResponses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { validateFieldValue } from '@/utils/form-builder-utils';

// Max sizes to prevent abuse
const MAX_BODY_BYTES = 64_000;   // 64 KB per submission
const MAX_STRING_LEN = 10_000;   // per field value

function sanitize(val: unknown): unknown {
  if (typeof val === 'string') return val.slice(0, MAX_STRING_LEN).trim();
  if (Array.isArray(val)) return val.map(sanitize);
  if (val && typeof val === 'object') {
    return Object.fromEntries(
      Object.entries(val as Record<string, unknown>).map(([k, v]) => [k, sanitize(v)])
    );
  }
  return val;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId: formIdStr } = await params;
    const formId = parseInt(formIdStr);
    if (isNaN(formId)) return Response.json({ error: 'Invalid form ID' }, { status: 400 });

    // Enforce body size limit
    const contentLength = parseInt(req.headers.get('content-length') || '0');
    if (contentLength > MAX_BODY_BYTES) {
      return Response.json({ error: 'Request too large' }, { status: 413 });
    }

    const body = await req.json();
    const { responseData: rawData, submitterEmail = '', submitterName = '' } = body;

    // Sanitize all user input
    const responseData = sanitize(rawData) as Record<string, any>;
    const safeEmail = String(submitterEmail).slice(0, 500).trim();
    const safeName = String(submitterName).slice(0, 500).trim();

    const form = await db.select().from(forms).where(eq(forms.id, formId)).then(r => r[0]);
    if (!form) return Response.json({ error: 'Form not found' }, { status: 404 });
    if (form.isPublished !== 1 || form.isEnabled !== 1) {
      return Response.json({ error: 'Form is not available' }, { status: 403 });
    }

    // Validate fields
    let structure: any;
    try { structure = JSON.parse(form.formStructure); } catch { structure = { sections: [] }; }

    const errors: Record<string, string[]> = {};
    structure.sections?.forEach((section: any) => {
      section.fields?.forEach((field: any) => {
        const v = validateFieldValue(responseData[field.id], field);
        if (!v.isValid) errors[field.id] = v.errors;
      });
    });
    if (Object.keys(errors).length) {
      return Response.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    // Duplicate check (only when collectEmail=1 AND email provided)
    if (!form.allowMultipleSubmissions && form.collectEmail === 1 && safeEmail) {
      const existing = await db
        .select({ id: formResponses.id })
        .from(formResponses)
        .where(and(eq(formResponses.formId, formId), eq(formResponses.submitterEmail, safeEmail)))
        .then(r => r[0]);
      if (existing) {
        return Response.json({ error: 'You have already submitted this form' }, { status: 409 });
      }
    }

    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim()
      || req.headers.get('x-real-ip') || '0.0.0.0';
    const userAgent = (req.headers.get('user-agent') || 'unknown').slice(0, 500);

    await db.insert(formResponses).values({
      formId,
      profileId: form.profileId,
      responseData: JSON.stringify(responseData),
      submitterEmail: safeEmail,
      submitterName: safeName || 'Anonymous',
      submitterIp: ip,
      userAgent,
      isRead: 0,
      isStarred: 0,
    });

    // Safe increment (handles null totalResponses)
    await db.update(forms)
      .set({ totalResponses: (form.totalResponses ?? 0) + 1, updatedAt: new Date() })
      .where(eq(forms.id, formId));

    return Response.json({
      success: true,
      message: form.successMessage || 'Thank you!',
      redirectUrl: form.redirectUrl || null,
    });
  } catch (err: any) {
    console.error('[POST /api/forms/submit]', err?.message);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
