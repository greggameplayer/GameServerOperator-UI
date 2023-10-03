"server-only";

import { createIntl, createIntlCache } from '@formatjs/intl';
import currentLocale from "@/components/currentLocale";
import fr from "@/i18n/fr.json";
import en from "@/i18n/en.json";

const messages = new Map([
    ["fr", fr],
    ["en", en]
]);

const getMessages = (lang: string) => {
    return messages.get(lang);
};

export default function getIntl() {
    const lang: string = currentLocale()!;

    const cache = createIntlCache();

    return createIntl({
        locale: lang,
        messages: getMessages(lang)
    }, cache);
}

export function getIntlWithLocale(locale: string) {
    const cache = createIntlCache();

    return createIntl({
        locale: locale,
        messages: getMessages(locale)
    }, cache);
}
