// import axios from "axios";
import { nextTick } from "vue";
import { createI18n } from "vue-i18n";

export const SUPPORT_LOCALES = ["en", "es"];

export function setupI18n(options = { locale: "en" }) {
  const i18n = createI18n(options);
  setI18nLanguage(i18n, options.locale);
  return i18n;
}

export function setI18nLanguage(i18n, locale) {
  if (i18n.mode === "legacy") {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  const isSSR = typeof window === "undefined";
  if (!isSSR) {
    document.querySelector("html").setAttribute("lang", locale);
  }
}

export async function loadLocaleMessages(i18n, locale) {
  // load locale messages with dynamic import
  const messages = await import(/* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`);
  // const messages = await apiClient.get(locale + ".json");
  // console.log(messages);

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default);

  return nextTick();
}

// const apiClient = axios.create({
//   baseURL: process.env.NODE_ENV === "development" ? `http://localhost/locales/` : `https://redesign.rentingcarz.com/locales/`,
//   // baseURL: `http://localhost/locales/`,
//   withCredentials: false, // This is the default
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*"
//   }
// });
