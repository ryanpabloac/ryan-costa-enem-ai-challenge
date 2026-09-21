const TOKEN_COOKIE_NAME = 'token';

/**
 * Registra o token JWT no cookie do navegador com atributos de segurança padrão.
 * Nota: cookies criados via JavaScript usam SameSite=Lax e Path=/.
 */
export function setAuthCookie(token: string, days = 7): void {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split('=');
    if (name === TOKEN_COOKIE_NAME) {
      return decodeURIComponent(rest.join('='));
    }
  }

  return null;
}

/**
 * Remove o token do cookie expirando sua validade.
 */
export function removeAuthCookie(): void {
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
