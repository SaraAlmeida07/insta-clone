/**
 * Utilitários e constantes compartilhados para perfis.
 */

export const PROFILE_NAME_MAX_LENGTH = 150;
export const PROFILE_USERNAME_MAX_LENGTH = 30;
export const PROFILE_BIO_MAX_LENGTH = 500;
export const PROFILE_AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2 MB

/**
 * Retorna um objeto de autor padrão (fallback) para posts ou comentários
 * que não possuem dados de autor completos.
 */
export const defaultAuthor = () => ({
  id: 0,
  name: 'Usuário',
  username: 'usuario',
  avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
});

/**
 * Valida o formato de um username
 */
export const isValidUsername = (username: string) => {
  const regex = /^[A-Za-z0-9._]+$/;
  return regex.test(username) && username.length <= PROFILE_USERNAME_MAX_LENGTH;
};
