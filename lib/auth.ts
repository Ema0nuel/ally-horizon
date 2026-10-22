import { getBrowserClient } from "@/lib/supabase/browser";
import { sendOtpEmail, sendWelcomeEmail } from "@/lib/emails";

export async function getGeoLocation(ip: string) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    return {
      city: data.city ?? "",
      region: data.region ?? "",
      country: data.country_name ?? "",
    };
  } catch {
    return { city: "", region: "", country: "" };
  }
}

async function verifyCaptcha(captchaToken: string | null | undefined) {
  if (!captchaToken) throw new Error("Captcha required. Please complete the challenge.");
  const res = await fetch("/api/captcha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: captchaToken }),
  });
  if (!res.ok) throw new Error("Captcha verification failed. Please try again.");
  return true;
}

async function findUserByAccessId(
  accessID: string
): Promise<{ id: string; email: string; full_name: string | null } | null> {
  const supabase = getBrowserClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .or(`email.eq.${accessID},username.eq.${accessID}`)
    .maybeSingle();

  if (profile) return profile;

  if (!accessID) return null;

  const { data: account } = await supabase
    .from("accounts")
    .select("user_id")
    .eq("account_number", accessID)
    .maybeSingle();

  if (!account?.user_id) return null;

  const { data: byAccount } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", account.user_id)
    .maybeSingle();

  return byAccount ?? null;
}

async function issueLoginOtp(userData: { id: string; email: string; full_name: string | null }) {
  const supabase = getBrowserClient();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Reuse the password saved at login so a resent OTP can still open a session.
  const { data: latest } = await supabase
    .from("login_otps")
    .select("temp_password")
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: otpInsertError } = await supabase.from("login_otps").insert({
    user_id: userData.id,
    otp,
    expires_at: expiresAt,
    used: false,
    temp_password: latest?.temp_password ?? null,
  });
  if (otpInsertError) throw new Error("Could not create login code. Please try again.");

  await sendOtpEmail({ to: userData.email, name: userData.full_name ?? undefined, otp });
}

export async function loginAndSendOtp(
  accessID: string,
  password: string,
  captchaToken: string | null
) {
  await verifyCaptcha(captchaToken);

  const supabase = getBrowserClient();

  const userData = await findUserByAccessId(accessID);
  if (!userData || !userData.email) throw new Error("Invalid credentials.");

  const { data: isValid, error: rpcError } = await supabase.rpc(
    "validate_auth_password",
    { p_email: userData.email, p_password: password }
  );

  if (rpcError || !isValid) throw new Error("Invalid credentials.");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { error: otpInsertError } = await supabase.from("login_otps").insert({
    user_id: userData.id,
    otp,
    expires_at: expiresAt,
    used: false,
    temp_password: password,
  });
  if (otpInsertError) throw new Error("Could not create login code. Please try again.");

  await sendOtpEmail({ to: userData.email, name: userData.full_name ?? undefined, otp });

  return true;
}

// Resend issues a fresh OTP for an access ID already past the password step.
// No password is supplied or checked here.
export async function resendOtp(accessID: string) {
  const userData = await findUserByAccessId(accessID);
  if (!userData || !userData.email) throw new Error("Could not resend code.");

  await issueLoginOtp(userData);

  return true;
}

export async function verifyOtp(accessID: string, otp: string, password?: string | null) {
  const supabase = getBrowserClient();

  const userData = await findUserByAccessId(accessID);
  if (!userData || !userData.id) {
    throw new Error("User not found. Please use a valid email address or account number.");
  }

  const { data: otpData } = await supabase
    .from("login_otps")
    .select("*")
    .eq("user_id", userData.id)
    .eq("otp", otp)
    .eq("used", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otpData || new Date(otpData.expires_at) < new Date()) {
    throw new Error("Invalid or expired OTP.");
  }

  const signInPassword = password || otpData.temp_password;
  if (!signInPassword) {
    throw new Error("Please log in again with your password.");
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: userData.email,
    password: signInPassword,
  });

  if (authError || !authData?.session) {
    throw new Error("Session could not be created.");
  }

  // Burn the code only after the session exists so a failed attempt can retry.
  await supabase
    .from("login_otps")
    .update({ used: true, temp_password: null })
    .eq("id", otpData.id);

  return {
    id: authData.user.id,
    email: authData.user.email ?? "",
  };
}

export interface SignupFormData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  title?: string;
  phone1?: string;
  selectcountry?: string;
  country?: string;
  uaddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  dob?: string;
  occupation?: string;
  ssn?: string;
  marital?: string;
  gender?: string;
  acctype?: string;
}

export async function signupUser(
  formData: SignupFormData,
  ip: string,
  captchaToken: string | null
) {
  await verifyCaptcha(captchaToken);

  const supabase = getBrowserClient();
  const {
    email,
    password,
    firstname,
    lastname,
    title,
    phone1,
    selectcountry,
    country,
    uaddress,
    city,
    state,
    zip,
    dob,
    occupation,
    ssn,
    marital,
    gender,
    acctype,
  } = formData;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  if (!data?.user?.id) throw new Error("Failed to create user account");

  const userId = data.user.id;
  const fullName = `${firstname} ${lastname}`;

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    full_name: fullName,
    title: title || null,
    firstname,
    lastname,
    phone: phone1 || null,
    country_code: selectcountry || null,
    nationality: country || null,
    address: uaddress || null,
    city: city || null,
    state: state || null,
    zip: zip || null,
    dob: dob || null,
    occupation: occupation || null,
    ssn: ssn || null,
    marital_status: marital || null,
    gender: gender || null,
    email,
    username: fullName,
  });
  if (profileError) throw new Error(profileError.message);

  const account_number = "10" + Math.floor(1000000000 + Math.random() * 9000000000);
  const { data: accountData, error: accountError } = await supabase
    .from("accounts")
    .insert({
      user_id: userId,
      account_type: acctype || "USD SAVING",
      account_number,
      balance: 0,
      interest_rate: acctype === "USD SAVING" ? 2.5 : 4.0,
    })
    .select()
    .single();
  if (accountError) throw new Error(accountError.message);

  const { error: cryptoError } = await supabase.from("crypto_balances").insert({
    user_id: userId,
    account_id: accountData.id,
    btc_balance: 0,
    eth_balance: 0,
    usdt_balance: 0,
    usdc_balance: 0,
    bnb_balance: 0,
    sol_balance: 0,
  });
  if (cryptoError) throw new Error(cryptoError.message);

  const geo = await getGeoLocation(ip);
  await sendWelcomeEmail({
    name: fullName,
    email,
    accountNumber: account_number,
    ip,
    geo,
  });

  return userId;
}

export async function forgotPassword(email: string, captchaToken: string | null) {
  await verifyCaptcha(captchaToken);

  const supabase = getBrowserClient();
  const redirectUrl =
    (typeof window !== "undefined" ? window.location.origin : "https://allyhorizon.cc") +
    "/reset-password";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) throw new Error(error.message);
}

export async function resetPassword(password: string) {
  const supabase = getBrowserClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);
}

export async function resendVerificationEmail(email: string) {
  const supabase = getBrowserClient();
  const { error } = await supabase.auth.resend({ type: "signup", email });
  if (error) throw new Error(error.message);
}
