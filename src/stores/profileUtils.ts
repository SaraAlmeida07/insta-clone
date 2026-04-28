/**
 * Retorna o objeto padrão para autores/usuários quando os dados estão ausentes
 */
export function defaultAuthor() {
  return {
    id: 0,
    name: 'Usuário',
    username: 'usuario',
    avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  };
}

/**
 * Constantes de limites e validação para o perfil do usuário
 */
export const PROFILE_LIMITS = {
  NAME_MAX: 255,
  USERNAME_MAX: 30,
  BIO_MAX: 500,
  AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  USERNAME_REGEX: /^[A-Za-z0-9._]+$/
};

/**
 * Utilitário para formatar URLs de avatar e posts
 */
export const profileUtils = {
  formatUrl(url: string | null, apiBase: string) {
    if (!url) {
      return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    }
    if (url.startsWith('http')) return url;
    return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
  }
};
