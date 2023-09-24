"use client";

import {IntlProvider, MessageFormatElement} from 'react-intl';

export async function ServerIntlProvider({messages, locale, children}: { messages: Record<string, string> | Record<string, MessageFormatElement[]> | undefined, locale: string, children: React.ReactNode }) {


    return (
        <IntlProvider messages={messages} locale={locale}>
            {children}
        </IntlProvider>
    );
}
