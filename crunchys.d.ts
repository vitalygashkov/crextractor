export function extractSecrets(): Promise<{
  // Crunchyroll app ID
  id: string;
  // Crunchyroll app secret
  secret: string;
  // Base64 encoded `id:secret` string
  encoded: string;
  // Basic `Authorization` header to access Crunchyroll mobile APIs
  header: string;
}>;
