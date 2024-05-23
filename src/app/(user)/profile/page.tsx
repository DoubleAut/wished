'use client';

import { useViewerStore } from '@/core/providers/ViewerProvider';
import {
    UserAvatar,
    UserInitials,
    UserLinksVertical,
} from '@/entities/user/ui/User';
import { Wishes } from '@/entities/user/ui/Wishes';
import { WishDialog } from '@/features/wish/ui/WishDialog';
import { Skeleton } from '@/shared/ui/skeleton';
import { UserWidget } from '@/widgets/user/ui';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function Home() {
    const store = useViewerStore(state => state);
    const router = useRouter();

    useLayoutEffect(() => {
        if (!store.user) {
            const error =
                'Profile page is not accessible, without authorization';

            router.push(`/auth/login?error=${error}&callbackUrl=/profile`);
        }
    }, [router]);

    if (!store.user) {
        return (
            <UserWidget
                avatar={<Skeleton />}
                initials={<Skeleton />}
                links={<Skeleton />}
                action={<Skeleton />}
            />
        );
    }

    return (
        <div className="container flex flex-col space-y-4">
            <UserWidget
                avatar={<UserAvatar href={store.user.picture} />}
                initials={
                    <UserInitials
                        name={store.user.name}
                        surname={store.user.surname}
                    />
                }
                links={
                    <UserLinksVertical
                        followings={store.user.followings}
                        followers={store.user.followers}
                        reservations={store.user.reservations}
                        wishes={store.user.wishes}
                    />
                }
                action={<WishDialog />}
            />
            <Wishes subheader="Wishes" />
        </div>
    );
}
