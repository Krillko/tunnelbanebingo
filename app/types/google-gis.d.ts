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

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(config: GisTokenClientConfig): GisTokenClient;
        };
      };
    };
  }
}

export {};
