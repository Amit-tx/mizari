import { db } from '@/db';
import { forms, formResponses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { validateFieldValue } from '@/utils/form-builder-utils';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId: formIdStr } = await params;
    const formId = parseInt(formIdStr);
    const body = await req.json();
    const { responseData, submitterEmail, submitterName } = body;

    // Get form
    const form = await db
      .select()
      .from(forms)
      .where(eq(forms.id, formId))
      .then(r => r[0]);

    if (!form) {
      return new Response(JSON.stringify({ error: 'Form not found' }), { status: 404 });
    }

    if (!form.isPublished || !form.isEnabled) {
      return new Response(JSON.stringify({ error: 'Form not available' }), { status: 403 });
    }

    // Parse form structure
    const structure = JSON.parse(form.formStructure);
    const errors: Record<string, string[]> = {};

    // Validate all fields
    structure.sections.forEach((section: any) => {
      section.fields.forEach((field: any) => {
        const value = responseData[field.id];
        const validation = validateFieldValue(value, field);
        if (!validation.isValid) {
          errors[field.id] = validation.errors;
        }
      });
    });

    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', errors }),
        { status: 400 }
      );
    }

    // Get IP address
    const ip =
      (req.headers.get('x-forwarded-for') || '').split(',')[0] ||
      req.headers.get('x-real-ip') ||
      '0.0.0.0';

    // Get user agent
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Check if form allows multiple submissions
    if (!form.allowMultipleSubmissions) {
      const existingSubmission = await db
        .select()
        .from(formResponses)
        .where(
          eq(formResponses.formId, formId)
        )
        .then(r => r.filter(res => {
          const data = JSON.parse(res.responseData);
          return data['form-email'] === submitterEmail;
        })[0]);

      if (existingSubmission) {
        return new Response(
          JSON.stringify({ error: 'You have already submitted this form' }),
          { status: 403 }
        );
      }
    }

    // Save response
    await db.insert(formResponses).values({
      formId,
      profileId: form.profileId,
      responseData: JSON.stringify(responseData),
      submitterEmail: submitterEmail || '',
      submitterName: submitterName || 'Anonymous',
      submitterIp: ip,
      userAgent,
      isRead: 0,
      isStarred: 0,
    });

    // Update response count
    await db
      .update(forms)
      .set({ totalResponses: form.totalResponses + 1 })
      .where(eq(forms.id, formId));

    return Response.json({
      success: true,
      message: form.successMessage,
      redirectUrl: form.redirectUrl,
    });
  } catch (error) {
    console.error('Form submission error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId: formIdStr } = await params;
    const formId = parseInt(formIdStr);
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    const form = slug
      ? await db.select().from(forms).where(eq(forms.slug, slug)).then(r => r[0])
      : await db.select().from(forms).where(eq(forms.id, formId)).then(r => r[0]);

    if (!form || !form.isPublished) {
      return new Response(JSON.stringify({ error: 'Form not found' }), { status: 404 });
    }

    return Response.json({
      ...form,
      formStructure: JSON.parse(form.formStructure),
    });
  } catch (error) {
    console.error('Form GET error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
