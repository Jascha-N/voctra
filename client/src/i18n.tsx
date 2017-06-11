import * as i18n from 'i18next';
import * as XHR from 'i18next-xhr-backend';

i18n.use(XHR).init({
    lng: "nl",
    fallbackLng: "en",
    wait: true,
    debug: true
});

export default i18n;
