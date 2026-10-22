/**
 * Central operational configuration for Ally.
 *
 * Single source of truth for values that used to be hardcoded across the
 * old views (admin email, limits, durations, card types, transfer types,
 * currencies, locales, etc.). Views must read from here instead of inlining
 * literals. Environment-backed values fall back to sensible defaults.
 */

export type Currency = {
  code: string;
  label: string;
  symbol: string;
};

export type LocaleOption = {
  code: string;
  label: string;
};

export type Option = {
  value: string;
  label: string;
};

export type TransferField = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "textarea";
  required?: boolean;
  placeholder?: string;
  step?: string;
  min?: number;
};

export type TransferType = {
  key: "local" | "wire" | "interbank";
  label: string;
  description: string;
  otpType: string;
  fields: TransferField[];
};

export type CryptoNetwork = {
  network: string;
  address: string;
};

export type CryptoAsset = {
  symbol: string;
  name: string;
  networks: CryptoNetwork[];
};

export const bankConfig = {
  /** Support / admin contact email (client-accessible). */
  adminEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@allyhorizon.cc",

  /** Optional external payment link for deposit requests (may be empty). */
  paymentLink: process.env.NEXT_PUBLIC_PAYMENT_LINK || "",

  /** Storage bucket used for profile pictures. */
  avatarBucket: "profile-pictures",

  /** Storage bucket used for ID.me identity-verification documents. */
  idmeBucket: "idme-submissions",

  /** Native currency of the bank's accounts and cards. */
  baseCurrency: "USD",

  accountTypes: ["USD SAVING", "MONEY MARKET"] as const,

  limits: {
    minDeposit: 200,
    minCryptoDeposit: 50,
    minLoan: 100,
  },

  loan: {
    durations: [
      { value: "3", label: "3 months" },
      { value: "6", label: "6 months" },
      { value: "12", label: "12 months" },
      { value: "24", label: "24 months" },
    ] as Option[],
    interest: { min: 6, max: 10 },
  },

  cardTypes: [
    { value: "visa", label: "Visa Debit" },
    { value: "mastercard", label: "Mastercard Credit" },
  ] as Option[],

  /** How many years from now newly issued cards expire. */
  cardExpiryYears: 4,

  /**
   * Cryptocurrencies available for crypto deposits. Wallet addresses are
   * intentionally empty placeholders — configure them for your environment.
   */
  cryptoAssets: [
    { symbol: "BTC", name: "Bitcoin", networks: [{ network: "BTC", address: "1P2xvf43ragZWBKRacXVLsHb7Q6nqGqYis" }, {network: "BTC-2", address: "bc1q02e9fsglke2pymcsfgs7shqmcwn0a0acuex7hu"}] },
    { symbol: "ETH", name: "Ethereum", networks: [{ network: "ERC20", address: "0xe0f4f3bbb7dc16d8da05dba50924a10a03ff4b36" }, { network: "ETH", address: "0xe0f4f3bbb7dc16d8da05dba50924a10a03ff4b36"}] },
    {
      symbol: "USDT",
      name: "Tether USD",
      networks: [
        { network: "TRC20", address: "TJUg7dQcUD8CLzh8kU8hegr6inmYFrTXnb" },
        { network: "ERC20", address: "0xe0f4f3bbb7dc16d8da05dba50924a10a03ff4b36" },
      ],
    },
    { symbol: "USDC", name: "USD Coin", networks: [{ network: "ERC20", address: "0xe0f4f3bbb7dc16d8da05dba50924a10a03ff4b36" }] },
    { symbol: "SOL", name: "Solana", networks: [{ network: "SOL", address: "CkMpPKkjPc9QaboNxDZFHGcBzjDtUCzL2ESWaVGDw3i2" }] },
    { symbol: "BNB", name: "BNB Smart Chain", networks: [{ network: "BEP20", address: "0xe0f4f3bbb7dc16d8da05dba50924a10a03ff4b36" }] },
  ] as CryptoAsset[],

  /** Legal ID document types accepted for ID.me identity verification. */
  idmeIdTypes: [
    { value: "passport", label: "Passport" },
    { value: "drivers_license", label: "Driver's License" },
    { value: "national_id", label: "National ID" },
    { value: "visa", label: "Visa" },
  ] as Option[],

  cardStatuses: ["pending", "approved", "issued", "declined"] as const,

  currencies: [
    { code: "USD", label: "US Dollar", symbol: "$" },
    { code: "EUR", label: "Euro", symbol: "€" },
    { code: "GBP", label: "British Pound", symbol: "£" },
    { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  ] as Currency[],

  locales: [
    { code: "en-US", label: "English (United States)" },
    { code: "en-GB", label: "English (United Kingdom)" },
    { code: "fr-FR", label: "Français (France)" },
    { code: "de-DE", label: "Deutsch (Deutschland)" },
  ] as LocaleOption[],

  idleTimeoutOptions: [
    { value: "0", label: "Never" },
    { value: "5", label: "5 minutes" },
    { value: "10", label: "10 minutes" },
    { value: "30", label: "30 minutes" },
  ] as Option[],

  transferTypes: [
    { key: "local", label: "Local Transfer", description: "Send money to an account at another local bank." },
    { key: "wire", label: "Wire Transfer", description: "Send money internationally by SWIFT." },
    { key: "interbank", label: "Interbank Transfer", description: "Transfer between accounts within the bank." },
  ],

  transferForms: {
    local: {
      key: "local",
      label: "Local Transfer",
      description: "Send money to an account at another local bank.",
      otpType: "local",
      fields: [
        { name: "amount", label: "Amount", type: "number", required: true, min: 1, step: "0.01", placeholder: "0.00" },
        { name: "bankname", label: "Bank Name", type: "text", required: true, placeholder: "Beneficiary bank name" },
        { name: "accountName", label: "Account Holder", type: "text", required: true, placeholder: "Beneficiary account name" },
        { name: "accountNum", label: "Account Number", type: "text", required: true, placeholder: "Beneficiary account number" },
        { name: "desc", label: "Description", type: "textarea", required: true, placeholder: "Payment reference / note" },
      ],
    },
    wire: {
      key: "wire",
      label: "Wire Transfer",
      description: "Send money internationally by SWIFT.",
      otpType: "wire",
      fields: [
        { name: "amount", label: "Amount", type: "number", required: true, min: 1, step: "0.01", placeholder: "0.00" },
        { name: "bankname", label: "Bank Name", type: "text", required: true, placeholder: "Beneficiary bank name" },
        { name: "country", label: "Country", type: "text", required: true, placeholder: "e.g. USA" },
        { name: "accountName", label: "Account Holder", type: "text", required: true, placeholder: "Beneficiary account name" },
        { name: "accountNum", label: "Account Number", type: "text", required: true, placeholder: "Beneficiary account number" },
        { name: "swiftcode", label: "SWIFT Code", type: "text", required: true, placeholder: "SWIFT / BIC" },
        { name: "desc", label: "Description", type: "textarea", required: true, placeholder: "Payment reference / note" },
      ],
    },
    interbank: {
      key: "interbank",
      label: "Interbank Transfer",
      description: "Transfer between accounts within the bank.",
      otpType: "interbank",
      fields: [
        { name: "amount", label: "Amount", type: "number", required: true, min: 1, step: "0.01", placeholder: "0.00" },
        { name: "accountName", label: "Account Holder", type: "text", required: true, placeholder: "Beneficiary account name" },
        { name: "accountNum", label: "Account Number", type: "text", required: true, placeholder: "Beneficiary account number" },
        { name: "desc", label: "Description", type: "textarea", required: true, placeholder: "Payment reference / note" },
      ],
    },
  } satisfies Record<TransferType["key"], TransferType>,

  notificationTypes: ["info", "success", "warning", "danger"] as const,

  notificationPreferences: [
    { key: "transfers", label: "Transfers", description: "Transfers, deposits, and withdrawals." },
    { key: "security", label: "Security", description: "Sign-in and security alerts." },
    { key: "account", label: "Account updates", description: "Account status and statement updates." },
    { key: "marketing", label: "Marketing", description: "Offers and product news." },
  ],
};
