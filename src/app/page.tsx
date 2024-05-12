'use client';

import { useUserStore } from '@/core/providers/UserProvider';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export default function Home() {
    const user = useUserStore(state => state.user);

    return (
        <>
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
        </>
    );
}
