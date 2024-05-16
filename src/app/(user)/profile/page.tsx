'use client';

import { useUserStore } from '@/core/providers/UserProvider';
import { UserAvatar, UserInitials, UserLinks } from '@/entities/user/ui/User';
import { Wishes } from '@/entities/user/ui/Wishes';
import { WishDialog } from '@/features/wish/ui/WishDialog';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { UserWidget } from '@/widgets/user/ui';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function Home() {
    const store = useUserStore(state => state);
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
                header={<Skeleton />}
                links={<Skeleton />}
                action={<Skeleton />}
            />
        );
    }

    return (
        <div className="flex w-full flex-col items-center gap-3">
            <Button onClick={() => router.push('/')}>Go home</Button>
            <div className="flex flex-col space-y-4">
                <UserWidget
                    avatar={<UserAvatar href={store.user.picture} />}
                    header={
                        <UserInitials
                            name={store.user.name}
                            surname={store.user.surname}
                        />
                    }
                    links={
                        <UserLinks
                            followings={store.user?.followings}
                            followers={store.user?.followers}
                            reservations={store.user?.reservations}
                            wishes={store.user?.wishes}
                        />
                    }
                    action={<WishDialog />}
                />
                <Wishes subheader="Wishes" />
            </div>
        </div>
    );
}
