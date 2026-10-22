import { getBrowserClient } from "@/lib/supabase/browser";

export type AdminProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  dob: string | null;
  occupation: string | null;
  gender: string | null;
  marital_status: string | null;
  nationality: string | null;
  country_code: string | null;
  ssn: string | null;
  title: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type AdminAccount = {
  id: string;
  user_id: string;
  account_type: string | null;
  account_number: string | null;
  balance: number | null;
  interest_rate: number | null;
  is_active: boolean | null;
  mortgage: number | null;
  loan: number | null;
  created_at?: string | null;
};

export type AdminCryptoBalance = {
  id: string;
  user_id: string;
  account_id: string;
  btc_balance: number | null;
  eth_balance: number | null;
  usdt_balance: number | null;
  usdc_balance: number | null;
  bnb_balance: number | null;
  sol_balance: number | null;
};

export type AdminUser = AdminProfile & {
  account: AdminAccount | null;
  crypto: AdminCryptoBalance | null;
  total_balance: number;
};

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const supabase = getBrowserClient();
  const [{ data: profiles }, { data: accounts }, { data: crypto }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("accounts").select("*"),
    supabase.from("crypto_balances").select("*"),
  ]);

  const profileList = (profiles as AdminProfile[]) ?? [];
  const accountList = (accounts as AdminAccount[]) ?? [];
  const cryptoList = (crypto as AdminCryptoBalance[]) ?? [];

  return profileList.map((profile) => {
    const account = accountList.find((a) => a.user_id === profile.id) ?? null;
    const crypt = cryptoList.find((c) => c.user_id === profile.id) ?? null;
    const total_balance = accountList
      .filter((a) => a.user_id === profile.id)
      .reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
    return { ...profile, account, crypto: crypt, total_balance };
  });
}
