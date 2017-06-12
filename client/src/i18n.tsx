import * as i18n from "i18next";
import * as XHR from "i18next-xhr-backend";

i18n.use(XHR).init({
    defaultNS: "common",
    fallbackLng: "en",
    lng: "nl",
    ns: "common",
});

export default i18n;
