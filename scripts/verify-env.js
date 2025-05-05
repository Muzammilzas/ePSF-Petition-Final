const requiredEnvVars = [
  'VITE_SUPABASE_DATABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_APP_URL',
  'VITE_BREVO_API_KEY',
  'VITE_RECAPTCHA_SITE_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Error: Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`- ${envVar}`);
  });
  console.error('\nPlease set these environment variables in your Netlify dashboard:');
  console.error('Site settings > Build & deploy > Environment > Environment variables');
  process.exit(1);
}

console.log('✅ All required environment variables are set'); 