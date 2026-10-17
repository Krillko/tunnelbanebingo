interface GisTokenResponse {
  access_token: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

interface GisTokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: GisTokenResponse) => void;
  error_callback?: (error: { type: string }) => void;
}

interface GisTokenClient {
  requestAccessToken(overrideConfig?: { prompt?: string }): void;
}

// Not declared on `Window` directly: @nuxt/scripts already augments
// `window.google` with the Google Maps shape, and two conflicting
// declarations of the same property don't merge.
interface GoogleIdentityServices {
  accounts: {
    oauth2: {
      initTokenClient(config: GisTokenClientConfig): GisTokenClient;
    };
  };
}
