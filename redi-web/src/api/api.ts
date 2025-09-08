
import { API_BASE_URL } from '../constants/constants';
// If the file does not exist, create '../constants/constants.ts' with:
// export const API_BASE_URL = 'https://your-api-base-url.com';

// Returns the user's name (or throws if the request fails)
export const getName = async (uid: string): Promise<string | ''> => {
  const res = await fetch(
    `${API_BASE_URL}/api/users/${encodeURIComponent(uid)}/name`
  );

  if (!res.ok) {
    // Prefer returning '' so the caller can decide what to do
    console.warn(`getName → ${res.status}`);
    return '';
  }

  const { name } = (await res.json()) as { name?: string };
  return name ?? '';
};

export const apiSetName = async (uid: string, name: string): Promise<void> => {
  const res = await fetch(
    `${API_BASE_URL}/api/users/${encodeURIComponent(uid)}/name`,
    {
      method: 'PUT',                      // <- idempotent update
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }
  );

  if (!res.ok) {
    const msg = `setName failed – status ${res.status}`;
    console.error(msg);
    throw new Error(msg);
  }
};



