import { auth } from '@/auth';
import { db } from '@/db';
import { formResponses, forms, profiles } from '@/db/schema';
import { eq, and, desc, ilike } from 'drizzle-orm';
import { exportFormResponsesToCSV } from '@/utils/form-builder-utils';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { formId: formIdStr } = await params;
    const formId = parseInt(formIdStr);
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const search = url.searchParams.get('search');
    const isRead = url.searchParams.get('isRead');
    const isStarred = url.searchParams.get('isStarred');
    const sortBy = url.searchParams.get('sortBy') || 'newest';

    // Verify ownership
    const form = await db
      .select()
      .from(forms)
      .where(eq(forms.id, formId))
      .then(r => r[0]);

    if (!form) {
      return new Response(JSON.stringify({ error: 'Form not found' }), { status: 404 });
    }

    // Check if user owns this form via profile
    const profile = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.id, form.profileId), eq(profiles.userId, parseInt(String(session.user.id)))))
      .then(r => r[0]);

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Get responses
    let responses = await db
      .select()
      .from(formResponses)
      .where(eq(formResponses.formId, formId));

    // Filter
    if (search) {
      responses = responses.filter(r =>
        r.submitterName.toLowerCase().includes(search.toLowerCase()) ||
        r.submitterEmail.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (isRead) {
      responses = responses.filter(r => r.isRead === parseInt(isRead));
    }

    if (isStarred) {
      responses = responses.filter(r => r.isStarred === parseInt(isStarred));
    }

    // Sort
    if (sortBy === 'oldest') {
      responses = responses.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else {
      responses = responses.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // If export action
    if (action === 'export') {
      const formStructure = JSON.parse(form.formStructure);
      const fieldLabels: Record<string, string> = {};

      formStructure.sections.forEach((section: any) => {
        section.fields.forEach((field: any) => {
          fieldLabels[field.id] = field.label;
        });
      });

      const exportData = responses.map(r => ({
        id: r.id,
        submitterName: r.submitterName,
        submitterEmail: r.submitterEmail,
        responseData: JSON.parse(r.responseData),
        createdAt: r.createdAt,
      }));

      const csv = exportFormResponsesToCSV(exportData, fieldLabels);

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="form-responses-${formId}.csv"`,
        },
      });
    }

    return Response.json(
      responses.map(r => ({
        ...r,
        responseData: JSON.parse(r.responseData),
      }))
    );
  } catch (error) {
    console.error('Responses GET error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { formId: formIdStr } = await params;
    const formId = parseInt(formIdStr);
    const body = await req.json();
    const { responseId, isRead, isStarred } = body;

    // Verify ownership
    const form = await db
      .select()
      .from(forms)
      .where(eq(forms.id, formId))
      .then(r => r[0]);

    if (!form) {
      return new Response(JSON.stringify({ error: 'Form not found' }), { status: 404 });
    }

    const profile = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.id, form.profileId), eq(profiles.userId, parseInt(String(session.user.id)))))
      .then(r => r[0]);

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Update response
    const updates: any = {};
    if (isRead !== undefined) updates.isRead = isRead ? 1 : 0;
    if (isStarred !== undefined) updates.isStarred = isStarred ? 1 : 0;

    await db
      .update(formResponses)
      .set(updates)
      .where(eq(formResponses.id, responseId));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Response PATCH error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { formId: formIdStr } = await params;
    const formId = parseInt(formIdStr);
    const url = new URL(req.url);
    const responseId = url.searchParams.get('responseId');

    if (!responseId) {
      return new Response(JSON.stringify({ error: 'Response ID required' }), { status: 400 });
    }

    // Verify ownership
    const form = await db
      .select()
      .from(forms)
      .where(eq(forms.id, formId))
      .then(r => r[0]);

    if (!form) {
      return new Response(JSON.stringify({ error: 'Form not found' }), { status: 404 });
    }

    const profile = await db
      .select()
      .from(profiles)
      .where(and(eq(profiles.id, form.profileId), eq(profiles.userId, parseInt(String(session.user.id)))))
      .then(r => r[0]);

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await db
      .delete(formResponses)
      .where(eq(formResponses.id, parseInt(responseId)));

    // Update response count
    await db
      .update(forms)
      .set({ totalResponses: Math.max(0, form.totalResponses - 1) })
      .where(eq(forms.id, formId));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Response DELETE error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
