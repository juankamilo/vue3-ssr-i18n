import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { loadLocaleMessages, setI18nLanguage, SUPPORT_LOCALES } from "@/i18n";
import HomeView from '../views/HomeView.vue'

export function setupRouter(i18n) {
  const locale = i18n.mode === "legacy" ? i18n.global.locale : i18n.global.locale.value;

  // setup routes
  const routes = [
    {
      path: "/:locale/",
      name: "Home",
      // component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
      component: HomeView
    },
    {
      path: "/:locale/about",
      name: "about",
      component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
  ];
  const isSSR = typeof window === "undefined";
  const history = isSSR ? createMemoryHistory() : createWebHistory();

  // create router instance
  const router = createRouter({
    history,
    routes
  });

  // navigation guards
  router.beforeEach(async to => {
    const paramsLocale = to.params.locale;

    // use locale if paramsLocale is not in SUPPORT_LOCALES
    if (!SUPPORT_LOCALES.includes(paramsLocale)) {
      return `/${locale}`;
    }

    // load locale messages
    if (!i18n.global.availableLocales.includes(paramsLocale)) {
      await loadLocaleMessages(i18n, paramsLocale);
    }

    // set i18n language
    setI18nLanguage(i18n, paramsLocale);
  });

  return router;
}
