import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const profiles = await base44.asServiceRole.entities.UserProfile.list('-updated_date', 500);

    const notifiedUsers = [];

    for (const profile of profiles) {
      const lastActivity = new Date(profile.updated_date || profile.created_date);
      if (lastActivity > sevenDaysAgo) continue;

      let email = null;
      try {
        const userRecord = await base44.asServiceRole.entities.User.get(profile.created_by_id);
        email = userRecord.email;
      } catch (e) {
        continue;
      }

      if (!email) continue;

      await base44.asServiceRole.entities.Notification.create({
        user_id: profile.created_by_id,
        type: 'daily_puzzle_reminder',
        message: 'Your daily puzzle is waiting! Come back and keep your streak alive.',
        link: '/tactics',
        read: false
      });

      notifiedUsers.push({ user_id: profile.created_by_id, email });
    }

    return Response.json({ notified_users: notifiedUsers, count: notifiedUsers.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});