import { getPublicEnv } from "@/lib/env/public-env";

export type SupabaseClientConfig = {
  url: string;
  anonKey: string;
};

export function getSupabaseClientConfig(): SupabaseClientConfig {
  const env = getPublicEnv();

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}
