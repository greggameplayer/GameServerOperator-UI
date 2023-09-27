import {Icon} from "@iconify/react";
import i18nConfig from "@/../i18nConfig";
import Select, {ActionMeta} from "react-select";
import Cookies from "universal-cookie";
import {useId, useState} from "react";
import { useRouter } from 'next/navigation';

// enhance the component to prevent stupid injection in language
export const LanguageSwitcher = ({className} : {className?: string}) => {
    const router = useRouter();
    const currentLocale = (new Cookies()).get('NEXT_LOCALE') ?? i18nConfig.defaultLocale;

    const handleOnChange = (newValue: any, actionMeta: ActionMeta<any[]>) => {
        if (newValue && newValue.value !== currentLocale) {
            setSelectedOption(newValue.value);
            (new Cookies()).set('NEXT_LOCALE', newValue.value, {path: '/'});
            router.refresh();
        }
    }

    // sort by currently selected locale
    const options : any[] = i18nConfig.locales.map((locale) => {
        return {
            value: locale,
            label: <Icon icon={`flagpack:${(locale === 'en') ? 'us' : locale}`}/>
        }
    }).sort((a, b) => {
        if (a.value === currentLocale) {
            return -1;
        } else if (b.value === currentLocale) {
            return 1;
        } else {
            return 0;
        }
    });

    const [selectedOption, setSelectedOption] = useState(options.find((v) => v.value === currentLocale));

    return (
        <Select isSearchable={false} onChange={handleOnChange} options={options} defaultValue={selectedOption} instanceId={useId()} className={`${className} my-react-select-container`}
                classNamePrefix="my-react-select"/>
    )
}

export default LanguageSwitcher;
