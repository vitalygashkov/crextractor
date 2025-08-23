export function extractSecrets(): Promise<{
  // Crunchyroll app ID
  id: string;
  // Crunchyroll app secret
  secret: string;
  // Base64 encoded `id:secret` string
  encoded: string;
  // HTTP header with Basic Authorization to access Crunchyroll mobile APIs
  authorization: string;
}>;
