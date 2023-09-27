import { headers, cookies } from 'next/headers';

const currentLocale = (): string | undefined => {
    // header should always be present
    return headers().get('x-next-i18n-router-locale') ?? cookies().get('NEXT_LOCALE')?.value ?? undefined;
};

export default currentLocale;
