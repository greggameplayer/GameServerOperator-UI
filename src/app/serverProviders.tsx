"server-only"

import {ServerIntlProvider} from "@/components/ServerIntlProvider";
import getIntl from "@/components/intl";
import {Metadata} from "next";

export const ServerProviders = async ({children}: { children: React.ReactNode }) => {
    const intl = await getIntl();

    return (
        <ServerIntlProvider messages={intl.messages} locale={intl.locale}>
            {children}
        </ServerIntlProvider>
    );
}
