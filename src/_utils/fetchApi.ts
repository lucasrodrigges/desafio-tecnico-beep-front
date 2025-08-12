export const handleDeviceId = (apiDeviceId?: string | null) => {
  let deviceId = apiDeviceId;

  if (deviceId) {
    localStorage.setItem('deviceId', deviceId);
  } else {
    deviceId = localStorage.getItem('deviceId');
  }

  return deviceId || '';
}

export const handleAuthorization = (apiToken?: string | null) => {
  let token = apiToken;

  if (apiToken) {
    const cleanToken = apiToken.replace(/^Bearer\s+/i, '');
    localStorage.setItem('session', cleanToken);
  } else {
    token = localStorage.getItem('session');
  }

  return token ? `Bearer ${token}` : '';
}

export const get = async <T>(url: string, options?: RequestInit): Promise<{ data: T | null; error: string | null }> => {
  try {
    const res = await fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        'Authorization': handleAuthorization(),
        'X-Device-ID': handleDeviceId(),
        ...options?.headers,
      },
    });

    if (!res.ok) throw new Error('Erro ao buscar dados');

    const authorization = res.headers.get('Authorization');
    const deviceId = res.headers.get('X-Device-ID');

    if (authorization) handleAuthorization(authorization);
    if (deviceId) handleDeviceId(deviceId);

    return {
      data: await res.json(),
      error: null,
    }
  } catch {
    return {
      data: null,
      error: 'Erro desconhecido'
    }
  }
};
