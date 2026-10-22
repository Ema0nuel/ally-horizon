type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, html }),
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to send email");
  return data.result;
}

type WelcomeEmailArgs = {
  name: string;
  email: string;
  accountNumber: string;
  ip: string;
  geo: { city: string; region: string; country: string };
};

export async function sendWelcomeEmail({
  name,
  email,
  accountNumber,
  ip,
  geo,
}: WelcomeEmailArgs) {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; padding: 24px; background-color: #f4f4f4; color: #333;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden;">
        <div style="padding: 24px; text-align: center; background-color: #180934;">
          <h1 style="color: #f5c962; margin: 0;">Ally</h1>
          <p style="color: #fff; margin: 8px 0 0;">Welcome to Ally</p>
        </div>
        <div style="padding: 24px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for choosing <strong>Ally</strong>. Your account has been successfully created.</p>
          <h3 style="margin-top: 24px;">Account Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Account Number:</strong> ${accountNumber}</li>
            <li><strong>Registered IP:</strong> ${ip}</li>
            <li><strong>Region:</strong> ${[geo.city, geo.region, geo.country].filter(Boolean).join(", ")}</li>
          </ul>
          <p style="margin-top: 24px;">You can access your dashboard anytime at allyhorizon.cc</p>
          <p style="font-size: 0.9rem; color: #777; margin-top: 32px;">
            If this wasn't you, please contact our support immediately.<br/>
            Ally, proudly serving you with security and trust.
          </p>
        </div>
        <div style="padding: 16px; background: #180934; color: #f5c962; text-align: center;">
          &copy; ${new Date().getFullYear()} Ally
        </div>
      </div>
    </div>
  `;

  await sendEmail({ to: email, subject: "Welcome to Ally", html });
}

type OtpEmailArgs = {
  to: string;
  name?: string;
  otp: string;
};

export async function sendOtpEmail({ to, name, otp }: OtpEmailArgs) {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2 style="color: #180934;">Ally</h2>
      <p>Dear ${name || "User"},</p>
      <p>Your One-Time Password (OTP) for login is:</p>
      <div style="font-size: 2rem; font-weight: bold; letter-spacing: 0.2em; color: #180934; margin: 16px 0;">
        ${otp}
      </div>
      <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
      <hr style="margin: 24px 0;">
      <p style="font-size: 0.9em; color: #888;">Ally &copy; ${new Date().getFullYear()}</p>
    </div>
  `;

  await sendEmail({ to, subject: "Your One-Time Password (OTP) for Login", html });
}
