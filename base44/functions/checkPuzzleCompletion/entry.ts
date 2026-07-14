import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const notifiedUsers = body.notified_users || [];
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const emailsSent = [];

    for (const notified of notifiedUsers) {
      const recentAttempts = await base44.asServiceRole.entities.PuzzleAttempt.filter({
        created_by_id: notified.user_id,
        result: 'solved',
        created_date: { $gte: twentyFourHoursAgo.toISOString() }
      });

      if (recentAttempts.length > 0) continue;

      const appUrl = Deno.env.get("APP_URL") || 'https://chessmind.app';
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: notified.email,
        subject: 'Your Daily Challenge Awaits! ♟️',
        body: `Hi there!\n\nWe noticed you haven't completed your daily puzzle yet. Don't let your streak slip away!\n\nTake the Daily Challenge now: ${appUrl}/tactics\n\nKeep climbing,\nThe Chess God`
      });

      emailsSent.push(notified.email);
    }

    return Response.json({ emails_sent: emailsSent, count: emailsSent.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});