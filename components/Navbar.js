'use client'
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from 'next/navigation'

export default function Navbar() {

    const pathname = usePathname()

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

                <div className="brand-text">
                    Articles Backups
                </div>

            </Link>

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
