"use client";

import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";
import {Icon} from "@iconify/react";

export function ThemeSwitcher({className} : {className?: string}) {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if(!mounted) return null

    return (
        <Switch
            defaultSelected={theme === 'light'}
            size="lg"
            color="secondary"
            onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            thumbIcon={({ isSelected, className }) =>
                isSelected ? (
                    <Icon icon="line-md:moon-alt-to-sunny-outline-loop-transition" className={className} />
                ) : (
                    <Icon icon="line-md:sunny-outline-to-moon-loop-transition" className={className} />
                )
            }
            className={className}
        />
    )
}
