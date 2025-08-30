// zoomAuth.ts
import axios, { AxiosRequestConfig } from "axios";

let cachedToken: string | null = null,
  cachedExp = 0,
  inflight: Promise<string> | null = null;

export async function getZoomAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < cachedExp - 60) return cachedToken;
  if (inflight) return inflight;

  inflight = (async () => {
    const { ZOOM_S2S_ACCOUNT_ID, ZOOM_S2S_CLIENT_ID, ZOOM_S2S_CLIENT_SECRET } =
      process.env;
    const basic = Buffer.from(
      `${ZOOM_S2S_CLIENT_ID}:${ZOOM_S2S_CLIENT_SECRET}`
    ).toString("base64");
    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(ZOOM_S2S_ACCOUNT_ID!)}`;
    const { data } = await axios.post(url, null, {
      headers: { Authorization: `Basic ${basic}` },
    });
    cachedToken = data.access_token;
    cachedExp = Math.floor(Date.now() / 1000) + (data.expires_in || 3600);
    inflight = null;
    return cachedToken!;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}



export async function zoomApi<T = any>(cfg: AxiosRequestConfig): Promise<T> {
  const token = await getZoomAccessToken();
  const req = () =>
    axios({
      baseURL: "https://api.zoom.us/v2",
      ...cfg,
      headers: { Authorization: `Bearer ${token}`, ...(cfg.headers || {}) },
    });
  try {
    const { data } = await req();
    return data as T;
  } catch (e: any) {
    if (e.response?.status === 401) {
      const fresh = await getZoomAccessToken();
      const { data } = await axios({
        baseURL: "https://api.zoom.us/v2",
        ...cfg,
        headers: { Authorization: `Bearer ${fresh}`, ...(cfg.headers || {}) },
      });
      return data as T;
    }
    throw e;
  }
}
