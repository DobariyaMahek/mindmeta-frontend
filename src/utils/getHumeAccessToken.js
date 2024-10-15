import { fetchAccessToken } from "@humeai/voice";

export const getHumeAccessToken = async () => {
  const accessToken = await fetchAccessToken({
    apiKey: process.env.REACT_APP_HUME_API_KEY, // Use REACT_APP_ prefix
    secretKey: process.env.REACT_APP_HUME_SESSION_KEY, // Use REACT_APP_ prefix
  });

  if (!accessToken) {
    return null;
  }

  return accessToken ?? null;
};
