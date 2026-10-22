import { getBrowserClient } from "@/lib/supabase/browser";
import { sendEmail } from "@/lib/emails";

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Persists a one-time code for an action (transfer, withdrawal, etc.). */
export async function storeOtp(userId: string, type: string): Promise<string> {
  const supabase = getBrowserClient();
  const code = generateOtp();
  const { error } = await supabase.from("otps").insert({
    user_id: userId,
    code,
    type,
    expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  });
  if (error) throw new Error(error.message);
  return code;
}

/** Verifies a code against the most recent matching, unexpired OTP row. */
export async function verifyOtp(
  userId: string,
  type: string,
  code: string
): Promise<boolean> {
  const supabase = getBrowserClient();
  const { data, error } = await supabase
    .from("otps")
    .select("*")
    .eq("user_id", userId)
    .eq("type", type)
    .eq("code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return false;
  return new Date(data.expires_at) > new Date();
}

type ActionOtpEmailArgs = {
  to: string;
  name?: string;
  otp: string;
  actionLabel: string;
  details: string;
};

/** Emails an action confirmation code (best-effort, never throws). */
export async function sendActionOtpEmail({
  to,
  name,
  otp,
  actionLabel,
  details,
}: ActionOtpEmailArgs) {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2 style="color: #180934;">Ally</h2>
      <p>Dear ${name || "Customer"},</p>
      <p>Use the code below to confirm your ${actionLabel}:</p>
      <div style="font-size: 2rem; font-weight: bold; letter-spacing: 0.2em; color: #180934; margin: 16px 0;">${otp}</div>
      <p>${details}</p>
      <p>This code expires in 10 minutes. If you did not request this, please contact support.</p>
      <hr style="margin: 24px 0;" />
      <p style="font-size: 0.9em; color: #888;">Ally &copy; ${new Date().getFullYear()}</p>
    </div>
  `;

  try {
    await sendEmail({ to, subject: `${actionLabel} — Verification Code`, html });
  } catch {
    // Email is best-effort; the code is still verifiable in-app.
  }
}
