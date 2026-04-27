/**
 * Utilitários de formatação de data centralizados.
 * Utiliza Intl.DateTimeFormat para performance e consistência.
 */

const locale = 'pt-BR';

const dayMonthYear = new Intl.DateTimeFormat(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const shortDate = new Intl.DateTimeFormat(locale, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

const relativeTime = new Intl.RelativeTimeFormat(locale, {
  numeric: 'auto'
});

/**
 * Formata uma data para "27 de abril de 2026"
 */
export const formatDayMonthYear = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return dayMonthYear.format(d);
};

/**
 * Formata uma data para "27/04/2026"
 */
export const formatShortDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return shortDate.format(d);
};

/**
 * Retorna uma string relativa (ex: "há 2 horas", "ontem")
 * Implementação simplificada para o MVP.
 */
export const formatRelative = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'agora mesmo';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `há ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `há ${diffInHours} h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `há ${diffInDays} dias`;
  
  return formatShortDate(d);
};
