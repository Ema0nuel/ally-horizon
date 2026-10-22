import { getBrowserClient } from "@/lib/supabase/browser";

type CreateNotificationArgs = {
  userId: string;
  title: string;
  message: string;
  type?: string;
};

/** Inserts a notification row for a user (best-effort, never throws). */
export async function createNotification({
  userId,
  title,
  message,
  type = "info",
}: CreateNotificationArgs) {
  const supabase = getBrowserClient();
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      title,
      message,
      type,
      read: false,
    });
  } catch {
    // Notifications are non-critical; swallow errors so the action can proceed.
  }
}
