import i18nConfig from '../i18nConfig';
import {NextRequest, NextResponse} from "next/server";
import Negotiator from "negotiator";
import {match} from "@formatjs/intl-localematcher";

export function middleware(request: NextRequest) {
    // If you already have middleware that generates a response,
    // you can pass the response as a third argument for i18nRouter to use.
    const negotiatorHeaders: any = {};
    let chosenLanguage = (request.cookies.get('NEXT_LOCALE') === undefined) ? i18nConfig.defaultLocale : request.cookies.get('NEXT_LOCALE')!.value;

    if(!request.cookies.has('NEXT_LOCALE')) {
        request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

        const languages = new Negotiator({headers: negotiatorHeaders}).languages();

        chosenLanguage = match(languages, i18nConfig.locales, i18nConfig.defaultLocale);
    }
    const response = NextResponse.rewrite(request.nextUrl);
    response.cookies.set('NEXT_LOCALE', chosenLanguage);
    response.headers.set(
        'x-next-i18n-router-locale',
        chosenLanguage
    );
    return response;
}

// only applies this middleware to files in the app directory
export const config = {
    matcher: '/((?!api|static|.*\\..*|_next).*)'
};
