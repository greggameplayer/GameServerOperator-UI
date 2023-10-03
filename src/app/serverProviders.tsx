"server-only"

import {ServerIntlProvider} from "@/components/ServerIntlProvider";
import getIntl from "@/components/intl";

export const ServerProviders = ({children}: { children: React.ReactNode }) => {
    const intl = getIntl();

    return (
        <ServerIntlProvider messages={intl.messages} locale={intl.locale}>
                {children}
        </ServerIntlProvider>
    );
}
