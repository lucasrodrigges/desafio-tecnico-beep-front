export const handleAuthorization = (apiToken?: string | null) => {
  let token = apiToken;

  if (token) {
    localStorage.setItem('session', token.replace('Bearer', ''));
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
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error('Erro ao buscar dados');

    const authorization = res.headers.get('Authorization');
    if (authorization) handleAuthorization(authorization);

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
