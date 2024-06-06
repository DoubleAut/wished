import { ReactNode } from 'react';

interface Props {
    logo: ReactNode;
    links: ReactNode;
    profile: ReactNode;
}

export const HeaderWidget = ({ logo, links, profile }: Props) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur-xl">
            <div className="container flex h-14 w-full max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex md:items-center">
                    <div className="mr-6">{logo}</div>
                    {links}
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    {profile}
                </div>
            </div>
        </header>
    );
};
