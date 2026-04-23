const CONNECTED_KEY = 'tunnelbanebingo-cloud-connected';
const EMAIL_KEY = 'tunnelbanebingo-cloud-email';

interface CloudState {
  schemaVersion: 1;
  updatedAt: string;
  visited: string[];
  homeStation: string | null;
  tramsIncluded: boolean;
}

// Singleton state shared across all callers
const signedInEmail = ref<string | null>(localStorage.getItem(EMAIL_KEY));
const syncStatus = ref<'idle' | 'signing-in' | 'syncing' | 'synced' | 'error'>('idle');
const lastSyncedAt = ref<Date | null>(null);
const syncError = ref<string | null>(null);

// Internal state — not reactive, managed manually
let _accessToken: string | null = null;
let _tokenExpiresAt = 0;
let _fileId: string | null = null;
let _tokenClient: GisTokenClient | null = null;
let _gisPromise: Promise<void> | null = null;
let _pendingResolve: ((token: string) => void) | null = null;
let _pendingReject: ((err: Error) => void) | null = null;
let _debounceTimer: ReturnType<typeof setTimeout> | null = null;

async function loadGis(): Promise<void> {
  if (window.google?.accounts) return;
  if (_gisPromise) return _gisPromise;
  _gisPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('GIS load failed'));
    document.head.appendChild(script);
  });
  return _gisPromise;
}

function ensureTokenClient(clientId: string) {
  if (_tokenClient) return;
  _tokenClient = window.google!.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/drive.appdata',
    callback: (resp) => {
      if (resp.error || !resp.access_token) {
        _pendingReject?.(new Error(resp.error ?? 'auth_failed'));
      } else {
        _accessToken = resp.access_token;
        _tokenExpiresAt = Date.now() + (resp.expires_in - 60) * 1000;
        _pendingResolve?.(_accessToken);
      }
      _pendingResolve = null;
      _pendingReject = null;
    },
    error_callback: (err) => {
      _pendingReject?.(new Error(err.type));
      _pendingResolve = null;
      _pendingReject = null;
    },
  });
}

async function acquireToken(prompt = ''): Promise<string> {
  if (_accessToken && Date.now() < _tokenExpiresAt) return _accessToken;
  if (!_tokenClient) throw new Error('Token client not initialized');
  return new Promise((resolve, reject) => {
    _pendingResolve = resolve;
    _pendingReject = reject;
    _tokenClient!.requestAccessToken({ prompt });
  });
}

async function getFileId(token: string): Promise<string | null> {
  if (_fileId) return _fileId;
  const resp = await fetch(
    'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name%3D\'bingo-state.json\'&fields=files(id)&pageSize=1',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!resp.ok) throw new Error(`Drive list: ${resp.status}`);
  const data = await resp.json() as { files: { id: string }[] };
  _fileId = data.files[0]?.id ?? null;
  return _fileId;
}

async function downloadState(token: string): Promise<CloudState | null> {
  const id = await getFileId(token);
  if (!id) return null;
  const resp = await fetch(
    `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!resp.ok) return null;
  return resp.json() as Promise<CloudState>;
}

async function uploadState(token: string, state: CloudState): Promise<void> {
  const id = await getFileId(token);
  const boundary = 'bingo_boundary';
  const meta = id ? '{}' : JSON.stringify({ name: 'bingo-state.json', parents: ['appDataFolder'] });
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    meta,
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(state),
    `--${boundary}--`,
  ].join('\r\n');

  const url = id
    ? `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=multipart`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

  const resp = await fetch(url, {
    method: id ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });
  if (!resp.ok) throw new Error(`Drive upload: ${resp.status}`);
  if (!id) {
    const created = await resp.json() as { id: string };
    _fileId = created.id;
  }
}

async function fetchEmail(token: string): Promise<string> {
  const resp = await fetch(
    'https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!resp.ok) return 'Google-konto';
  const data = await resp.json() as { user: { emailAddress: string } };
  return data.user.emailAddress ?? 'Google-konto';
}

function buildSnapshot(
  visitedSet: Set<string>,
  homeStationId: string | null,
  tramsIncluded: boolean
): CloudState {
  return {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    visited: [...visitedSet],
    homeStation: homeStationId,
    tramsIncluded,
  };
}

function applyCloudState(
  cloud: CloudState,
  markVisited: (id: string) => void,
  visitedSet: Set<string>,
  homeStationId: string | null,
  setHome: (id: string | null) => void,
  tramsIncluded: boolean,
  setTramsIncluded: (v: boolean) => void
) {
  cloud.visited.forEach(id => {
    if (!visitedSet.has(id)) markVisited(id);
  });
  if (cloud.homeStation !== homeStationId) setHome(cloud.homeStation);
  if (cloud.tramsIncluded !== tramsIncluded) setTramsIncluded(cloud.tramsIncluded);
}

function setError(msg: string) {
  syncStatus.value = 'error';
  syncError.value = msg;
}

export function useCloudSync() {
  const config = useRuntimeConfig();
  const cloudSyncAvailable = computed(() => !!config.public.googleClientId);
  const { visitedSet, markVisited } = useVisitedStations();
  const { homeStationId, setHome } = useHomeStation();
  const { tramsIncluded, setTramsIncluded } = useTramsIncluded();

  async function signInWithGoogle(): Promise<void> {
    syncStatus.value = 'signing-in';
    syncError.value = null;
    try {
      await loadGis();
      ensureTokenClient(config.public.googleClientId);
      const token = await acquireToken('select_account');

      syncStatus.value = 'syncing';

      const cloud = await downloadState(token);
      if (cloud) {
        applyCloudState(
          cloud,
          markVisited,
          visitedSet.value,
          homeStationId.value,
          setHome,
          tramsIncluded.value,
          setTramsIncluded
        );
      }

      await uploadState(token, buildSnapshot(visitedSet.value, homeStationId.value, tramsIncluded.value));

      const email = await fetchEmail(token);
      signedInEmail.value = email;
      localStorage.setItem(CONNECTED_KEY, 'google');
      localStorage.setItem(EMAIL_KEY, email);
      lastSyncedAt.value = new Date();
      syncStatus.value = 'synced';
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'popup_closed_by_user' || msg === 'access_denied') {
        setError('Inloggning avbröts.');
      } else {
        setError('Kunde inte ansluta till Google. Försök igen.');
      }
    }
  }

  async function syncNow(): Promise<void> {
    if (!signedInEmail.value) return;
    if (_debounceTimer) {
      clearTimeout(_debounceTimer);
      _debounceTimer = null;
    }
    syncStatus.value = 'syncing';
    syncError.value = null;
    try {
      const token = await acquireToken();
      await uploadState(token, buildSnapshot(visitedSet.value, homeStationId.value, tramsIncluded.value));
      lastSyncedAt.value = new Date();
      syncStatus.value = 'synced';
    } catch {
      setError('Kunde inte synka till Google Drive. Försök igen.');
    }
  }

  function debouncedSync() {
    if (!signedInEmail.value) return;
    if (_debounceTimer) clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(() => {
      _debounceTimer = null;
      syncNow();
    }, 3000);
  }

  function signOut() {
    _accessToken = null;
    _tokenExpiresAt = 0;
    _fileId = null;
    _tokenClient = null;
    signedInEmail.value = null;
    syncStatus.value = 'idle';
    lastSyncedAt.value = null;
    syncError.value = null;
    if (_debounceTimer) {
      clearTimeout(_debounceTimer);
      _debounceTimer = null;
    }
    localStorage.removeItem(CONNECTED_KEY);
    localStorage.removeItem(EMAIL_KEY);
  }

  return {
    cloudSyncAvailable,
    signedInEmail: readonly(signedInEmail),
    syncStatus: readonly(syncStatus),
    lastSyncedAt: readonly(lastSyncedAt),
    syncError: readonly(syncError),
    signInWithGoogle,
    syncNow,
    debouncedSync,
    signOut,
  };
}
