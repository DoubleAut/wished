'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import { AUTH_LINKS } from '@/shared/lib/constants/Links';
import { Navigation } from '../Navigation';
import { Avatar, AvatarImage } from '../avatar';

export const AuthHeader = () => {
    const user = useViewerStore(state => state.user);

    if (!user) {
        return <Navigation links={AUTH_LINKS} />;
    }

    return (
        <Avatar className="h-10 w-10">
            <AvatarImage src="avatar_not_found.png" />
        </Avatar>
    );
};
