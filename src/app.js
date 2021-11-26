import { createApp, createSSRApp } from 'vue'
import App from './App.vue'
import { setupI18n } from "./i18n";
import { setupRouter } from "./router";
import store from './store'
import en from "./locales/en.json";

export default function buildApp() {
    const isSSR = typeof window === "undefined";
    const app = isSSR ? createSSRApp(App) : createApp(App);
    const defaultLang = isSSR ? "en" : navigator.language.split("-")[0] || process.env.VUE_APP_I18N_LOCALE || "en";
    const i18n = setupI18n({
        globalInjection: true,
        legacy: false,
        locale: defaultLang,
        fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
        messages: {
        en
        }
    });
    const router = setupRouter(i18n);

    app.use(store).use(router).use(i18n);
    return { app, router, store };
}
