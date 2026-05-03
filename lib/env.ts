type EnvKey =
  | "NEXT_PUBLIC_APP_URL"
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY";

type OptionalEnvKey =
  | "OPENAI_API_KEY"
  | "RESEND_API_KEY"
  | "STRIPE_SECRET_KEY"
  | "STRIPE_WEBHOOK_SECRET";

type AppEnv = Record<EnvKey, string> & Partial<Record<OptionalEnvKey, string>>;

const requiredEnvKeys: EnvKey[] = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

function readEnvValue(key: EnvKey | OptionalEnvKey): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value : undefined;
}

export function getEnv(): AppEnv {
  const missing = requiredEnvKeys.filter((key) => !readEnvValue(key));

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const env: AppEnv = {
    NEXT_PUBLIC_APP_URL: readEnvValue("NEXT_PUBLIC_APP_URL")!,
    NEXT_PUBLIC_SUPABASE_URL: readEnvValue("NEXT_PUBLIC_SUPABASE_URL")!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: readEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY")!,
  };

  const optionalEnvKeys: OptionalEnvKey[] = [
    "OPENAI_API_KEY",
    "RESEND_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];

  for (const key of optionalEnvKeys) {
    const value = readEnvValue(key);
    if (value) {
      env[key] = value;
    }
  }

  return env;
}
