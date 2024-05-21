import { ReactNode } from 'react';

interface Props {
    logo: ReactNode;
    links: ReactNode;
    profile: ReactNode;
}

export const HeaderWidget = ({ logo, links, profile }: Props) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b">
            <div className="container flex h-14 w-full max-w-screen-2xl items-center justify-between">
                {logo}
                {links}
                {profile}
            </div>
        </header>
    );
};
