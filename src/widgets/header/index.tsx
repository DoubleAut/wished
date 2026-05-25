import { ReactNode } from 'react';

interface Props {
    logo: ReactNode;
    links: ReactNode;
    profile: ReactNode;
}

export const HeaderWidget = ({ logo, links, profile }: Props) => {
    return (
        <header className="border-accent/10 bg-card/80 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
                {/* Logo + Navigation together */}
                <div className="mr-4 flex items-center md:flex">
                    <div className="mr-6">{logo}</div>
                    {links}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Profile & Theme */}
                <div className="flex items-center gap-1.5">{profile}</div>
            </div>
        </header>
    );
};
