/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_DATABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_URL: string
  readonly VITE_LOCAL_URL: string
  readonly VITE_RESEND_API_KEY: string
  readonly VITE_BREVO_API_KEY: string
  readonly VITE_RECAPTCHA_SITE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 