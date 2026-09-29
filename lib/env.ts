/** Feature detection for optional integrations. Each missing key has a documented fallback. */
export const integrations = {
  resend: () => Boolean(process.env.RESEND_API_KEY),
  google: () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  github: () => Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  meilisearch: () => Boolean(process.env.MEILISEARCH_HOST),
  pusher: () =>
    Boolean(process.env.PUSHER_APP_ID && process.env.PUSHER_SECRET && process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
  cloudinary: () => Boolean(process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)),
  judge0: () => Boolean(process.env.JUDGE0_URL || process.env.JUDGE0_RAPIDAPI_KEY),
  ai: () => Boolean(process.env.OPENAI_API_KEY),
} as const;

export type IntegrationName = keyof typeof integrations;

export function integrationStatus() {
  return Object.fromEntries(Object.entries(integrations).map(([k, fn]) => [k, fn()])) as Record<IntegrationName, boolean>;
}
