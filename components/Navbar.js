'use client'
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from 'next/navigation'

import BedtimeIcon from '@mui/icons-material/Bedtime';
import SunnyIcon from '@mui/icons-material/Sunny';
import { useSiteStore } from "./stores/useSiteStore";
import { Box } from "@mui/material";

export default function Navbar() {

    const pathname = usePathname()

    const darkMode = useSiteStore((state) => state.darkMode);
    const toggleDarkMode = useSiteStore((state) => state.toggleDarkMode);

    return (
        <nav>

            <div className="background"></div>

            <Link href="/" className="brand-wrap">

                <img
                    src="/icon.png"
                    width={50}
                    height={50}
                    alt=""
                />

                <Box className="brand-text" sx={{ color: 'white' }}>
                    Articles Backups
                </Box>

            </Link>

            <Box
                onClick={() => {
                    toggleDarkMode()
                }}
                sx={{
                    cursor: 'pointer',
                    position: 'absolute',
                    left: '50%',
                    // top: 0
                }}
            >
                {darkMode ? <BedtimeIcon sx={{ color: 'white' }} /> : <SunnyIcon sx={{ color: 'white' }} />}
            </Box>

            <div className="links">

                {[
                    {
                        name: 'Status',
                        url: '/'
                    },
                    {
                        name: 'Schedule',
                        url: '/schedule'
                    },
                    {
                        name: 'Backups',
                        url: '/backups'
                    },
                    {
                        name: 'Settings',
                        url: '/settings'
                    }
                ].map(obj => {
                    return (
                        <Link
                            key={obj.name}
                            className={
                                classNames(
                                    `link`,
                                    {
                                        "active": pathname == obj.url
                                    }
                                )
                            }
                            href={obj.url}
                        >
                            {obj.name}
                        </Link>
                    )
                })}

            </div>

        </nav>
    );
}
