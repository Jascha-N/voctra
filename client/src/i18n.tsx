import * as i18n from "i18next";
import * as XHR from "i18next-xhr-backend";

i18n.use(XHR).init({
    fallbackLng: "en",
    lng: "nl",
    wait: true,
});

export default i18n;
