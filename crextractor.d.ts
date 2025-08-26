export type CrunchyrollAppCredentials = {
  // Crunchyroll app ID
  id: string;
  // Crunchyroll app secret
  secret: string;
  // Base64 encoded `id:secret` string
  encoded: string;
  // Ready HTTP header in the format `Basic <encoded>`, can be used to access some Crunchyroll APIs
  authorization: string;
};

/**
 * Extract credentials from the Crunchyroll Android APK using jadx.
 */
export function extract(options?: {
  target?: 'mobile' | 'tv';
  output?: string;
  cleanup?: boolean;
}): Promise<CrunchyrollAppCredentials>;

/**
 * Fetch ready credentials from the GitHub repository.
 */
export function pull(options?: { target: 'mobile' | 'tv' }): Promise<CrunchyrollAppCredentials>;
