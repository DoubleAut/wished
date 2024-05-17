'use client';

import { useUserStore } from '@/core/providers/UserProvider';
import { Navigation } from '@/shared/ui/Navigation';
import { Avatar, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { HeaderWidget } from '@/widgets/header';
import Link from 'next/link';

export default function Home() {
    const user = useUserStore(state => state.user);

    return (
        <>
            <HeaderWidget
                logo={'WISHER'}
                links={<Navigation />}
                profile={
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="avatar_not_found.png" />
                    </Avatar>
                }
            />
            <div className="container flex flex-col items-center">
                {user && (
                    <>
                        Signed in as {user.email} <br />
                        <button>Sign out</button>
                    </>
                )}
                {!user && (
                    <>
                        Not signed in <br />
                        <Button variant="link">
                            <Link href="/auth/login">Sign in</Link>
                        </Button>
                    </>
                )}

                <Link href="/profile">Profile!</Link>
            </div>
        </>
    );
}
