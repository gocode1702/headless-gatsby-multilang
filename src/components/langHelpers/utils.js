export const saveLocale = (siteUrl, locale) =>
  localStorage.setItem(`${siteUrl.slice(8)}_preferred_lang`, locale);
