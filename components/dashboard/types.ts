export type Profile = {
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
};

export type Account = {
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

export type Transaction = {
  id: string;
  account_id: string;
  user_id?: string | null;
  type: string | null;
  method?: string | null;
  description: string | null;
  amount: number | null;
  balance_before: number | null;
  balance_after: number | null;
  status: string | null;
  by?: string | null;
  to?: string | null;
  reason?: string | null;
  fees?: number | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string | null;
  message: string | null;
  type: string | null;
  read: boolean | null;
  created_at: string;
};

export type Card = {
  id: string;
  user_id: string;
  account_id: string | null;
  card_number: string | null;
  card_type: string | null;
  expiry_date: string | null;
  cvv: string | null;
  status: string | null;
  issued_at: string | null;
};

export type Loan = {
  id: string;
  user_id: string;
  account_id: string | null;
  amount: number | null;
  interest_rate: number | null;
  status: string | null;
  due_date: string | null;
  repaid_amount: number | null;
  created_at: string | null;
};
